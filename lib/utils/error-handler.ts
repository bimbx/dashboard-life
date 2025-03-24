import { logError } from "@/lib/services/logging"
import { NextResponse } from "next/server"

export class AppError extends Error {
  statusCode: number
  code: string

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = "AppError"
  }
}

export async function handleApiError(error: unknown, context: Record<string, any> = {}) {
  // Log the error
  if (error instanceof Error) {
    await logError(error, context)
  } else {
    await logError(new Error(String(error)), context)
  }

  // Determine response
  if (error instanceof AppError) {
    return { message: error.message, code: error.code, status: error.statusCode }
  }

  // Default error response
  return { message: "An unexpected error occurred", code: "INTERNAL_ERROR", status: 500 }
}

export function createErrorResponse(error: unknown, context: Record<string, any> = {}) {
  // Log the error
  console.error(`API Error: ${context.route || "unknown route"}`, error)

  // Determine status and message
  let status = 500
  let message = "An unexpected error occurred"
  let code = "INTERNAL_ERROR"

  if (error instanceof AppError) {
    status = error.statusCode
    message = error.message
    code = error.code
  }

  // Return formatted response
  return NextResponse.json({ message, code }, { status })
}

