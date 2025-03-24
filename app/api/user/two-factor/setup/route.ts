import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { generateTOTPSecret, generateTOTPQRCode } from "@/lib/auth/two-factor"
import { createErrorResponse } from "@/lib/utils/error-handler"

// Generate a new 2FA secret and QR code
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Generate a new secret
    const secret = generateTOTPSecret()

    // Generate a QR code
    const qrCode = await generateTOTPQRCode(session.user.email, secret)

    // Store the secret in the session temporarily
    // In a real implementation, you would store this in a temporary storage
    // and associate it with the user's session

    return NextResponse.json({
      secret,
      qrCode,
    })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/two-factor/setup" })
  }
}

