"use client"

import { useEffect } from "react"

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const error = "reason" in event ? event.reason : event.error
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : ""

      const isChunkError =
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("Failed to fetch dynamically imported module")

      if (isChunkError) {
        // Prevent infinite reloads by tracking in sessionStorage
        const hasReloaded = sessionStorage.getItem("chunk_reload_attempted")
        if (!hasReloaded) {
          sessionStorage.setItem("chunk_reload_attempted", "true")
          window.location.reload()
        }
      }
    }

    window.addEventListener("error", handleChunkError)
    window.addEventListener("unhandledrejection", handleChunkError)

    return () => {
      window.removeEventListener("error", handleChunkError)
      window.removeEventListener("unhandledrejection", handleChunkError)
    }
  }, [])

  return null
}
