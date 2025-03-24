import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { hash, compare } from "bcrypt"
import { z } from "zod"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"
import { logSecurityEvent } from "@/lib/services/logging"
import { validatePasswordStrength, isPasswordCompromised } from "@/lib/utils/password-validation"

// Validation schema
const passwordUpdateSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
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

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    // Validate request data
    const validationResult = passwordUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const { currentPassword, newPassword } = validationResult.data

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // If user has a password, verify current password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json({ message: "Current password is required" }, { status: 400 })
      }

      const passwordMatch = await compare(currentPassword, user.password)
      if (!passwordMatch) {
        // Log failed password update attempt
        await logSecurityEvent(
          userId,
          "FAILED_PASSWORD_UPDATE",
          {
            reason: "Invalid current password",
          },
          "warning",
        )

        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
      }
    }

    // Validate password strength
    try {
      validatePasswordStrength(newPassword)
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json({ message: error.message }, { status: 400 })
      }
      throw error
    }

    // Check if password has been compromised
    const compromised = await isPasswordCompromised(newPassword)
    if (compromised) {
      return NextResponse.json(
        {
          message: "This password has been found in data breaches. Please choose a different password.",
        },
        { status: 400 },
      )
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update user password
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))

    // Log password update
    await logSecurityEvent(userId, "PASSWORD_UPDATED", {}, "info")

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/password" })
  }
}

