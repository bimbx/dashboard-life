"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg bg-destructive/10 p-6 text-destructive">
            <h2 className="mb-4 text-xl font-bold">Something went wrong!</h2>
            <p className="mb-4">We're sorry, but an unexpected error occurred.</p>
            <Button variant="outline" onClick={reset} className="w-full">
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

