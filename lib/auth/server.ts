import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

/**
 * Get the current user session on the server
 * Redirects to login if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return session.user
}

/**
 * Check if the user is authenticated on the server
 * Returns the session if authenticated, null otherwise
 */
export async function getSessionOrNull() {
  return await getServerSession(authOptions)
}

