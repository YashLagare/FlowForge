import * as Sentry from "@sentry/node";
import { tasks } from "@trigger.dev/sdk";

// Initialize Sentry for the Trigger.dev runtime
Sentry.init({
  defaultIntegrations: false,
  // The Data Source Name (DSN) is a unique identifier for your Sentry project.
  dsn:
    process.env.SENTRY_DSN ??
    "https://edba579c312280b11a2432652125905a@o4510505987145728.ingest.us.sentry.io/4511745588264960",
  environment:
    process.env.NODE_ENV === "production" ? "production" : "development",
});

// Register a global onFailure hook to capture task errors
tasks.onFailure(({ payload, error, ctx }) => {
  Sentry.captureException(error, {
    extra: {
      payload,
      ctx,
    },
  });
});
