import { setupGlobalErrorHandlers } from "./utils/global-error-handlers"

/**
 * Initialize the application
 * This function should be called at startup
 */
export async function initializeApp() {
  console.log("Initializing application...")

  // Set up global error handlers
  setupGlobalErrorHandlers()

  // Validate environment variables
  validateEnvironmentVariables()

  console.log("Application initialized successfully")
}

/**
 * Validate required environment variables
 * Throws an error if any required variables are missing
 */
function validateEnvironmentVariables() {
  const requiredVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ]

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Required environment variable ${varName} is missing`)
    }
  }

  // Validate NEXTAUTH_SECRET strength in production
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32)
  ) {
    throw new Error("NEXTAUTH_SECRET must be at least 32 characters in production")
  }
}

