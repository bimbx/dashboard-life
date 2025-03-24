import Link from "next/link"
import { useSession } from "next-auth/react"
import { UserProfile } from "@/components/user-profile"

export function NavBar() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold">
          Productivity Dashboard
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {isAdmin ? (
            <>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                Users
              </Link>
              <Link href="/admin/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-gray-600 hover:text-gray-900">
                Tasks
              </Link>
              <Link href="/habits" className="text-gray-600 hover:text-gray-900">
                Habits
              </Link>
              <Link href="/moods" className="text-gray-600 hover:text-gray-900">
                Moods
              </Link>
            </>
          )}
        </nav>
        <UserProfile />
      </div>
    </header>
  )
}

