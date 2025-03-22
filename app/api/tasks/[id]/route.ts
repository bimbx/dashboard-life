import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"

// Update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { text, completed, category, priority } = await request.json()

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (existingTask.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: {
        id,
      },
      data: {
        text: text !== undefined ? text : existingTask.text,
        completed: completed !== undefined ? completed : existingTask.completed,
        category: category !== undefined ? category : existingTask.category,
        priority: priority !== undefined ? priority : existingTask.priority,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findUnique({
      where: {
        id,
      },
    })

    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    if (existingTask.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Delete the task
    await prisma.task.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

