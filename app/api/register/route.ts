import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { validatePasswordStrength, isPasswordCompromised } from "@/lib/utils/password-validation"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"
import { logSecurityEvent } from "@/lib/services/logging"
import { z } from "zod"

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: Request) {
  try {
    // Check Content-Type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new AppError("Content-Type must be application/json", 415, "INVALID_CONTENT_TYPE")
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    // Validate request data
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.format()
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: 400 },
      )
    }

    const { name, email, password } = validationResult.data

    // Validate password strength
    try {
      validatePasswordStrength(password)
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json({ message: error.message }, { status: 400 })
      }
      throw error
    }

    // Check if password has been compromised
    const compromised = await isPasswordCompromised(password)
    if (compromised) {
      return NextResponse.json(
        {
          message: "This password has been found in data breaches. Please choose a different password.",
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      })

    // Log registration
    await logSecurityEvent(user.id, "USER_REGISTERED", { email: user.email }, "info")

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return createErrorResponse(error, { route: "/api/register" })
  }
}

