import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"

// Get all tasks for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// Create a new task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { text, category, priority, completed } = await request.json()

    if (!text) {
      return NextResponse.json({ message: "Task text is required" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        text,
        category: category || "todo",
        priority,
        completed: completed || false,
        userId: session.user.id as string,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

