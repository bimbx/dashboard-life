import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Get the pathname
  const path = req.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/api/auth"]
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath))

  // Check if the user is authenticated
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  })

  const isAuthenticated = !!token

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", encodeURI(path))
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login/signup pages
  if (isAuthenticated && isPublicPath && path !== "/api/auth") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
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

