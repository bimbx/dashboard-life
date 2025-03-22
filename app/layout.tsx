import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
<<<<<<< HEAD
import "./globals.css"
import Sidebar from "@/components/sidebar"
=======
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SessionProvider } from "@/components/session-provider"
import "./globals.css"
>>>>>>> a251471 (Second try nextauth.js)

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Productivity Dashboard",
  description: "A comprehensive productivity dashboard with task management, habit tracking, and health monitoring",
<<<<<<< HEAD
    generator: 'v0.dev'
}

export default function RootLayout({
=======
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default async function RootLayout({
>>>>>>> a251471 (Second try nextauth.js)
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
<<<<<<< HEAD
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#121212] text-white`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
=======
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#121212] text-white antialiased`}>
        <SessionProvider session={session}>{children}</SessionProvider>
>>>>>>> a251471 (Second try nextauth.js)
      </body>
    </html>
  )
}



import './globals.css'