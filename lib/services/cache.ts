import { redis } from "@/lib/redis"
import { compress, decompress } from "@/lib/utils/compression"

export const CACHE_TTL = 60 * 60 // 1 hour in seconds
const COMPRESSION_THRESHOLD = 1024 // Compress objects larger than 1KB

/**
 * Generate a standardized cache key for a user resource
 */
export function getUserCacheKey(userId: string, resource: string, identifier?: string): string {
  return identifier ? `user:${userId}:${resource}:${identifier}` : `user:${userId}:${resource}`
}

/**
 * Get data from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    if (!data) return null

    // Check if data is compressed
    if (typeof data === "string" && data.startsWith("COMPRESSED:")) {
      const compressedData = data.substring(11) // Remove 'COMPRESSED:' prefix
      return JSON.parse(await decompress(compressedData)) as T
    }

    return data as T
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error)
    return null
  }
}

/**
 * Set data in cache with optional TTL
 */
export async function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL): Promise<void> {
  try {
    const stringData = JSON.stringify(data)

    // Compress large objects
    if (stringData.length > COMPRESSION_THRESHOLD) {
      const compressed = await compress(stringData)
      await redis.set(key, `COMPRESSED:${compressed}`, { ex: ttl })
    } else {
      await redis.set(key, data, { ex: ttl })
    }
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error)
  }
}

/**
 * Delete a specific cache entry
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error)
  }
}

/**
 * Invalidate all cache entries for a user
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  try {
    const keys = await redis.keys(`user:${userId}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error(`Error invalidating cache for user ${userId}:`, error)
  }
}

/**
 * Invalidate specific resource cache for a user
 */
export async function invalidateUserResourceCache(userId: string, resource: string): Promise<void> {
  try {
    const keys = await redis.keys(`user:${userId}:${resource}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error(`Error invalidating ${resource} cache for user ${userId}:`, error)
  }
}

/**
 * Get multiple cache entries at once
 */
export async function mgetCache(keys: string[]): Promise<Array<any | null>> {
  if (keys.length === 0) return []

  try {
    return await redis.mget(...keys)
  } catch (error) {
    console.error(`Error batch getting cache:`, error)
    return keys.map(() => null)
  }
}

/**
 * Set multiple cache entries at once
 */
export async function msetCache(entries: Array<[string, any]>, ttl: number = CACHE_TTL): Promise<void> {
  if (entries.length === 0) return

  try {
    const pipeline = redis.pipeline()

    for (const [key, value] of entries) {
      pipeline.set(key, value, { ex: ttl })
    }

    await pipeline.exec()
  } catch (error) {
    console.error(`Error batch setting cache:`, error)
  }
}

