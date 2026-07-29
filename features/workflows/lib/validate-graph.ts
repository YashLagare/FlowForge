import toposort from "toposort"

import type { WorkflowGraph } from "@/lib/db/schema"

// Structural problems knowable before a run — empty array means runnable. Pure
// (no db import) so the client can pre-flight the in-hand graph and toast,
// while the server reuses it as the save-time backstop.
export function validateGraph({ nodes, edges }: WorkflowGraph): string[] {
  const problems: string[] = []

  const triggers = nodes.filter((n) => n.data.kind === "trigger").length
  if (triggers !== 1) {
    problems.push(`A workflow needs exactly one trigger (Start or Schedule). Found ${triggers}.`)
  }

  // The runner only executes nodes touching an edge, so with none Run is a no-op.
  if (edges.length === 0) {
    problems.push("Connect your nodes before running.")
  } else {
    try {
      // toposort throws on a cycle — the run would otherwise fail mid-sort.
      toposort(edges.map((e) => [e.source, e.target]))
    } catch {
      problems.push("Workflow has a cycle — remove the loop before running.")
    }
  }

  // Node-specific validation
  for (const node of nodes) {
    if (node.data.type === "google-sheets") {
      const vals = node.data.values
      if (!vals.connectionId) problems.push(`${node.data.title}: Please select a connection.`)
      if (!vals.spreadsheetId) problems.push(`${node.data.title}: Spreadsheet ID is required.`)
      if (!vals.sheetName) problems.push(`${node.data.title}: Sheet Name is required.`)
      
      try {
        const pairs = vals.values ? JSON.parse(vals.values) : []
        if (!Array.isArray(pairs) || pairs.length === 0) {
          problems.push(`${node.data.title}: Please map at least one column.`)
        } else {
          const keys = new Set()
          for (const p of pairs) {
            if (!p.key) problems.push(`${node.data.title}: Column name cannot be empty.`)
            if (keys.has(p.key)) problems.push(`${node.data.title}: Duplicate column mapping found for '${p.key}'.`)
            keys.add(p.key)
          }
        }
      } catch (e) {
        problems.push(`${node.data.title}: Invalid mapped values format.`)
      }
    }
  }

  return problems
}
