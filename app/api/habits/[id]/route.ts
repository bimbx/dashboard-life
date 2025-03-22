import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"

// Update a habit
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { name, completed, color, timeOfDay, streak } = await request.json()

    // Check if the habit exists and belongs to the user
    const existingHabit = await prisma.habit.findUnique({
      where: {
        id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 })
    }

    if (existingHabit.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Update the habit
    const updatedHabit = await prisma.habit.update({
      where: {
        id,
      },
      data: {
        name: name !== undefined ? name : existingHabit.name,
        completed: completed !== undefined ? completed : existingHabit.completed,
        color: color !== undefined ? color : existingHabit.color,
        timeOfDay: timeOfDay !== undefined ? timeOfDay : existingHabit.timeOfDay,
        streak: streak !== undefined ? streak : existingHabit.streak,
      },
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    console.error("Error updating habit:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

// Delete a habit
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check if the habit exists and belongs to the user
    const existingHabit = await prisma.habit.findUnique({
      where: {
        id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 })
    }

    if (existingHabit.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Delete the habit
    await prisma.habit.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: "Habit deleted successfully" })
  } catch (error) {
    console.error("Error deleting habit:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

