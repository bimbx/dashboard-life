import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { exportUserData } from "@/lib/services/user-cleanup"
import { logSecurityEvent } from "@/lib/services/logging"
import { createErrorResponse } from "@/lib/utils/error-handler"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Log the export request
    await logSecurityEvent(userId, "DATA_EXPORT_REQUESTED", {}, "info")

    // Get all user data
    const exportData = await exportUserData(userId)

    // Set headers for file download
    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="user-data-export-${new Date().toISOString()}.json"`,
      },
    })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/export" })
  }
}

