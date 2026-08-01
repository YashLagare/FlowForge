import { logger, metadata, task, schedules, tasks } from "@trigger.dev/sdk"
import type { DeserializedJson } from "@trigger.dev/core"
import { Stagehand } from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executors"
import {
  interpolate,
  type NodeOutputs,
} from "@/features/workflows/lib/interpolate"
import { getWorkflow } from "@/features/workflows/data"
import type { NodeType, StepNodeType } from "@/features/workflows/nodes/node-registry"
import type { Edge } from "@xyflow/react"

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

// Execution Context holding state, outputs, system variables, and loop safeguards.
export interface ExecutionContext {
  workflowId: string
  orgId: string
  outputs: NodeOutputs
  visitCounts: Map<string, number>
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
    }

    // Queue for dynamic BFS/DFS walker
    const queue: string[] = [triggerNode.id]
    const executedOrQueued = new Set<string>([triggerNode.id])

    try {
      while (queue.length > 0) {
        signal.throwIfAborted()

        const nodeId = queue.shift()!
        const step = stepsMap.get(nodeId)!
        const node = byId.get(nodeId)!

        // Cycle Safeguard: Prevent infinite loops
        const visitCount = (execCtx.visitCounts.get(nodeId) || 0) + 1
        execCtx.visitCounts.set(nodeId, visitCount)
        if (visitCount > 100) {
          throw new Error(
            `Workflow execution stopped: possible infinite loop detected on node "${node.data.title}".`
          )
        }

        logger.log(`Executing step: ${node.data.title} (Visit ${visitCount})`)

        const executor = nodeExecutors[node.data.type]
        if (!executor) {
          step.status = "done"
          publishSteps()
        } else {
          step.status = "running"
          publishSteps()
          await metadata.flush()

          // Interpolate values using outputs and system tokens
          const values = Object.fromEntries(
            Object.entries(node.data.values).map(([key, text]) => [
              key,
              interpolate({ text, outputs: execCtx.outputs }),
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
            step.error = error instanceof Error ? error.message : String(error)
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
