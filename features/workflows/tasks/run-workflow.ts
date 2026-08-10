import { logger, metadata, task, schedules, tasks } from "@trigger.dev/sdk"
import type { DeserializedJson } from "@trigger.dev/core"
import { Stagehand } from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executors"
import {
  interpolate,
  type NodeOutputs,
  type LoopState,
} from "@/features/workflows/lib/interpolate"
import { getWorkflow } from "@/features/workflows/data"
import type { NodeType, StepNodeType } from "@/features/workflows/nodes/node-registry"
import type { Edge } from "@xyflow/react"

const MAX_TOTAL_STEP_EXECUTIONS = 500

// One entry per node the run will walk, published to the run's metadata under
// "steps" so the canvas — and the run console below it — can watch each node
// move through its lifecycle live and inspect what it produced.
export type RunStep = {
  nodeId: string
  // The node's registry type (for its icon/accent) and title, denormalized so
  // the console can render a step without re-reading the graph.
  type: NodeType
  title: string
  status: "pending" | "running" | "done" | "failed" | "skipped"
  // Wall-clock time the executor took, set once the step leaves "running".
  durationMs?: number
  // Whatever the executor returned, kept for the console's per-step detail view.
  output?: unknown
  // The thrown error's message, set only when status is "failed".
  error?: string
}

export interface LoopFrame {
  nodeId: string
  items: unknown[]
  currentIndex: number // 1-based (1, 2, ..., total)
  total: number
  bodyStartNodeIds: string[]
  bodyNodeIds: Set<string>
  doneTargetNodeIds: string[]
}

// Execution Context holding state, outputs, loopStack, and safeguards.
export interface ExecutionContext {
  workflowId: string
  orgId: string
  outputs: NodeOutputs
  visitCounts: Map<string, number>
  loopStack: LoopFrame[]
}

// Recursively discovers all nodes that belong to a loop body sub-graph
function findBodyReachableNodes(
  startNodeIds: string[],
  edges: Edge[],
  doneTargetNodeIds: Set<string>
): Set<string> {
  const result = new Set<string>()
  const queue = [...startNodeIds]
  while (queue.length > 0) {
    const id = queue.shift()!
    if (result.has(id) || doneTargetNodeIds.has(id)) continue
    result.add(id)
    const outgoing = edges.filter((e) => e.source === id)
    for (const e of outgoing) {
      if (!doneTargetNodeIds.has(e.target)) {
        queue.push(e.target)
      }
    }
  }
  return result
}

// Recursively walks down an unchosen branch to mark downstream nodes as "skipped"
function markBranchAsSkipped(
  startNodeId: string,
  edges: Edge[],
  stepsMap: Map<string, RunStep>,
  executedOrQueued: Set<string>
) {
  const stack = [startNodeId]
  const visited = new Set<string>()

  while (stack.length > 0) {
    const currentId = stack.pop()!
    if (visited.has(currentId) || executedOrQueued.has(currentId)) continue
    visited.add(currentId)

    const step = stepsMap.get(currentId)
    if (step && step.status !== "done" && step.status !== "running") {
      step.status = "skipped"
    }

    const outgoing = edges.filter((e) => e.source === currentId)
    for (const edge of outgoing) {
      if (!executedOrQueued.has(edge.target)) {
        stack.push(edge.target)
      }
    }
  }
}

export const runWorkflowTask = task({
  id: "run-workflow",
  run: async ({ workflowId, orgId }: { workflowId: string; orgId: string }, { ctx, signal }) => {
    const workflow = await getWorkflow(orgId, workflowId)
    if (!workflow?.graph) throw new Error(`Workflow ${workflowId} has no graph`)

    const { nodes, edges } = workflow.graph
    const byId = new Map(nodes.map((n) => [n.id, n]))

    // Find trigger node or initial root nodes
    const triggerNode = nodes.find((n) => n.data.kind === "trigger") || nodes[0]
    if (!triggerNode) return { steps: [], browserbaseSessionId: undefined }

    logger.log(`Running workflow ${workflow.name} with dynamic graph walker`, { nodeCount: nodes.length })

    // Initialize steps map
    const stepsMap = new Map<string, RunStep>()
    const steps: RunStep[] = nodes.map((node) => {
      const step: RunStep = {
        nodeId: node.id,
        type: node.data.type,
        title: node.data.title,
        status: "pending",
      }
      stepsMap.set(node.id, step)
      return step
    })

    const publishSteps = () =>
      metadata.set("steps", steps as unknown as DeserializedJson[])

    publishSteps()

    let stagehand: Stagehand | undefined
    let browserbaseSessionId: string | undefined
    const getStagehand = async () => {
      if (stagehand) return stagehand
      stagehand = new Stagehand({
        env: "BROWSERBASE",
        apiKey: process.env.BROWSERBASE_API_KEY!,
        model: "google/gemini-2.5-flash",
        disablePino: true,
      })
      await stagehand.init()
      browserbaseSessionId = stagehand.browserbaseSessionID
      return stagehand
    }

    // Execution Context
    const execCtx: ExecutionContext = {
      workflowId,
      orgId,
      outputs: {},
      visitCounts: new Map(),
      loopStack: [],
    }

    // Queue for dynamic graph walker
    const queue: string[] = [triggerNode.id]
    const executedOrQueued = new Set<string>([triggerNode.id])
    let totalStepExecutions = 0

    try {
      while (queue.length > 0 || execCtx.loopStack.length > 0) {
        signal.throwIfAborted()

        // Check if current queue is empty but an active loop iteration just completed
        if (queue.length === 0 && execCtx.loopStack.length > 0) {
          const activeLoop = execCtx.loopStack[execCtx.loopStack.length - 1]
          logger.log(`[Loop] Iteration ${activeLoop.currentIndex}/${activeLoop.total} completed.`)

          if (activeLoop.currentIndex < activeLoop.total) {
            activeLoop.currentIndex += 1
            logger.log(`[Loop] Starting iteration ${activeLoop.currentIndex}/${activeLoop.total}...`)

            // Reset status of body nodes to pending for the next iteration
            for (const bodyId of activeLoop.bodyNodeIds) {
              const step = stepsMap.get(bodyId)
              if (step) step.status = "pending"
            }
            publishSteps()

            // Re-enqueue body start nodes
            for (const bodyStartId of activeLoop.bodyStartNodeIds) {
              queue.push(bodyStartId)
            }
            continue
          } else {
            // Loop finished all iterations
            execCtx.loopStack.pop()
            logger.log(`[Loop] All ${activeLoop.total} iteration(s) finished. Transitioning to ON COMPLETE.`)

            for (const doneId of activeLoop.doneTargetNodeIds) {
              executedOrQueued.add(doneId)
              queue.push(doneId)
            }
            continue
          }
        }

        const nodeId = queue.shift()!
        const step = stepsMap.get(nodeId)!
        const node = byId.get(nodeId)!

        // Global Execution Cap Safeguard
        totalStepExecutions += 1
        if (totalStepExecutions > MAX_TOTAL_STEP_EXECUTIONS) {
          throw new Error(
            `Workflow execution stopped: exceeded maximum step executions limit (${MAX_TOTAL_STEP_EXECUTIONS}).`
          )
        }

        // Cycle Safeguard per single node
        const visitCount = (execCtx.visitCounts.get(nodeId) || 0) + 1
        execCtx.visitCounts.set(nodeId, visitCount)
        if (visitCount > 100) {
          throw new Error(
            `Workflow execution stopped: possible infinite loop detected on node "${node.data.title}".`
          )
        }

        // Resolve active loop frame for interpolation
        const currentLoopFrame =
          execCtx.loopStack.length > 0
            ? execCtx.loopStack[execCtx.loopStack.length - 1]
            : undefined

        const activeLoopState: LoopState | undefined = currentLoopFrame
          ? {
              item: currentLoopFrame.items[currentLoopFrame.currentIndex - 1],
              index: currentLoopFrame.currentIndex,
              total: currentLoopFrame.total,
            }
          : undefined

        logger.log(
          `Executing step: ${node.data.title}${
            activeLoopState ? ` (Loop item ${activeLoopState.index}/${activeLoopState.total})` : ""
          }`
        )

        const executor = nodeExecutors[node.data.type]
        if (!executor) {
          step.status = "done"
          publishSteps()
        } else {
          step.status = "running"
          publishSteps()
          await metadata.flush()

          // Interpolate values using outputs, system tokens, and loopState
          const values = Object.fromEntries(
            Object.entries(node.data.values).map(([key, text]) => [
              key,
              interpolate({ text, outputs: execCtx.outputs, loopState: activeLoopState }),
            ])
          )

          const startedAt = Date.now()
          try {
            const output = (await executor({ orgId, values, getStagehand })) as any
            execCtx.outputs[nodeId] = output
            step.output = output
            step.status = "done"
            step.durationMs = Date.now() - startedAt

            if (output?.details) {
              logger.log(output.details)
            }
          } catch (error) {
            step.status = "failed"
            step.durationMs = Date.now() - startedAt
            const errMsg = error instanceof Error ? error.message : String(error)
            step.error = activeLoopState
              ? `Loop failed at iteration ${activeLoopState.index}/${activeLoopState.total}: ${errMsg}`
              : errMsg
            publishSteps()
            await metadata.flush()
            throw error
          }
        }

        // Determine downstream edges
        const outgoing = edges.filter((e) => e.source === nodeId)

        if (node.data.type === "if-else") {
          const chosenBranch = (step.output as any)?.branch || "false"
          const activeEdges = outgoing.filter(
            (e) => e.sourceHandle === chosenBranch || !e.sourceHandle
          )
          const inactiveEdges = outgoing.filter(
            (e) => e.sourceHandle && e.sourceHandle !== chosenBranch
          )

          // Queue active branch targets
          for (const edge of activeEdges) {
            executedOrQueued.add(edge.target)
            queue.push(edge.target)
          }

          // Recursively mark unchosen branch nodes as skipped
          for (const edge of inactiveEdges) {
            markBranchAsSkipped(edge.target, edges, stepsMap, executedOrQueued)
          }
        } else if (node.data.type === "loop") {
          const items = (step.output as any)?.items || []
          const bodyEdges = outgoing.filter((e) => e.sourceHandle === "body")
          const doneEdges = outgoing.filter((e) => e.sourceHandle === "done")
          const doneTargets = new Set(doneEdges.map((e) => e.target))
          const bodyStartTargets = bodyEdges.map((e) => e.target)
          const bodyNodeIds = findBodyReachableNodes(bodyStartTargets, edges, doneTargets)

          if (items.length === 0) {
            logger.log(`[Loop] Input array is empty. Transitioning directly to ON COMPLETE.`)
            for (const doneId of doneTargets) {
              executedOrQueued.add(doneId)
              queue.push(doneId)
            }
          } else {
            const frame: LoopFrame = {
              nodeId,
              items,
              currentIndex: 1,
              total: items.length,
              bodyStartNodeIds: bodyStartTargets,
              bodyNodeIds,
              doneTargetNodeIds: Array.from(doneTargets),
            }
            execCtx.loopStack.push(frame)
            logger.log(`[Loop] Starting iteration 1/${frame.total}...`)

            for (const bodyStartId of bodyStartTargets) {
              executedOrQueued.add(bodyStartId)
              queue.push(bodyStartId)
            }
          }
        } else {
          // Standard node: queue all outgoing edges
          for (const edge of outgoing) {
            if (!executedOrQueued.has(edge.target)) {
              executedOrQueued.add(edge.target)
              queue.push(edge.target)
            }
          }
        }

        publishSteps()
      }

      return { steps, browserbaseSessionId }
    } finally {
      await stagehand?.close()
    }
  },
})

export const scheduledWorkflowTask = schedules.task({
  id: "scheduled-workflow",
  run: async (payload) => {
    if (!payload.externalId) {
      throw new Error("Missing externalId in schedule payload")
    }

    const [orgId, workflowId] = payload.externalId.split("|")
    if (!orgId || !workflowId) {
      throw new Error(`Invalid externalId format: ${payload.externalId}`)
    }

    logger.log("Triggering scheduled workflow", { orgId, workflowId })

    await tasks.trigger<typeof runWorkflowTask>(
      "run-workflow",
      { workflowId, orgId },
      { tags: [`workflow:${workflowId}`, "scheduled"] }
    )
  },
})
