"use client"

<<<<<<< HEAD
import { useState } from "react"
import { Briefcase } from "lucide-react"

export default function WorkMode() {
  const [isActive, setIsActive] = useState(false)

  const toggleWorkMode = () => {
    setIsActive(!isActive)
=======
import { useState, useEffect, useCallback } from "react"
import { Briefcase } from "lucide-react"
import { useSession } from "next-auth/react"

export default function WorkMode() {
  const { data: session } = useSession()
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load work mode state from localStorage
  const loadWorkModeState = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const savedState = localStorage.getItem(`workMode-${session.user.id}`)
      if (savedState) {
        setIsActive(savedState === "true")
      }
    } catch (error) {
      console.error("Error loading work mode state:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    loadWorkModeState()
  }, [loadWorkModeState])

  const toggleWorkMode = () => {
    if (!session?.user?.id) return

    const newState = !isActive
    setIsActive(newState)

    // Save to localStorage
    try {
      localStorage.setItem(`workMode-${session.user.id}`, String(newState))

      // If we're activating work mode, log the start time
      if (newState) {
        localStorage.setItem(`workModeStarted-${session.user.id}`, new Date().toISOString())
      } else {
        // If we're deactivating, calculate duration and log it
        const startTimeStr = localStorage.getItem(`workModeStarted-${session.user.id}`)
        if (startTimeStr) {
          const startTime = new Date(startTimeStr)
          const endTime = new Date()
          const durationMs = endTime.getTime() - startTime.getTime()

          // Store work session history
          const historyKey = `workModeHistory-${session.user.id}`
          const history = JSON.parse(localStorage.getItem(historyKey) || "[]")
          history.push({
            start: startTimeStr,
            end: endTime.toISOString(),
            duration: durationMs,
          })
          localStorage.setItem(historyKey, JSON.stringify(history))
        }
      }
    } catch (error) {
      console.error("Error saving work mode state:", error)
    }
>>>>>>> a251471 (Second try nextauth.js)
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <Briefcase className="w-5 h-5 text-[#ff4d4d] mr-2" />
        <h2 className="text-lg font-semibold">Work Mode</h2>
      </div>

      <div className="flex justify-center">
        <button
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isActive ? "bg-[#ff4d4d]" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"}
          `}
          onClick={toggleWorkMode}
          aria-label={isActive ? "Deactivate Work Mode" : "Activate Work Mode"}
<<<<<<< HEAD
=======
          aria-pressed={isActive}
          disabled={isLoading}
>>>>>>> a251471 (Second try nextauth.js)
        >
          <Briefcase className="w-8 h-8 text-white" />
        </button>
      </div>
<<<<<<< HEAD
=======

      {isActive && <div className="mt-3 text-center text-sm text-gray-400">Work mode active</div>}
>>>>>>> a251471 (Second try nextauth.js)
    </div>
  )
}

