import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { getUserCacheKey, getCache, setCache, invalidateUserResourceCache } from "@/lib/services/cache"
import { logActivity } from "@/lib/services/logging"
import { validateBody, taskSchema } from "@/lib/utils/validation"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"

// Get all tasks for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id as string
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

    // Validate pagination parameters
    if (isNaN(page) || page < 1) {
      throw new AppError("Invalid page parameter", 400, "INVALID_PARAMETER")
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new AppError("Invalid limit parameter", 400, "INVALID_PARAMETER")
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Create cache key based on filters and pagination
    const cacheKey = category
      ? getUserCacheKey(userId, "tasks", `category:${category}:page:${page}:limit:${limit}`)
      : getUserCacheKey(userId, "tasks", `all:page:${page}:limit:${limit}`)

    // Try to get from cache
    const cachedTasks = await getCache(cacheKey)
    if (cachedTasks) {
      await logActivity(userId, "CACHE_HIT", { resource: "tasks", category, page, limit })
      return NextResponse.json(cachedTasks)
    }

    // Get total count for pagination metadata
    const totalCountResult = await db
      .select({ count: sql`count(*)::int` })
      .from(tasks)
      .where(category ? and(eq(tasks.userId, userId), eq(tasks.category, category)) : eq(tasks.userId, userId))

    const totalCount = totalCountResult[0]?.count || 0

    // Build query with pagination
    let query = db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
      limit,
      offset,
    })

    // Add category filter if provided
    if (category) {
      query = db.query.tasks.findMany({
        where: (tasks, { eq, and }) => and(eq(tasks.userId, userId), eq(tasks.category, category)),
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
        limit,
        offset,
      })
    }

    const userTasks = await query

    // Prepare response with pagination metadata
    const response = {
      data: userTasks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    }

    // Cache the results
    await setCache(cacheKey, response)

    // Log activity
    await logActivity(userId, "FETCH_TASKS", { count: userTasks.length, category, page, limit })

    return NextResponse.json(response)
  } catch (error) {
    return createErrorResponse(error, { route: "/api/tasks", method: "GET" })
  }
}

// Create a new task
export async function POST(request: Request) {
  try {
    // Check Content-Type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new AppError("Content-Type must be application/json", 415, "INVALID_CONTENT_TYPE")
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id as string

    // Validate request body
    const validatedData = await validateBody(request, taskSchema)

    // Create task in database
    const [task] = await db
      .insert(tasks)
      .values({
        text: validatedData.text,
        category: validatedData.category,
        priority: validatedData.priority,
        completed: validatedData.completed,
        userId,
      })
      .returning()

    // Invalidate tasks cache for this user
    await invalidateUserResourceCache(userId, "tasks")

    // Log activity
    await logActivity(userId, "CREATE_TASK", { taskId: task.id, category: task.category })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/tasks", method: "POST" })
  }
}

