import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/services/api-keys"
import { getUserDb } from "@/lib/db"

/**
 * Middleware to authenticate API requests using API keys
 */
export async function authenticateApiRequest(req: NextRequest): Promise<{
  authenticated: boolean
  userId?: string
  db?: any
  error?: string
}> {
  // Get API key from header
  const apiKey = req.headers.get("x-api-key")

  if (!apiKey) {
    return {
      authenticated: false,
      error: "API key is required",
    }
  }

  // Validate API key
  const { valid, userId, scopes } = await validateApiKey(apiKey)

  if (!valid || !userId) {
    return {
      authenticated: false,
      error: "Invalid API key",
    }
  }

  // Check if the API key has the required scopes
  // This is a placeholder for future scope-based authorization

  // Get a database connection with RLS for the user
  const db = await getUserDb(userId)

  return {
    authenticated: true,
    userId,
    db,
  }
}

/**
 * Create an API response for authentication errors
 */
export function createApiAuthErrorResponse(error: string): NextResponse {
  return NextResponse.json({ error }, { status: 401, headers: { "WWW-Authenticate": "ApiKey" } })
}

