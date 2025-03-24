import { randomBytes } from "crypto"
import type { NextRequest } from "next/server"
import { AppError } from "./utils/error-handler"

// CSRF token generation and verification
export const csrf = {
  // Generate a CSRF token
  generateToken: (): string => {
    return randomBytes(32).toString("hex")
  },

  // Verify a CSRF token
  verify: async (req: NextRequest): Promise<AppError | null> => {
    // Skip for GET requests
    if (req.method === "GET") {
      return null
    }

    // Get the CSRF token from the request
    const csrfToken = req.headers.get("x-csrf-token")

    // Get the session token
    const sessionToken = req.cookies.get("next-auth.session-token")?.value

    // If no session token, skip CSRF check (user is not authenticated)
    if (!sessionToken) {
      return null
    }

    // If no CSRF token, return error
    if (!csrfToken) {
      return new AppError("CSRF token missing", 403, "CSRF_TOKEN_MISSING")
    }

    // In a real implementation, we would validate the token against a stored value
    // For now, we'll just check that it exists and has the right format
    if (!/^[a-f0-9]{64}$/.test(csrfToken)) {
      return new AppError("Invalid CSRF token", 403, "INVALID_CSRF_TOKEN")
    }

    return null
  },
}

