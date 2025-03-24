import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { applyRateLimit } from "./middleware/rate-limit"
import { logSecurityEvent } from "./lib/services/logging"

export async function middleware(req: NextRequest) {
  // Check for rate limiting on API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const rateLimitResponse = await applyRateLimit(req)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
  }

  // Get the pathname
  const path = req.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/api/auth", "/favicon.ico", "/robots.txt"]
  const isPublicPath = publicPaths.some((publicPath) => path === publicPath || path.startsWith(publicPath))

  // Check if the user is authenticated
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })

  const isAuthenticated = !!token

  // Log suspicious access attempts
  if (!isAuthenticated && !isPublicPath) {
    const ip = req.headers.get("x-forwarded-for") || "anonymous"
    console.warn(`Unauthenticated access attempt to ${path} from IP ${ip}`)
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", encodeURI(path))
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login/signup pages
  if (isAuthenticated && isPublicPath && path !== "/api/auth") {
    // Log successful authentication
    if (token.id) {
      await logSecurityEvent(token.id, "AUTHENTICATED_ACCESS_TO_PUBLIC_PATH", { path }, "info")
    }
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Permissions Policy
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")

  // Content Security Policy - adjust as needed for your application
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'",
  )

  return response
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth routes (for NextAuth.js)
     * 2. /_next (for static files)
     * 3. /favicon.ico, /robots.txt (common static files)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}

