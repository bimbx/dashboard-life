/**
 * Log security-related events
 */
export async function logSecurityEvent(
  userId: string,
  event: string,
  details: Record<string, any> = {},
  severity: "info" | "warning" | "error" = "info",
): Promise<void> {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    userId,
    event,
    details,
    severity,
  }

  // Log to console in development
  console.log(`[SECURITY ${severity.toUpperCase()}] ${event} for user ${userId}`, details)

  // In production, you would send this to a logging service
  if (process.env.NODE_ENV === "production") {
    try {
      // Example: Send to a logging endpoint
      // await fetch('/api/logs/security', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });

      // For now, we'll just store in Redis for demonstration
      const { redis } = await import("@/lib/redis")
      const key = `logs:security:${userId}:${timestamp}`
      await redis.set(key, JSON.stringify(logEntry))
      await redis.expire(key, 60 * 60 * 24 * 30) // 30 days retention
    } catch (error) {
      console.error("Failed to store security log:", error)
    }
  }
}

/**
 * Log application errors
 */
export async function logError(error: Error, context: Record<string, any> = {}, userId?: string): Promise<void> {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    userId: userId || "anonymous",
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  }

  // Log to console
  console.error(`[ERROR] ${error.message}`, { userId, ...context, stack: error.stack })

  // In production, you would send this to an error tracking service
  if (process.env.NODE_ENV === "production") {
    try {
      // Example: Send to an error tracking endpoint
      // await fetch('/api/logs/error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });

      // For now, we'll just store in Redis for demonstration
      const { redis } = await import("@/lib/redis")
      const key = `logs:error:${userId || "anonymous"}:${timestamp}`
      await redis.set(key, JSON.stringify(logEntry))
      await redis.expire(key, 60 * 60 * 24 * 30) // 30 days retention
    } catch (logError) {
      console.error("Failed to store error log:", logError)
    }
  }
}

/**
 * Log user activity
 */
export async function logActivity(userId: string, action: string, details: Record<string, any> = {}): Promise<void> {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    userId,
    action,
    details,
  }

  // In development, just log to console
  if (process.env.NODE_ENV !== "production") {
    console.log(`[ACTIVITY] ${action} by user ${userId}`, details)
    return
  }

  // In production, store activity logs
  try {
    const { redis } = await import("@/lib/redis")
    const key = `logs:activity:${userId}:${timestamp}`
    await redis.set(key, JSON.stringify(logEntry))
    await redis.expire(key, 60 * 60 * 24 * 7) // 7 days retention for activity logs
  } catch (error) {
    console.error("Failed to store activity log:", error)
  }
}

