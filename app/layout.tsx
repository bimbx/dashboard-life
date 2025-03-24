import type React from "react"
import { initializeApp } from "@/lib/startup"
import { SessionProvider } from "@/providers/session-provider"
import "./globals.css"

// Initialize the app on the server side
if (typeof window === "undefined") {
  initializeApp().catch((error) => {
    console.error("Failed to initialize app:", error)
    process.exit(1)
  })
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
