import { db } from "@/lib/db"
import { users, accounts, tasks, habits, moods, goals, pomodoros } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { logSecurityEvent } from "./logging"
import { invalidateUserCache } from "./cache"

/**
 * Associate user data from different authentication methods
 * This is useful when a user signs in with Google after previously using email/password
 */
export async function associateUserAccounts(
  primaryUserId: string,
  providerAccountId: string,
  provider: string,
): Promise<boolean> {
  try {
    // Find the account with the provider account ID
    const existingAccount = await db.query.accounts.findFirst({
      where: and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider)),
      with: {
        user: true,
      },
    })

    if (!existingAccount || existingAccount.userId === primaryUserId) {
      // No account to associate or already associated
      return false
    }

    const secondaryUserId = existingAccount.userId

    // Begin a transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Update all resources to point to the primary user
      await tx.update(tasks).set({ userId: primaryUserId }).where(eq(tasks.userId, secondaryUserId))

      await tx.update(habits).set({ userId: primaryUserId }).where(eq(habits.userId, secondaryUserId))

      await tx.update(moods).set({ userId: primaryUserId }).where(eq(moods.userId, secondaryUserId))

      await tx.update(goals).set({ userId: primaryUserId }).where(eq(goals.userId, secondaryUserId))

      await tx.update(pomodoros).set({ userId: primaryUserId }).where(eq(pomodoros.userId, secondaryUserId))

      // Update the account to point to the primary user
      await tx.update(accounts).set({ userId: primaryUserId }).where(eq(accounts.userId, secondaryUserId))

      // Log the account association
      await logSecurityEvent(
        primaryUserId,
        "ACCOUNT_ASSOCIATED",
        {
          provider,
          secondaryUserId,
        },
        "info",
      )

      // Delete the secondary user
      await tx.delete(users).where(eq(users.id, secondaryUserId))
    })

    // Invalidate cache for the primary user
    await invalidateUserCache(primaryUserId)

    return true
  } catch (error) {
    console.error("Error associating user accounts:", error)
    return false
  }
}

/**
 * Link a new authentication method to an existing user
 */
export async function linkAuthMethod(
  userId: string,
  provider: string,
  providerAccountId: string,
  providerData: Record<string, any>,
): Promise<boolean> {
  try {
    // Check if this provider account is already linked to another user
    const existingAccount = await db.query.accounts.findFirst({
      where: and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider)),
    })

    if (existingAccount) {
      if (existingAccount.userId === userId) {
        // Already linked to this user
        return true
      } else {
        // Linked to another user, associate accounts
        return await associateUserAccounts(userId, providerAccountId, provider)
      }
    }

    // Create a new account link
    await db.insert(accounts).values({
      userId,
      provider,
      providerAccountId,
      type: providerData.type || "oauth",
      ...providerData,
    })

    // Log the account linking
    await logSecurityEvent(
      userId,
      "AUTH_METHOD_LINKED",
      {
        provider,
        providerAccountId,
      },
      "info",
    )

    return true
  } catch (error) {
    console.error("Error linking auth method:", error)
    return false
  }
}

