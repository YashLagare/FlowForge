"use client"

import { useReactFlow, useStore } from "@xyflow/react"
import { Lock, MoreHorizontal, Play, Square, Trash2, Timer } from "lucide-react"
import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { getConnectionsByProviderAction } from "@/features/connections/actions"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResizablePanel } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  cancelWorkflowRunAction,
  deleteWorkflowAction,
  runWorkflowAction,
  deleteScheduleAction,
} from "@/features/workflows/actions"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import { useLiveRun } from "@/features/workflows/components/workflow-runs-provider"
import { useProPlan } from "@/features/workflows/hooks/use-pro-plan"
import { useUpstreamConnections } from "@/features/workflows/hooks/use-upstream-connections"
import { validateGraph } from "@/features/workflows/lib/validate-graph"
import {
  nodeRegistry,
  type NodeDefinition,
  type NodeField,
  type NodeType,
  type StepNodeKind,
  type StepNodeType,
} from "@/features/workflows/nodes/node-registry"

// This file builds up to the RightSidebar component exported at the bottom: a
// header with workflow actions (delete, run), then two tabs — a Toolbar for
// adding nodes and an Editor for tweaking the selected node. Each helper below is
// defined just above the block that uses it.

// ---------------------------------------------------------------------------
// Shared pieces — used by both the Toolbar and the Editor.
// ---------------------------------------------------------------------------

// A titled, scrollable panel. Each tab renders its content inside one.
function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-y border-border bg-card px-3 py-1.5 text-sm font-semibold">
        {icon}
        {title}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Editor tab — edits the fields of the selected node.
// ---------------------------------------------------------------------------

// A single editor field for a node property. Renders a multi-line textarea when
// the field opts in via `multiline`, otherwise a single-line input.
function Field({
  field,
  value,
  onChange,
  onFocus,
}: {
  field: NodeField
  value: string
  onChange: (value: string) => void
  // Fires when the field gains focus, so the Connections chips know which
  // field a clicked token should land in.
  onFocus: () => void
}) {
  const [connections, setConnections] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (field.type === "select" && field.provider) {
      getConnectionsByProviderAction(field.provider).then(setConnections)
    }
  }, [field])

  if (field.type === "select") {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger onFocus={onFocus} className="w-full">
          <SelectValue placeholder={field.placeholder ?? "Select an option..."} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
          {field.provider && connections.length === 0 && (
            <SelectItem value="none" disabled>
              No connections found
            </SelectItem>
          )}
          {field.provider &&
            connections.map((conn) => (
              <SelectItem key={conn.id} value={conn.id}>
                {conn.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    )
  }

  if (field.type === "key-value") {
    // Parse value as JSON array of { key, value } pairs for editing.
    // If empty or invalid, fallback to empty array.
    let pairs: { key: string; value: string }[] = []
    try {
      if (value) pairs = JSON.parse(value)
    } catch {
      pairs = []
    }

    const updatePairs = (newPairs: typeof pairs) => {
      onChange(JSON.stringify(newPairs))
    }

    return (
      <div className="flex flex-col gap-2 rounded-md border border-border p-2" onFocus={onFocus}>
        {pairs.map((pair, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder="Column"
              value={pair.key}
              className="h-8 text-xs font-mono"
              onChange={(e) => {
                const newPairs = [...pairs]
                newPairs[i].key = e.target.value
                updatePairs(newPairs)
              }}
            />
            <Input
              placeholder="Value"
              value={pair.value}
              className="h-8 text-xs font-mono"
              onChange={(e) => {
                const newPairs = [...pairs]
                newPairs[i].value = e.target.value
                updatePairs(newPairs)
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
              onClick={() => {
                const newPairs = [...pairs]
                newPairs.splice(i, 1)
                updatePairs(newPairs)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-full text-xs"
          onClick={() => {
            updatePairs([...pairs, { key: "", value: "" }])
          }}
        >
          + Add Column
        </Button>
      </div>
    )
  }

  if (field.multiline) {
    return (
      <Textarea
        id={field.key}
        value={value}
        placeholder={field.placeholder}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  return (
    <Input
      id={field.key}
      value={value}
      placeholder={field.placeholder}
      onFocus={onFocus}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

// The Editor tab: one input per field on the selected node, or an empty state.
function Inspector({ node }: { node: StepNodeType | undefined }) {
  const { updateNodeData, deleteElements } = useReactFlow<StepNodeType>()
  // Outputs of every node upstream of the selected one, as insertable {{ }}
  // tokens. Empty when nothing feeds into this node.
  const connections = useUpstreamConnections()
  const { isPro } = useProPlan()
  // The field a clicked chip inserts into — whichever was focused most recently.
  // Reset per selected node since this component is keyed by node id.
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null)

  if (!node) {
    return (
      <Section title="Editor">
        <p className="p-3 text-sm text-muted-foreground">No node selected</p>
      </Section>
    )
  }

  const { type, title, values } = node.data
  const def: NodeDefinition = nodeRegistry[type]

  // Untouched fields fall back to the first one, so a chip always has a home.
  const targetKey = activeFieldKey ?? def.fields[0]?.key

  const insertToken = (token: string) => {
    if (!targetKey) return
    updateNodeData(node.id, {
      values: { ...values, [targetKey]: (values[targetKey] ?? "") + token },
    })
  }

  return (
    <Section title={title} icon={<NodeIcon type={type} />}>
      <div className="flex flex-col gap-3 p-3">
        {def.fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">No properties</p>
        ) : (
          def.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={field.key} className="text-xs">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              <Field
                field={field}
                value={values[field.key] ?? ""}
                onFocus={() => setActiveFieldKey(field.key)}
                onChange={(value) => {
                  updateNodeData(node.id, {
                    values: { ...values, [field.key]: value },
                  })
                }}
              />
            </div>
          ))
        )}

        {/* Available upstream outputs — click to drop a token into the last
            focused field (or the first field if none has been touched). */}
        {connections.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Connections</Label>
            <div className="flex flex-wrap gap-1.5">
              {connections.map((connection) => (
                <button
                  key={connection.token}
                  type="button"
                  onClick={() => insertToken(connection.token)}
                  className="flex max-w-full items-center gap-1.5 rounded-md border border-border bg-card px-1.5 py-1 text-xs hover:bg-accent"
                >
                  <NodeIcon type={connection.nodeType} className="size-4" />
                  <span className="truncate">{connection.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 border-t border-border pt-4">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => {
              if (node.data.kind === "trigger" && !isPro) {
                toast.error("Free plans only support the Start trigger.")
                return
              }
              deleteElements({ nodes: [{ id: node.id }] })
            }}
          >
            <Trash2 className="mr-2 size-4" />
            Delete Node
          </Button>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Toolbar tab — adds nodes to the canvas, grouped by kind.
// ---------------------------------------------------------------------------

// The Toolbar's groups, one accordion section per node kind.
const sections: { kind: StepNodeKind; label: string }[] = [
  { kind: "trigger", label: "Triggers" },
  { kind: "action", label: "Actions" },
]

// Every node type from the registry, filtered into the groups below.
const definitions = Object.values(nodeRegistry)

// Node types that only orgs on the Pro plan can add. The Agent and Send Email nodes
// are gated as premium; every other node stays free to keep workflow
// building open to everyone.
const premiumNodes = new Set<NodeType>(["agent", "send-email", "schedule", "google-sheets"])

// The Toolbar tab: a button per node type that adds it to the canvas.
function Palette() {
  // The shared React Flow store (lifted to a provider above the canvas and this
  // sidebar) lets us read the current nodes/viewport and add to them from here.
  const { getNodes, getViewport, addNodes } = useReactFlow<StepNodeType>()
  // The pane's measured size, used to find the center of the current view.
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)
  // Whether the active org is on Pro, plus a way to send them to upgrade. Gates
  // the premium nodes below.
  const { isLoaded, isPro, goToUpgrade } = useProPlan()

  // A premium node is locked until the plan check has loaded and confirms Pro.
  // We wait for `isLoaded` so a Pro org never flashes a locked state on mount.
  const isLocked = (type: NodeType) =>
    premiumNodes.has(type) && isLoaded && !isPro

  const add = (type: NodeType) => {
    // Premium nodes route to upgrade instead of being added for non-pro orgs.
    if (isLocked(type)) {
      goToUpgrade()
      return
    }

    const def = nodeRegistry[type]
    const nodes = getNodes()

    // Only one trigger is allowed — a workflow has a single entry point.
    if (def.kind === "trigger" && nodes.some((n) => n.data.kind === "trigger")) {
      toast.error("A workflow can only have one trigger.")
      return
    }

    // Number nodes of the same type (e.g. "Open URL 1", "Open URL 2") so
    // duplicates stay easy to tell apart.
    const count = nodes.filter((n) => n.data.type === type).length
    const title = `${def.label} ${count + 1}`

    // Drop the node in the middle of the current view. The viewport transform
    // maps a flow point p to the screen as p * zoom + {x, y}, so the pane center
    // in flow coordinates is (center - offset) / zoom.
    const { x, y, zoom } = getViewport()
    const position = {
      x: (width / 2 - x) / zoom,
      y: (height / 2 - y) / zoom,
    }

    addNodes({
      id: crypto.randomUUID(),
      type: "step",
      position,
      data: { type, kind: def.kind, title, values: {} },
    })
  }

  return (
    <Section title="Toolbar">
      <Accordion
        type="multiple"
        defaultValue={sections.map((s) => s.kind)}
        className="px-3 py-2"
      >
        {sections.map((section) => (
          <AccordionItem
            key={section.kind}
            value={section.kind}
            className="not-last:border-b-0"
          >
            <AccordionTrigger className="py-2 text-xs font-medium text-muted-foreground hover:no-underline">
              {section.label}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-0.5">
              {definitions
                .filter((def) => def.kind === section.kind)
                .map((def) => {
                  const type = def.type as NodeType
                  const locked = isLocked(type)
                  return (
                    <Button
                      key={def.type}
                      variant="ghost"
                      onClick={() => add(type)}
                      title={locked ? "Upgrade to Pro to add this node" : undefined}
                      className="justify-start gap-2.5 px-1.5 text-xs"
                    >
                      <NodeIcon type={type} />
                      {def.label}
                      {locked && (
                        <Lock className="ml-auto size-3.5 text-muted-foreground" />
                      )}
                    </Button>
                  )
                })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Header — workflow-level actions shown above the tabs.
// ---------------------------------------------------------------------------

// The "..." menu for workflow-level actions.
function ActionsMenu({ workflowId }: { workflowId: string }) {
  const [isPending, startTransition] = useTransition()
  const { getNodes } = useReactFlow<StepNodeType>()
  const isScheduled = getNodes().some((n) => n.data.type === "schedule")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        {isScheduled && (
          <DropdownMenuItem
            className="text-xs text-orange-500 focus:bg-orange-500/10 focus:text-orange-600 [&_svg:not([class*='size-'])]:size-3.5"
            disabled={isPending}
            onSelect={(e) => {
              e.preventDefault()
              startTransition(async () => {
                try {
                  const result = await deleteScheduleAction(workflowId)
                  if (result.error) {
                    toast.error(result.error)
                  } else {
                    toast.success("Schedule deactivated successfully.")
                  }
                } catch {
                  toast.error("Failed to deactivate schedule.")
                }
              })
            }}
          >
            <Square />
            Deactivate schedule
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          className="text-xs [&_svg:not([class*='size-'])]:size-3.5"
          onSelect={(e) => {
            // Keep the menu mounted while the delete runs so the disabled state
            // stays visible. Running inside a transition lets the router handle
            // the action's redirect home on success.
            e.preventDefault()
            startTransition(async () => {
              await deleteWorkflowAction(workflowId)
            })
          }}
        >
          <Trash2 />
          Delete workflow
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Toggles between running the current workflow and stopping the run in flight.
// While a run is live it becomes a Stop button that cancels that run; otherwise
// it validates the graph and kicks off a new run.
function RunButton({ workflowId }: { workflowId: string }) {
  const { getNodes, getEdges } = useReactFlow<StepNodeType>()
  const [isPending, startTransition] = useTransition()
  // The run in flight, if any. At most one is live at a time, so its presence
  // decides which mode the button is in.
  const liveRun = useLiveRun()
  const isScheduled = getNodes().some((n) => n.data.type === "schedule")

  if (isScheduled) {
    return (
      <div className="flex gap-1 items-center">
        {liveRun && (
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            disabled={isPending}
            title="Stop current background run"
            onClick={() => {
              startTransition(async () => {
                try {
                  await cancelWorkflowRunAction(liveRun.id)
                } catch {
                  toast.error("Couldn't stop the run.")
                }
              })
            }}
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => {
            const graph = { nodes: getNodes(), edges: getEdges() }
            const problems = validateGraph(graph)
            if (problems.length > 0) {
              toast.error(problems[0])
              return
            }

            startTransition(async () => {
              try {
                const result = await runWorkflowAction({ id: workflowId, graph })
                if (result.error) {
                  toast.error(result.error)
                  return
                }

                if (result.type === "scheduled") {
                  toast.success(
                    "✅ Schedule registered successfully. The workflow will run automatically according to the configured cron expression.",
                    { duration: 5000 }
                  )
                }
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to run workflow")
              }
            })
          }}
        >
          <Timer className="mr-1 h-4 w-4" />
          Save Schedule
        </Button>
      </div>
    )
  }

  if (liveRun) {
    return (
      <Button
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            try {
              await cancelWorkflowRunAction(liveRun.id)
            } catch {
              toast.error("Couldn't stop the run.")
            }
          })
        }}
      >
        <Square className="mr-1 h-4 w-4 fill-current" />
        Stop
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={isPending}
      onClick={() => {
        const graph = { nodes: getNodes(), edges: getEdges() }
        const problems = validateGraph(graph)
        if (problems.length > 0) {
          toast.error(problems[0])
          return
        }

        startTransition(async () => {
          try {
            const result = await runWorkflowAction({ id: workflowId, graph })
            if (result.error) {
              toast.error(result.error)
              return
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to run workflow")
          }
        })
      }}
    >
      <Play className="mr-1 h-4 w-4 fill-primary" />
      Run
    </Button>
  )
}

// ---------------------------------------------------------------------------
// The sidebar itself — header on top, then the Toolbar / Editor tabs.
// ---------------------------------------------------------------------------

export function RightSidebar({ workflowId }: { workflowId: string }) {
  const [tab, setTab] = useState("toolbar")

  const selected = useStore((s) => s.nodes.find((n) => n.selected)) as StepNodeType | undefined

  const [prevSelectedId, setPrevSelectedId] = useState(selected?.id)
  if (selected && selected.id !== prevSelectedId) {
    setPrevSelectedId(selected.id)
    setTab("editor")
  }

  return (
    <ResizablePanel
      className="bg-background"
      defaultSize="16rem"
      minSize="14rem"
      maxSize="36rem"
      groupResizeBehavior="preserve-pixel-size"
    >
      <Tabs value={tab} onValueChange={setTab} className="size-full gap-0">
        <div className="flex flex-wrap items-center justify-between border-b border-border p-2 gap-2">
          <ActionsMenu workflowId={workflowId} />
          <RunButton workflowId={workflowId} />
        </div>
        <TabsList className="m-2 w-fit bg-background">
          <TabsTrigger
            value="toolbar"
            className="flex-none rounded-sm data-active:bg-accent! data-active:text-accent-foreground! data-active:shadow-none! dark:data-active:border-transparent!"
          >
            Toolbar
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="flex-none rounded-sm data-active:bg-accent! data-active:text-accent-foreground! data-active:shadow-none! dark:data-active:border-transparent!"
          >
            Editor
          </TabsTrigger>
        </TabsList>
        <TabsContent value="toolbar" className="flex min-h-0 flex-col">
          <Palette />
        </TabsContent>
        <TabsContent value="editor" className="flex min-h-0 flex-col">
          <Inspector key={selected?.id} node={selected} />
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  )
}
