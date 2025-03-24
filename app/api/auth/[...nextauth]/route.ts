import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema"
import { logActivity, logSecurityEvent } from "@/lib/services/logging"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Email/password provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          })

          // If user not found or no password (OAuth user), return null
          if (!user || !user.password) {
            return null
          }

          // Check if password matches
          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            // Log failed login attempt
            await logSecurityEvent(
              user.id,
              "FAILED_LOGIN_ATTEMPT",
              {
                email: credentials.email,
                reason: "Invalid password",
              },
              "warning",
            )
            return null
          }

          // Log successful login
          await logSecurityEvent(
            user.id,
            "CREDENTIALS_LOGIN",
            {
              email: credentials.email,
            },
            "info",
          )

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            isAdmin: user.isAdmin,
          }
        } catch (error) {
          console.error("Error in authorize:", error)
          return null
        }
      },
    }),

    // Admin credentials provider
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        username: { label: "Admin Username", type: "text" },
        password: { label: "Admin Password", type: "password" },
      },
      async authorize(credentials) {
        // Check admin credentials against environment variables
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          // Create or get admin user
          const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"

          // Find or create admin user
          let adminUser = await db.query.users.findFirst({
            where: eq(users.email, adminEmail),
          })

          if (!adminUser) {
            // Create admin user if it doesn't exist
            const [newAdmin] = await db
              .insert(users)
              .values({
                email: adminEmail,
                name: "Admin User",
                isAdmin: true,
              })
              .returning()

            adminUser = newAdmin
          } else if (!adminUser.isAdmin) {
            // Update user to be admin if not already
            await db.update(users).set({ isAdmin: true }).where(eq(users.id, adminUser.id))

            adminUser.isAdmin = true
          }

          // Log admin login
          await logSecurityEvent(adminUser.id, "ADMIN_LOGIN", {}, "info")

          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            image: adminUser.image,
            isAdmin: true,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (account && user) {
        // Add user ID and admin status to token
        token.id = user.id
        token.isAdmin = user.isAdmin || false

        // Log OAuth login
        if (account.provider === "google") {
          await logSecurityEvent(
            user.id,
            "OAUTH_LOGIN",
            {
              provider: account.provider,
              email: user.email,
            },
            "info",
          )
        }
      }

      // Update token when session is updated
      if (trigger === "update" && session) {
        if (session.user) {
          token.name = session.user.name
          token.picture = session.user.image
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }

      // Log the sign-in attempt
      if (user.id) {
        await logActivity(user.id, "SIGN_IN", {
          provider: account?.provider || "credentials",
          email: user.email,
        })
      }

      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

