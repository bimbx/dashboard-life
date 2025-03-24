import { logError } from "../services/logging"

// Set up global error handlers
export function setupGlobalErrorHandlers() {
  if (typeof window !== "undefined") {
    // Browser environment
    window.addEventListener("unhandledrejection", async (event) => {
      console.error("Unhandled promise rejection:", event.reason)

      // Log to error tracking service
      try {
        await logError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
          source: "unhandledrejection",
          context: "browser",
        })
      } catch (loggingError) {
        console.error("Failed to log unhandled rejection:", loggingError)
      }
    })

    window.addEventListener("error", async (event) => {
      console.error("Unhandled error:", event.error)

      // Log to error tracking service
      try {
        await logError(event.error instanceof Error ? event.error : new Error(String(event.error)), {
          source: "error",
          context: "browser",
          url: event.filename,
          line: event.lineno,
          column: event.colno,
        })
      } catch (loggingError) {
        console.error("Failed to log unhandled error:", loggingError)
      }
    })
  } else {
    // Node.js environment
    process.on("unhandledRejection", async (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason)

      // Log to error tracking service
      try {
        await logError(reason instanceof Error ? reason : new Error(String(reason)), {
          source: "unhandledrejection",
          context: "server",
        })
      } catch (loggingError) {
        console.error("Failed to log unhandled rejection:", loggingError)
      }
    })

    process.on("uncaughtException", async (error) => {
      console.error("Uncaught Exception:", error)

      // Log to error tracking service
      try {
        await logError(error, { source: "uncaughtexception", context: "server" })
      } catch (loggingError) {
        console.error("Failed to log uncaught exception:", loggingError)
      }

      // For uncaught exceptions, it's best to exit the process after logging
      // as the process might be in an inconsistent state
      process.exit(1)
    })
  }
}

