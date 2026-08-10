// Swaps `{{ nodeId.path }}` placeholders in a field for values pulled from
// this run's node outputs (keyed by node id). Pure — the caller supplies the
// outputs map. A placeholder that points at nothing becomes "", and one that
// lands on an object/array drops in its JSON so it survives inside text.
export type NodeOutputs = Record<string, unknown>

const PLACEHOLDER = /\{\{\s*([^}]+?)\s*\}\}/g

// Walks a dotted/bracketed path (e.g. `items[0].name`) off the outputs map,
// treating the first segment as the node id. Returns undefined the moment the
// path leaves an object rather than throwing.
function getByPath(root: NodeOutputs, path: string): unknown {
  const keys = path
    .replace(/\[(\w+)\]/g, ".$1") // items[0] -> items.0
    .split(".")
    .filter(Boolean)

  return keys.reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[key]
  }, root)
}

export type LoopState = {
  item: unknown
  index: number
  total: number
}

export function interpolate({
  text,
  outputs,
  loopState,
}: {
  text: string
  outputs: NodeOutputs
  loopState?: LoopState
}): string {
  return text.replace(PLACEHOLDER, (_match, rawExpr: string) => {
    const expr = rawExpr.trim()
    if (expr === "workflow.timestamp" || expr === "trigger.timestamp") {
      return new Date().toISOString()
    }
    if (loopState) {
      if (expr === "loop.item") {
        const val = loopState.item
        if (typeof val === "object") return JSON.stringify(val)
        return String(val ?? "")
      }
      if (expr === "loop.index") return String(loopState.index)
      if (expr === "loop.total") return String(loopState.total)
      if (expr.startsWith("loop.item.")) {
        const subPath = expr.replace(/^loop\.item\./, "")
        const val = getByPath(
          typeof loopState.item === "object" && loopState.item !== null
            ? (loopState.item as Record<string, unknown>)
            : {},
          subPath
        )
        if (val == null) return ""
        if (typeof val === "object") return JSON.stringify(val)
        return String(val)
      }
    }
    const value = getByPath(outputs, expr)
    if (value == null) return ""
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  })
}
