import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Redirect to dashboard if authenticated, otherwise to login
  if (session && session.user) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }

  // This will never be rendered
  return null
}

