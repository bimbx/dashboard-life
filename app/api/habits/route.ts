import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"

// Get all habits for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(habits)
  } catch (error) {
    console.error("Error fetching habits:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// Create a new habit
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, color, timeOfDay } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Habit name is required" }, { status: 400 })
    }

    const habit = await prisma.habit.create({
      data: {
        name,
        color: color || "#6c5ce7",
        timeOfDay: timeOfDay || "any",
        userId: session.user.id as string,
      },
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    console.error("Error creating habit:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

