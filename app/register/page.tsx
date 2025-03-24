import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import RegisterForm from "./register-form"

export const metadata: Metadata = {
  title: "Register - Productivity Dashboard",
  description: "Create a new account for the Productivity Dashboard",
}

export default async function RegisterPage() {
  // Check if user is already logged in
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Productivity Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Create a new account to get started</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

