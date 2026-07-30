import type { Node } from "@xyflow/react"
import {
  Bot,
  Eye,
  Globe,
  Hourglass,
  Mail,
  MousePointerClick,
  Pointer,
  ScanText,
  Timer,
  Table,
  type LucideIcon,
} from "lucide-react"

export type StepNodeKind = "trigger" | "action"

// One editable field on a node, rendered as an input in the inspector later.
export type NodeField = {
  key: string
  label: string
  type?: "text" | "select" | "key-value"
  options?: { label: string; value: string }[] // For static selects
  provider?: string // To fetch dynamic connections for this provider
  placeholder?: string
  // Render as a multi-line textarea instead of a single-line input.
  multiline?: boolean
  required?: boolean
}

export type NodeOutput = {
  path: string
  label: string
}

// A node type's manifest entry. Add a node by adding an entry to nodeRegistry.
export type NodeDefinition = {
  type: string
  kind: StepNodeKind
  label: string
  icon: LucideIcon
  accent: string // Tailwind classes for the icon chip color
  fields: NodeField[]
  outputs: NodeOutput[]
}

export const nodeRegistry = {
  start: {
    type: "start",
    kind: "trigger",
    label: "Start",
    icon: MousePointerClick,
    accent: "bg-blue-500 text-white",
    fields: [],
    outputs: [],
  },
  schedule: {
    type: "schedule",
    kind: "trigger",
    label: "Schedule",
    icon: Timer,
    accent: "bg-pink-500 text-white",
    fields: [
      {
        key: "cron",
        label: "Cron Expression",
        placeholder: "0 9 * * *",
        required: true,
      },
    ],
    outputs: [{ path: "timestamp", label: "Scheduled Time" }],
  },
  "open-url": {
    type: "open-url",
    kind: "action",
    label: "Open URL",
    icon: Globe,
    accent: "bg-emerald-500 text-white",
    fields: [
      { key: "url", label: "URL", placeholder: "https://youtube.com", required: true },
    ],
    outputs: [
      { path: "url", label: "URL" },
      { path: "title", label: "Title" },
    ],
  },
  act: {
    type: "act",
    kind: "action",
    label: "Act",
    icon: Pointer,
    accent: "bg-violet-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Click the sign in button",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "success", label: "Success" },
      { path: "message", label: "Message" },
      { path: "url", label: "URL" },
    ],
  },
  extract: {
    type: "extract",
    kind: "action",
    label: "Extract",
    icon: ScanText,
    accent: "bg-amber-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Extract the product price",
        multiline: true,
        required: true,
      },
    ],
    outputs: [{ path: "extraction", label: "Extraction" }],
  },
  observe: {
    type: "observe",
    kind: "action",
    label: "Observe",
    icon: Eye,
    accent: "bg-sky-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Find the sign in button",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "matches", label: "Matches" },
      { path: "matches[0].selector", label: "Selector" },
      { path: "matches[0].description", label: "Description" },
    ],
  },
  agent: {
    type: "agent",
    kind: "action",
    label: "Agent",
    icon: Bot,
    accent: "bg-rose-500 text-white",
    fields: [
      {
        key: "instruction",
        label: "Instruction",
        placeholder: "Search for the stock price of NVDA",
        multiline: true,
        required: true,
      },
    ],
    outputs: [
      { path: "success", label: "Success" },
      { path: "message", label: "Message" },
      { path: "completed", label: "Completed" },
    ],
  },
  "send-email": {
    type: "send-email",
    kind: "action",
    label: "Send Email",
    icon: Mail,
    accent: "bg-teal-500 text-white",
    fields: [
      { key: "to", label: "To", placeholder: "person@example.com", required: true },
      { key: "subject", label: "Subject", placeholder: "Hello", required: true },
      {
        key: "body",
        label: "Body",
        placeholder: "Write your message…",
        multiline: true,
        required: true,
      },
    ],
    outputs: [{ path: "id", label: "Email ID" }],
  },
  "google-sheets": {
    type: "google-sheets",
    kind: "action",
    label: "Google Sheets",
    icon: Table,
    accent: "bg-green-600 text-white",
    fields: [
      {
        key: "connectionId",
        label: "Connection",
        type: "select",
        provider: "google-sheets",
        required: true,
      },
      {
        key: "operation",
        label: "Operation",
        type: "select",
        options: [{ label: "Append Row", value: "append-row" }],
        required: true,
      },
      { key: "spreadsheetId", label: "Spreadsheet ID", placeholder: "1BxiMVs0XRA5nFMdKv...", required: true },
      { key: "sheetName", label: "Sheet Name", placeholder: "Sheet1", required: true },
      { key: "values", label: "Values", type: "key-value", required: true },
    ],
    outputs: [{ path: "success", label: "Success" }],
  },
  wait: {
    type: "wait",
    kind: "action",
    label: "Wait",
    icon: Hourglass,
    accent: "bg-amber-500 text-white",
    fields: [
      {
        key: "duration",
        label: "Wait Duration (seconds)",
        placeholder: "5",
        required: true,
      },
    ],
    outputs: [{ path: "waitedSeconds", label: "Waited Seconds" }],
  },
} satisfies Record<string, NodeDefinition>

export type NodeType = keyof typeof nodeRegistry

// Plain JSON only (synced through Liveblocks later). type keys into the registry;
// kind and title are denormalized so the server can read them without the registry.
export type StepNodeData = {
  type: NodeType
  kind: StepNodeKind
  title: string
  values: Record<string, string>
}

export type StepNodeType = Node<StepNodeData, "step">

export type ActionNodeType = {
  [K in NodeType]: (typeof nodeRegistry)[K]["kind"] extends "action" ? K : never
}[NodeType]