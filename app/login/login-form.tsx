"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Form validation schema for regular login
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

// Form validation schema for admin login
const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAdminLoading, setIsAdminLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("user")

  // Check for error from NextAuth
  const errorParam = searchParams.get("error")
  
  // Regular login form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })
  
  // Admin login form
  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    formState: { errors: adminErrors }
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })
  
  // Handle regular login
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl
      })
      
      if (result?.error) {
        setError("Invalid email or password")
        console.error("Login error:", result.error)
        return
      }
      
      // Redirect to callback URL or dashboard
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle admin login
  const onAdminSubmit = async (data: AdminLoginFormValues) => {
    try {
      setIsAdminLoading(true)
      setError(null)
      
      const result = await signIn("admin-login", {
        username: data.username,
        password: data.password,
        redirect: false,
        callbackUrl
      })
      
      if (result?.error) {
        setError("Invalid admin credentials")
        console.error("Admin login error:", result.error)
        return
      }
      
      // Redirect to callback URL or dashboard
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Admin login error:", err)
    } finally {
      setIsAdminLoading(false)
    }
  }
  
  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)
      
      await signIn("google", {
        callbackUrl,
        redirect: true
      })
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Google sign in error:", err)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="user" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">User Login</TabsTrigger>
          <TabsTrigger value="admin">Admin Login</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Sign in to your Productivity Dashboard account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(error || errorParam) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || "Authentication failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="admin">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Sign in with your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && activeTab === "admin" && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmitAdmin(onAdminSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  placeholder="Admin username"
                  {...registerAdmin("username")}
                  disabled={isAdminLoading}
                />
                {adminErrors.username && (
                  <p className="text-sm text-red-500">{adminErrors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  {...registerAdmin("password")}
                  disabled={isAdminLoading}
                />
                {adminErrors.password && (
                  <p className="text-sm text-red-500">{adminErrors.password.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isAdminLoading}>
                {isAdminLoading ? "Signing in..." : "Admin Sign In"}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}