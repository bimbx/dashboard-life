import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { linkAuthMethod } from "@/lib/services/user-association"
import { z } from "zod"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"

// Schema for account linking
const linkAccountSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  providerData: z.record(z.any()).optional().default({}),
})

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

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    const validationResult = linkAccountSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { provider, providerAccountId, providerData } = validationResult.data

    // Link the account
    const success = await linkAuthMethod(userId, provider, providerAccountId, providerData)

    if (!success) {
      return NextResponse.json({ message: "Failed to link account" }, { status: 500 })
    }

    return NextResponse.json({ message: "Account linked successfully" })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/link-account" })
  }
}

