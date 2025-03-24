import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { generateApiKey, listApiKeys } from "@/lib/services/api-keys"
import { z } from "zod"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"
import { validateBody } from "@/lib/utils/validation"

// Schema for API key creation
const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  scopes: z.array(z.string()).default([]),
})

// Get all API keys for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all API keys for the user
    const keys = await listApiKeys(userId)

    // Remove the hashed key from the response
    const safeKeys = keys.map(({ key, ...rest }) => ({
      ...rest,
      keyPrefix: key.substring(0, 8) + "...",
    }))

    return NextResponse.json(safeKeys)
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/api-keys" })
  }
}

// Create a new API key
export async function POST(request: Request) {
  try {
    // Check Content-Type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new AppError("Content-Type must be application/json", 415, "INVALID_CONTENT_TYPE")
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Validate request body
    const validatedData = await validateBody(request, apiKeySchema)

    // Generate a new API key
    const apiKey = await generateApiKey(userId, validatedData.name, validatedData.scopes)

    return NextResponse.json(
      {
        message: "API key created successfully",
        apiKey, // This is the only time the API key will be shown
      },
      { status: 201 },
    )
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/api-keys" })
  }
}

