"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Loader2, AlertCircle } from "lucide-react"
import PomodoroActivity from "@/components/pomodoro-activity"
import Calendar from "@/components/calendar"
import Position from "@/components/position"
import WorkMode from "@/components/work-mode"
import PomodoroTimer from "@/components/pomodoro-timer"
import TaskManagement from "@/components/task-management"
import QuickNotes from "@/components/quick-notes"
import { ErrorBoundary } from "react-error-boundary"

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-500 m-4">
      <AlertCircle className="w-6 h-6 mb-2" />
      <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
      <p className="mb-4">{error.message}</p>
      <button onClick={resetErrorBoundary} className="px-4 py-2 bg-red-500 text-white rounded-md">
        Try again
      </button>
    </div>
  )
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        // Check if the user has any saved preferences
        if (session?.user?.id) {
          const savedDate = localStorage.getItem(`selectedDate-${session.user.id}`)
          if (savedDate) {
            const date = new Date(savedDate)
            if (!isNaN(date.getTime())) {
              setSelectedDate(date)
            }
          }

          // Initialize task categories if they don't exist
          const key = `tasks-${session.user.id}`
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]))
          }
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading dashboard:", err)
        setError("Failed to load dashboard data. Please refresh the page.")
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      loadDashboardData()
    } else if (status === "unauthenticated") {
      setIsLoading(false)
    }
  }, [session?.user?.id, status])

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (!date || isNaN(date.getTime())) {
        console.error("Invalid date selected")
        return
      }

      setSelectedDate(date)

      // Save selected date to localStorage
      if (session?.user?.id) {
        localStorage.setItem(`selectedDate-${session.user.id}`, date.toISOString())
      }
    },
    [session?.user?.id],
  )

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen" role="status" aria-live="polite">
        <Loader2 className="w-10 h-10 text-[#ff4d4d] animate-spin" />
        <span className="sr-only">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-red-500" role="alert">
        <AlertCircle className="w-10 h-10 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#ff4d4d] text-white rounded-md">
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-[#121212] min-h-screen">
      {/* Left Column */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <PomodoroActivity />
        </ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <Calendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
          </ErrorBoundary>
          <div className="space-y-4">
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
              <Position />
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
              <WorkMode />
            </ErrorBoundary>
          </div>
        </div>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <PomodoroTimer />
        </ErrorBoundary>
      </div>

      {/* Middle Column - Work done today */}
      <div className="col-span-12 lg:col-span-3">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <TaskManagement category="done" title="Work done today" />
        </ErrorBoundary>
      </div>

      {/* Right Column - Work todos */}
      <div className="col-span-12 lg:col-span-3">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <TaskManagement category="todo" title="Work todos today" />
        </ErrorBoundary>
      </div>

      {/* Far Right Column - Forgotten & Overdue */}
      <div className="col-span-12 lg:col-span-2 space-y-4">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <TaskManagement category="forgotten" title="Forgotten" compact />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <TaskManagement category="overdue" title="Overdue" compact />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
          <QuickNotes />
        </ErrorBoundary>
      </div>
    </div>
  )
}

