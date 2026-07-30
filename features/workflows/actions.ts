"use server"

import { auth } from "@clerk/nextjs/server"
import * as Sentry from "@sentry/nextjs"
import { runs, tasks, schedules } from "@trigger.dev/sdk"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import type { runWorkflowTask } from "@/features/workflows/tasks/run-workflow"

import { createWorkflow, deleteWorkflow, saveWorkflowGraph } from "@/features/workflows/data"
import { WorkflowGraph } from "@/lib/db/schema"
import { liveblocks } from "@/lib/liveblocks"

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  Sentry.getIsolationScope().setAttributes({ action: "createWorkflowAction", orgId })

  const workflow = await createWorkflow(orgId, name)

  Sentry.logger.info("Workflow created", { workflowId: workflow.id, orgId })

  revalidatePath("/workflows", "layout")
  redirect(`/workflows/${workflow.id}`)
}

export async function deleteWorkflowAction(id: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  Sentry.getIsolationScope().setAttributes({
    action: "deleteWorkflowAction",
    orgId,
    workflowId: id,
  })

  const workflow = await deleteWorkflow(orgId, id)

  if (!workflow) {
    Sentry.logger.warn("Workflow delete skipped — not found", { workflowId: id, orgId })
    throw new Error("Workflow not found")
  }

  // The workflow id doubles as its Liveblocks room id — clean it up too.
  await liveblocks.deleteRoom(id)

  Sentry.logger.info("Workflow deleted", { workflowId: id, orgId })

  revalidatePath("/workflows", "layout")
  redirect("/dashboard")
}

export async function runWorkflowAction({
  id,
  graph,
}: {
  id: string
  graph: WorkflowGraph
}) {
  const { orgId, has } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  // Premium nodes are Pro-only. Enforce it here rather than in the run task: the
  // action holds the Clerk session (and has()), while the Trigger.dev task runs
  // with no auth context. has() evaluates the active org, confirmed above.
  Sentry.getIsolationScope().setAttributes({
    action: "runWorkflowAction",
    orgId,
    workflowId: id,
  })

  const hasPremiumNode = graph.nodes.some(
    (node) =>
      node.data.type === "agent" ||
      node.data.type === "send-email" ||
      node.data.type === "schedule" ||
      node.data.type === "google-sheets" ||
      node.data.type === "wait"
  )
  if (hasPremiumNode && !has({ plan: "pro" })) {
    Sentry.logger.warn("Workflow run denied — Premium nodes require Pro plan", {
      workflowId: id,
      orgId,
    })
    return { error: "This workflow uses premium nodes that require the Pro plan." }
  }

  try {
    await saveWorkflowGraph({ orgId, id, graph })
  } catch (error) {
    Sentry.logger.warn("Workflow run blocked — graph validation failed", {
      workflowId: id,
      orgId,
    })
    return { error: error instanceof Error ? error.message : "Graph validation failed." }
  }

  const triggerNode = graph.nodes.find((n) => n.data.kind === "trigger")

  if (triggerNode?.data.type === "schedule") {
    const cron = triggerNode.data.values.cron
    if (!cron) {
      return { error: "Schedule node requires a cron expression." }
    }

    try {
      const createdSchedule = await schedules.create({
        task: "scheduled-workflow",
        cron,
        externalId: `${orgId}|${id}`,
        deduplicationKey: id,
      })

      Sentry.logger.info("Workflow schedule registered", {
        workflowId: id,
        orgId,
        scheduleId: createdSchedule.id,
        cron,
      })

      return { type: "scheduled" }
    } catch (error) {
      Sentry.logger.error("Failed to create schedule", { error })
      return { error: error instanceof Error ? error.message : "Failed to register schedule with Trigger.dev." }
    }
  }

  try {
    const handle = await tasks.trigger<typeof runWorkflowTask>(
      "run-workflow",
      { workflowId: id, orgId },
      { tags: [`workflow:${id}`] }
    )

    Sentry.logger.info("Workflow run triggered", {
      workflowId: id,
      orgId,
      runId: handle.id,
      nodeCount: graph.nodes.length,
      hasPremiumNode,
    })

    return { type: "run" }
  } catch (error) {
    Sentry.logger.error("Failed to trigger run", { error })
    return { error: error instanceof Error ? error.message : "Failed to start workflow run." }
  }
}

export async function cancelWorkflowRunAction(runId: string) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("No active organization")

  Sentry.getIsolationScope().setAttributes({
    action: "cancelWorkflowRunAction",
    orgId,
    runId,
  })

  await runs.cancel(runId)

  Sentry.logger.info("Workflow run cancelled", { runId, orgId })
}

export async function deleteScheduleAction(workflowId: string) {
  const { orgId } = await auth()
  if (!orgId) throw new Error("No active organization")

  try {
    const list = await schedules.list()
    const schedule = list.data.find((s) => s.externalId === `${orgId}|${workflowId}`)
    
    if (schedule) {
      await schedules.del(schedule.id)
      Sentry.logger.info("Schedule deleted", { workflowId, orgId, scheduleId: schedule.id })
      return { success: true }
    } else {
      return { error: "No active schedule found for this workflow." }
    }
  } catch (error) {
    Sentry.logger.error("Failed to delete schedule", { error })
    return { error: error instanceof Error ? error.message : "Failed to delete schedule." }
  }
}