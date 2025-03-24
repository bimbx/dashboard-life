import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { cleanupUserData } from "@/lib/services/user-cleanup"
import { logSecurityEvent } from "@/lib/services/logging"
import { createErrorResponse } from "@/lib/utils/error-handler"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Log the deletion request
    await logSecurityEvent(userId, "ACCOUNT_DELETION_REQUESTED", {}, "warning")

    // Clean up all user data
    await cleanupUserData(userId)

    // Return success response
    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/delete" })
  }
}

