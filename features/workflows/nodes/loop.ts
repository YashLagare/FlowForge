const SYSTEM_MAX_ITEMS = 50

export function loop({
  inputArray = "",
  maxItems = "50",
}: {
  inputArray?: string
  maxItems?: string
}) {
  let items: unknown[] = []
  const raw = inputArray.trim()

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        items = parsed
      } else if (typeof parsed === "object" && parsed !== null) {
        // If an object with an array was passed (e.g. { links: [...] }), find the first array
        const firstArrayKey = Object.keys(parsed).find((k) =>
          Array.isArray((parsed as Record<string, unknown>)[k])
        )
        if (firstArrayKey) {
          items = (parsed as Record<string, unknown>)[firstArrayKey] as unknown[]
        } else {
          items = [parsed]
        }
      } else {
        items = [parsed]
      }
    } catch {
      // If not JSON, treat as comma-separated or newline-separated values
      if (raw.includes("\n")) {
        items = raw.split("\n").map((s) => s.trim()).filter(Boolean)
      } else if (raw.includes(",")) {
        items = raw.split(",").map((s) => s.trim()).filter(Boolean)
      } else {
        items = [raw]
      }
    }
  }

  // Enforce server-side hard maximum
  const userLimit = parseInt(maxItems, 10)
  const effectiveLimit = Math.min(
    !isNaN(userLimit) && userLimit > 0 ? userLimit : SYSTEM_MAX_ITEMS,
    SYSTEM_MAX_ITEMS
  )

  const finalItems = items.slice(0, effectiveLimit)

  return {
    items: finalItems,
    total: finalItems.length,
    message: `Initialized loop with ${finalItems.length} item(s) (Server cap: ${effectiveLimit})`,
  }
}
