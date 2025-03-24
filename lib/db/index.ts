import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// For server-side usage only
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Connection for migrations and queries with proper pooling
const client = postgres(connectionString, {
  max: 10, // Maximum connections in pool
  idle_timeout: 30, // Close idle connections after 30 seconds
  connect_timeout: 10, // Connection timeout in seconds
})

export const db = drizzle(client, { schema })

/**
 * Create a database connection with Row-Level Security for a specific user
 * @param userId The ID of the user to set for RLS policies
 */
export async function getUserDb(userId: string) {
  if (!userId) {
    throw new Error("User ID is required for RLS")
  }

  try {
    // Set the current user ID for RLS policies
    await client`SELECT set_current_user_id(${userId})`

    // Return a new drizzle instance with the same client
    return drizzle(client, { schema })
  } catch (error) {
    console.error(`Error setting RLS context for user ${userId}:`, error)
    throw new Error("Failed to establish secure database connection")
  }
}

// Export schema for type inference
export * from "./schema"

