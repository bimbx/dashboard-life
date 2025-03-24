import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { redis } from "@/lib/redis"
import { logSecurityEvent } from "@/lib/services/logging"

interface RateLimitConfig {
  limit: number
  window: number // in seconds
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  limit: 100, // 100 requests
  window: 60, // per minute
}

// Endpoint-specific rate limits
const API_RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/auth/": { limit: 10, window: 60 }, // Login/signup - stricter
  "/api/tasks/": { limit: 100, window: 60 }, // Regular API
  "/api/habits/": { limit: 100, window: 60 },
  "/api/moods/": { limit: 100, window: 60 },
  "/api/goals/": { limit: 100, window: 60 },
  "/api/pomodoros/": { limit: 50, window: 60 },
  default: { limit: 100, window: 60 },
}

/**
 * Rate limit middleware for API routes
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): Promise<{ limited: boolean; remaining: number }> {
  // Get token from request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Get IP address
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous"

  // Create a unique key based on user ID (if authenticated) or IP
  const identifier = token?.id ? `user:${token.id}` : `ip:${ip}`
  const key = `ratelimit:${identifier}`

  try {
    // Get current count
    const current = (await redis.get<number>(key)) || 0

    // Check if limit exceeded
    if (current >= config.limit) {
      // Log rate limit exceeded
      if (token?.id) {
        await logSecurityEvent(token.id, "RATE_LIMIT_EXCEEDED", { ip, path: req.nextUrl.pathname }, "warning")
      }

      return { limited: true, remaining: 0 }
    }

    // Increment counter
    await redis.incr(key)

    // Set expiry if it's a new key
    if (current === 0) {
      await redis.expire(key, config.window)
    }

    return { limited: false, remaining: config.limit - (current + 1) }
  } catch (error) {
    console.error("Rate limiting error:", error)
    // If Redis fails, allow the request to proceed
    return { limited: false, remaining: 1 }
  }
}

/**
 * Apply rate limiting to a request
 */
export async function applyRateLimit(req: NextRequest): Promise<NextResponse | null> {
  // Determine which rate limit to apply based on path
  const path = req.nextUrl.pathname
  let config = API_RATE_LIMITS.default

  for (const [prefix, limitConfig] of Object.entries(API_RATE_LIMITS)) {
    if (path.startsWith(prefix)) {
      config = limitConfig
      break
    }
  }

  const { limited, remaining } = await rateLimit(req, config)

  if (limited) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": config.window.toString(),
          "X-RateLimit-Limit": config.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + config.window).toString(),
        },
      },
    )
  }

  // Not limited, return null to continue processing
  return null
}

