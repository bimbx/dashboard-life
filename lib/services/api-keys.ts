import crypto from "crypto"
import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { logSecurityEvent } from "./logging"

// Generate a new API key
export async function generateApiKey(userId: string, name: string, scopes: string[]): Promise<string> {
  // Generate a random API key
  const apiKey = `pk_${crypto.randomBytes(24).toString("hex")}`

  // Hash the API key for storage
  const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex")

  // Store the hashed key in the database
  await db.insert(apiKeys).values({
    userId,
    name,
    key: hashedKey,
    scopes,
    createdAt: new Date(),
    lastUsed: null,
  })

  // Log the API key creation
  await logSecurityEvent(userId, "API_KEY_CREATED", { name, scopes }, "info")

  // Return the unhashed key (will only be shown once)
  return apiKey
}

// Validate an API key
export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; userId?: string; scopes?: string[] }> {
  // Hash the provided API key
  const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex")

  // Look up the key in the database
  const keyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, hashedKey),
  })

  if (!keyRecord) {
    return { valid: false }
  }

  // Update last used timestamp
  await db.update(apiKeys).set({ lastUsed: new Date() }).where(eq(apiKeys.id, keyRecord.id))

  // Log the API key usage
  await logSecurityEvent(keyRecord.userId, "API_KEY_USED", { keyId: keyRecord.id, name: keyRecord.name }, "info")

  return {
    valid: true,
    userId: keyRecord.userId,
    scopes: keyRecord.scopes,
  }
}

// Revoke an API key
export async function revokeApiKey(userId: string, keyId: string): Promise<boolean> {
  const result = await db
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)))
    .returning({ id: apiKeys.id })

  if (result.length > 0) {
    // Log the API key revocation
    await logSecurityEvent(userId, "API_KEY_REVOKED", { keyId }, "info")
    return true
  }

  return false
}

// List all API keys for a user
export async function listApiKeys(userId: string) {
  return db.query.apiKeys.findMany({
    where: eq(apiKeys.userId, userId),
    orderBy: (apiKeys, { desc }) => [desc(apiKeys.createdAt)],
  })
}

