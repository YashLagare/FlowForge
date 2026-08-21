import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ??
    "https://edba579c312280b11a2432652125905a@o4510505987145728.ingest.us.sentry.io/4511745588264960",

  // 100% in dev, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay: 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,

  ignoreErrors: [
    // Network / CDN chunk loading failures
    "ChunkLoadError",
    "Loading chunk",
    "Failed to fetch dynamically imported module",
    // Extension & third-party script rejections
    "Object Not Found Matching Id",
    "antifingerprint",
    "Non-Error promise rejection",
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.toDataURL",
  ],

  beforeSend(event, hint) {
    const error = hint?.originalException
    const errorMessage = typeof error === "string" ? error : error instanceof Error ? error.message : ""

    if (errorMessage.includes("Object Not Found Matching Id") || errorMessage.includes("antifingerprint")) {
      return null
    }

    if (
      event.exception?.values?.some((val) =>
        val.stacktrace?.frames?.some(
          (f) =>
            f.filename?.includes("extension") ||
            f.filename?.includes("chrome-extension") ||
            f.filename?.includes("moz-extension")
        )
      )
    ) {
      return null
    }

    return event
  },

  integrations: [Sentry.replayIntegration()],
})

// Hook into App Router navigation transitions (App Router only)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
