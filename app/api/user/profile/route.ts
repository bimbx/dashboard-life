import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, image } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    // Update user
    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        image,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ message: "Profile updated successfully", user: userWithoutPassword }, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

