import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { pomodoros } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { getCache, setCache, getUserCacheKey } from "@/lib/services/cache"
import { logActivity } from "@/lib/services/logging"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Validate months parameter
    const months = Number.parseInt(searchParams.get("months") || "8", 10)
    if (isNaN(months) || months < 1 || months > 24) {
      throw new AppError("Invalid months parameter. Must be between 1 and 24.", 400, "INVALID_PARAMETER")
    }

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Only allow accessing own data unless admin role is implemented
    const userIdToUse = userId || session.user.id
    if (userId && userId !== session.user.id) {
      // In the future, check for admin role here
      return NextResponse.json({ message: "Unauthorized to access other user's data" }, { status: 403 })
    }

    // Try to get from cache first using standardized key
    const cacheKey = getUserCacheKey(userIdToUse, "pomodoro:activity", `months:${months}`)
    const cachedData = await getCache(cacheKey)

    if (cachedData) {
      // Log cache hit
      await logActivity(userIdToUse, "CACHE_HIT", { resource: "pomodoro:activity" })
      return NextResponse.json(cachedData)
    }

    // If not in cache, query the database
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)

    const pomodoroResults = await db
      .select({
        month: sql`to_char(${pomodoros.createdAt}, 'Mon')`,
        day: sql`extract(day from ${pomodoros.createdAt})::text`,
        count: sql`count(*)::int`,
      })
      .from(pomodoros)
      .where(
        and(
          eq(pomodoros.userId, userIdToUse),
          eq(pomodoros.completed, true),
          sql`${pomodoros.createdAt} >= ${startDate}`,
        ),
      )
      .groupBy(sql`to_char(${pomodoros.createdAt}, 'Mon')`, sql`extract(day from ${pomodoros.createdAt})::text`)

    // Transform the results into the expected format
    const activityData: Record<string, Record<string, number>> = {}

    // Initialize with all months
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthDisplay = date.toLocaleDateString("default", { month: "short" })
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

      activityData[monthDisplay] = {}

      // Initialize all days with 0
      for (let day = 1; day <= daysInMonth; day++) {
        activityData[monthDisplay][day.toString()] = 0
      }
    }

    // Fill in the actual data
    for (const result of pomodoroResults) {
      if (activityData[result.month] && result.day) {
        activityData[result.month][result.day] = result.count
      }
    }

    // Cache the result
    await setCache(cacheKey, activityData)

    // Log database query
    await logActivity(userIdToUse, "DB_QUERY", { resource: "pomodoro:activity" })

    return NextResponse.json(activityData)
  } catch (error) {
    return createErrorResponse(error, { route: "/api/pomodoros/activity" })
  }
}

