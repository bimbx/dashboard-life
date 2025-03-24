import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { invalidateUserResourceCache } from "@/lib/services/cache"
import { logActivity, logSecurityEvent } from "@/lib/services/logging"
import { validateBody, taskSchema } from "@/lib/utils/validation"
import { AppError, createErrorResponse } from "@/lib/utils/error-handler"

// Update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    const { id } = params

    // Validate request body
    const validatedData = await validateBody(request, taskSchema.partial())

    // Update the task with a single query that checks ownership
    const [updatedTask] = await db
      .update(tasks)
      .set({
        text: validatedData.text,
        completed: validatedData.completed,
        category: validatedData.category,
        priority: validatedData.priority,
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning()

    if (!updatedTask) {
      // Log potential security concern - user trying to access non-existent or unauthorized task
      await logSecurityEvent(userId, "UNAUTHORIZED_TASK_ACCESS", { taskId: id, action: "update" }, "warning")
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Invalidate cache
    await invalidateUserResourceCache(userId, "tasks")

    // Log activity
    await logActivity(userId, "UPDATE_TASK", {
      taskId: id,
      category: updatedTask.category,
      completed: updatedTask.completed,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    return createErrorResponse(error, { route: `/api/tasks/[id]`, method: "PUT" })
  }
}

// Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id as string
    const { id } = params

    // Delete the task and check ownership in a single query
    const [deletedTask] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning()

    if (!deletedTask) {
      // Log potential security concern
      await logSecurityEvent(userId, "UNAUTHORIZED_TASK_ACCESS", { taskId: id, action: "delete" }, "warning")
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Invalidate cache
    await invalidateUserResourceCache(userId, "tasks")

    // Log activity
    await logActivity(userId, "DELETE_TASK", { taskId: id, category: deletedTask.category })

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    return createErrorResponse(error, { route: `/api/tasks/[id]`, method: "DELETE" })
  }
}

