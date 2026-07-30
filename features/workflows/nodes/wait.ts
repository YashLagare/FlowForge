export async function wait({ duration }: { duration?: string }) {
  const rawValue = duration?.trim() ?? "1"
  const seconds = parseFloat(rawValue)

  if (isNaN(seconds) || seconds < 0 || seconds > 3600) {
    throw new Error(
      `Invalid wait duration: "${rawValue}". Expected a number between 0 and 3600 seconds.`
    )
  }

  const durationMs = Math.round(seconds * 1000)
  await new Promise((resolve) => setTimeout(resolve, durationMs))

  return {
    waitedSeconds: seconds,
  }
}
