import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { disableTwoFactor, verifyTOTP } from "@/lib/auth/two-factor"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"
import { validateBody } from "@/lib/utils/validation"

// Schema for disabling 2FA
const disableTwoFactorSchema = z.object({
  token: z.string().length(6, "Token must be 6 digits").regex(/^\d+$/, "Token must contain only digits"),
})

// Disable 2FA for a user
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

    // Get the user's 2FA secret
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { twoFactorSecret: true, twoFactorEnabled: true },
    })

    if (!user?.twoFactorEnabled || !user?.twoFactorSecret) {
      throw new AppError("Two-factor authentication is not enabled", 400, "2FA_NOT_ENABLED")
    }

    // Validate request body
    const validatedData = await validateBody(request, disableTwoFactorSchema)

    // Verify the token
    const isValid = verifyTOTP(validatedData.token, user.twoFactorSecret)

    if (!isValid) {
      throw new AppError("Invalid verification code", 400, "INVALID_TOKEN")
    }

    // Disable 2FA for the user
    await disableTwoFactor(userId)

    return NextResponse.json({
      message: "Two-factor authentication disabled successfully",
    })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/two-factor/disable" })
  }
}

