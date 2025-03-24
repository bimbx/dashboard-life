import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { verifyTOTP, enableTwoFactor } from "@/lib/auth/two-factor"
import { z } from "zod"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"
import { validateBody } from "@/lib/utils/validation"

// Schema for enabling 2FA
const enableTwoFactorSchema = z.object({
  secret: z.string().min(1, "Secret is required"),
  token: z.string().length(6, "Token must be 6 digits").regex(/^\d+$/, "Token must contain only digits"),
})

// Enable 2FA for a user
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
    const validatedData = await validateBody(request, enableTwoFactorSchema)

    // Verify the token
    const isValid = verifyTOTP(validatedData.token, validatedData.secret)

    if (!isValid) {
      throw new AppError("Invalid verification code", 400, "INVALID_TOKEN")
    }

    // Enable 2FA for the user
    await enableTwoFactor(userId, validatedData.secret)

    return NextResponse.json({
      message: "Two-factor authentication enabled successfully",
    })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/two-factor/enable" })
  }
}

