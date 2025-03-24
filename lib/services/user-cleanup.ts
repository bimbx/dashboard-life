import { db } from "@/lib/db"
import { users, tasks, habits, moods, goals, pomodoros, sessions, accounts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { redis } from "@/lib/redis"
import { logActivity, logSecurityEvent } from "./logging"

/**
 * Completely clean up all data for a user
 * Used when a user deletes their account
 */
export async function cleanupUserData(userId: string): Promise<void> {
  try {
    // Log the cleanup attempt
    await logSecurityEvent(userId, "USER_DATA_CLEANUP_STARTED", {}, "info")

    // Use a transaction to ensure all database operations succeed or fail together
    await db.transaction(async (tx) => {
      // Delete all user data from each table
      await tx.delete(pomodoros).where(eq(pomodoros.userId, userId))
      await tx.delete(goals).where(eq(goals.userId, userId))
      await tx.delete(moods).where(eq(moods.userId, userId))
      await tx.delete(habits).where(eq(habits.userId, userId))
      await tx.delete(tasks).where(eq(tasks.userId, userId))

      // Delete auth-related data
      await tx.delete(sessions).where(eq(sessions.userId, userId))
      await tx.delete(accounts).where(eq(accounts.userId, userId))

      // Finally delete the user
      await tx.delete(users).where(eq(users.id, userId))
    })

    // Clean up Redis cache
    const userKeys = await redis.keys(`user:${userId}:*`)
    if (userKeys.length > 0) {
      await redis.del(...userKeys)
    }

    // Clean up any logs
    const logKeys = await redis.keys(`logs:*:${userId}:*`)
    if (logKeys.length > 0) {
      await redis.del(...logKeys)
    }

    // Log the successful cleanup
    console.log(`User data cleanup completed for user ${userId}`)
  } catch (error) {
    console.error(`Error cleaning up user data for ${userId}:`, error)
    throw error
  }
}

/**
 * Export all user data in a structured format
 * Used for GDPR compliance and data portability
 */
export async function exportUserData(userId: string): Promise<Record<string, any>> {
  try {
    // Fetch all user data
    const userData = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        // Exclude password
      },
    })

    if (!userData) {
      throw new Error(`User not found: ${userId}`)
    }

    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
    })

    const userHabits = await db.query.habits.findMany({
      where: eq(habits.userId, userId),
    })

    const userMoods = await db.query.moods.findMany({
      where: eq(moods.userId, userId),
    })

    const userGoals = await db.query.goals.findMany({
      where: eq(goals.userId, userId),
    })

    const userPomodoros = await db.query.pomodoros.findMany({
      where: eq(pomodoros.userId, userId),
    })

    // Log the export activity
    await logActivity(userId, "DATA_EXPORT", {
      tasksCount: userTasks.length,
      habitsCount: userHabits.length,
      moodsCount: userMoods.length,
      goalsCount: userGoals.length,
      pomodorosCount: userPomodoros.length,
    })

    // Compile all data
    return {
      user: userData,
      tasks: userTasks,
      habits: userHabits,
      moods: userMoods,
      goals: userGoals,
      pomodoros: userPomodoros,
      exportDate: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error exporting user data for ${userId}:`, error)
    throw error
  }
}

