import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { tasks, habits, moods, goals, pomodoros } from "@/lib/db/schema"
import { z } from "zod"
import { logActivity, logSecurityEvent } from "@/lib/services/logging"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"
import { invalidateUserCache } from "@/lib/services/cache"

// Define validation schema for import data
const importSchema = z.object({
  tasks: z
    .array(
      z.object({
        text: z.string(),
        category: z.string(),
        priority: z.string().optional(),
        completed: z.boolean().optional(),
      }),
    )
    .optional(),
  habits: z
    .array(
      z.object({
        name: z.string(),
        color: z.string(),
        timeOfDay: z.string(),
        streak: z.number().optional(),
      }),
    )
    .optional(),
  moods: z
    .array(
      z.object({
        mood: z.string(),
        note: z.string().optional(),
        createdAt: z.string().optional(),
      }),
    )
    .optional(),
  goals: z
    .array(
      z.object({
        name: z.string(),
        dueDate: z.string().optional(),
        isPublic: z.boolean().optional(),
        completed: z.boolean().optional(),
      }),
    )
    .optional(),
  pomodoros: z
    .array(
      z.object({
        duration: z.number(),
        notes: z.string().optional(),
        completed: z.boolean().optional(),
      }),
    )
    .optional(),
})

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

    const userId = session.user.id

    // Parse and validate the request body
    let body
    try {
      body = await request.json()
    } catch (e) {
      throw new AppError("Invalid JSON in request body", 400, "INVALID_JSON")
    }

    const validationResult = importSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid import data format",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      )
    }

    const importData = validationResult.data

    // Log the import attempt
    await logSecurityEvent(
      userId,
      "DATA_IMPORT_STARTED",
      {
        tasksCount: importData.tasks?.length || 0,
        habitsCount: importData.habits?.length || 0,
        moodsCount: importData.moods?.length || 0,
        goalsCount: importData.goals?.length || 0,
        pomodorosCount: importData.pomodoros?.length || 0,
      },
      "info",
    )

    // Process the import in a transaction
    await db.transaction(async (tx) => {
      // Import tasks
      if (importData.tasks?.length) {
        for (const task of importData.tasks) {
          await tx.insert(tasks).values({
            ...task,
            userId,
            createdAt: new Date(),
          })
        }
      }

      // Import habits
      if (importData.habits?.length) {
        for (const habit of importData.habits) {
          await tx.insert(habits).values({
            ...habit,
            userId,
            createdAt: new Date(),
          })
        }
      }

      // Import moods
      if (importData.moods?.length) {
        for (const mood of importData.moods) {
          await tx.insert(moods).values({
            ...mood,
            userId,
            createdAt: mood.createdAt ? new Date(mood.createdAt) : new Date(),
          })
        }
      }

      // Import goals
      if (importData.goals?.length) {
        for (const goal of importData.goals) {
          await tx.insert(goals).values({
            ...goal,
            userId,
            dueDate: goal.dueDate ? new Date(goal.dueDate) : undefined,
            createdAt: new Date(),
          })
        }
      }

      // Import pomodoros
      if (importData.pomodoros?.length) {
        for (const pomodoro of importData.pomodoros) {
          await tx.insert(pomodoros).values({
            ...pomodoro,
            userId,
            createdAt: new Date(),
          })
        }
      }
    })

    // Invalidate all user cache
    await invalidateUserCache(userId)

    // Log the import activity
    await logActivity(userId, "DATA_IMPORT_COMPLETED", {
      tasksCount: importData.tasks?.length || 0,
      habitsCount: importData.habits?.length || 0,
      moodsCount: importData.moods?.length || 0,
      goalsCount: importData.goals?.length || 0,
      pomodorosCount: importData.pomodoros?.length || 0,
    })

    return NextResponse.json({
      message: "Data imported successfully",
      counts: {
        tasks: importData.tasks?.length || 0,
        habits: importData.habits?.length || 0,
        moods: importData.moods?.length || 0,
        goals: importData.goals?.length || 0,
        pomodoros: importData.pomodoros?.length || 0,
      },
    })
  } catch (error) {
    return createErrorResponse(error, { route: "/api/user/import" })
  }
}

