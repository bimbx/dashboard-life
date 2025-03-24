import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revokeApiKey } from "@/lib/services/api-keys"
import { createErrorResponse } from "@/lib/utils/error-handler"

// Revoke an API key
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { id } = params

    // Revoke the API key
    const success = await revokeApiKey(userId, id)

    if (!success) {
      return NextResponse.json({ message: "API key not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "API key revoked successfully" })
  } catch (error) {
    return createErrorResponse(error, { route: `/api/user/api-keys/${params.id}` })
  }
}

