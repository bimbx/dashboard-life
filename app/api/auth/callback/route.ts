import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { linkAuthMethod } from "@/lib/services/user-association"
import { logSecurityEvent } from "@/lib/services/logging"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider")
    const providerAccountId = searchParams.get("providerAccountId")
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

    if (!provider || !providerAccountId) {
      return NextResponse.redirect(new URL(`/login?error=InvalidCallback`, request.url))
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL(`/login?error=Unauthorized`, request.url))
    }

    const userId = session.user.id

    // Link the account
    const success = await linkAuthMethod(userId, provider, providerAccountId, {
      type: "oauth",
    })

    if (!success) {
      return NextResponse.redirect(new URL(`/dashboard/account?error=LinkingFailed`, request.url))
    }

    // Log the account linking
    await logSecurityEvent(userId, "ACCOUNT_LINKED", { provider }, "info")

    // Redirect to callback URL
    return NextResponse.redirect(new URL(callbackUrl, request.url))
  } catch (error) {
    console.error("Error in auth callback:", error)
    return NextResponse.redirect(new URL(`/login?error=CallbackError`, request.url))
  }
}

