import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { users, tasks, habits, moods, goals } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated or not admin
  if (!session?.user?.isAdmin) {
    redirect("/login")
  }

  // Get statistics
  const [userCount] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(users)

  const [taskCount] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(tasks)

  const [habitCount] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(habits)

  const [moodCount] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(moods)

  const [goalCount] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(goals)

  // Get recent users
  const recentUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.id)],
    limit: 5,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount.count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCount.count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitCount.count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Moods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodCount.count}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>The most recently registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Admin</th>
                  <th className="text-left py-3 px-4">ID</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.name || "N/A"}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.isAdmin ? "Yes" : "No"}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Quick actions for administrators</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">User Management</h3>
            <p className="text-sm text-gray-500 mb-4">Manage user accounts, permissions, and data</p>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">System Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Configure system settings and preferences</p>
            <Button variant="outline" className="w-full">
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

