"use client"

<<<<<<< HEAD
import { useState } from "react"
import { Timer } from "lucide-react"

// Mock data for pomodoro activity
const generateMockData = () => {
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
  const data: Record<string, Record<string, number>> = {}

  months.forEach((month) => {
    data[month] = {}
    const daysInMonth = 30

    for (let i = 1; i <= daysInMonth; i++) {
      // Generate random number of pomodoros (0-10)
      data[month][i] = Math.floor(Math.random() * 11)
    }
  })

  return data
}

export default function PomodoroActivity() {
  const [pomodoroData] = useState(generateMockData())

  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]

  const getColorIntensity = (count: number) => {
=======
import { useState, useEffect, useMemo, useCallback } from "react"
import { Timer, Loader2, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"

interface MonthData {
  key: string
  display: string
  year: number
  month: number
  daysInMonth: number
}

interface PomodoroDataType {
  [month: string]: {
    [day: string]: number
  }
}

export default function PomodoroActivity() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pomodoroData, setPomodoroData] = useState<PomodoroDataType>({})

  // Dynamically calculate the last 8 months (including current month)
  const months = useMemo<MonthData[]>(() => {
    const result: MonthData[] = []
    const currentDate = new Date()

    // Start from 7 months ago and include current month
    for (let i = 7; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)

      // Calculate days in this month (accounting for leap years)
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

      // Format as "MMM" for display
      const monthDisplay = date.toLocaleDateString("default", { month: "short" })

      // Create a unique key that includes year and month
      const monthKey = `${monthDisplay}-${date.getFullYear()}`

      result.push({
        key: monthKey,
        display: monthDisplay,
        year: date.getFullYear(),
        month: date.getMonth(),
        daysInMonth,
      })
    }

    return result
  }, [])

  const fetchPomodoroData = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const key = `pomodoroData-${session.user.id}`
      const storedData = localStorage.getItem(key)

      if (storedData) {
        setPomodoroData(JSON.parse(storedData))
      } else {
        // Initialize with empty data structure
        const data: PomodoroDataType = {}

        months.forEach((monthData) => {
          data[monthData.display] = {}

          // Initialize with zero counts
          for (let i = 1; i <= monthData.daysInMonth; i++) {
            data[monthData.display][i.toString()] = 0
          }
        })

        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(data))
        setPomodoroData(data)
      }
    } catch (error) {
      console.error("Error fetching pomodoro data:", error)
      setError("Failed to load pomodoro data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [months, session?.user?.id])

  useEffect(() => {
    fetchPomodoroData()
  }, [fetchPomodoroData])

  const getColorIntensity = useCallback((count: number): string => {
>>>>>>> a251471 (Second try nextauth.js)
    if (count === 0) return "bg-[#333333]"
    if (count < 3) return "bg-[#ff4d4d]/30"
    if (count < 5) return "bg-[#ff4d4d]/60"
    return "bg-[#ff4d4d]"
<<<<<<< HEAD
=======
  }, [])

  if (error) {
    return (
      <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
        <div className="flex items-center mb-4">
          <Timer className="w-5 h-5 text-[#ff4d4d] mr-2" />
          <h2 className="text-lg font-semibold">Pomodoro Activity</h2>
        </div>
        <div className="flex items-center justify-center p-4 text-red-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      </div>
    )
>>>>>>> a251471 (Second try nextauth.js)
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <Timer className="w-5 h-5 text-[#ff4d4d] mr-2" />
        <h2 className="text-lg font-semibold">Pomodoro Activity</h2>
      </div>

<<<<<<< HEAD
      <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
        {months.map((month) => (
          <div key={month} className="text-xs text-gray-400">
            {month}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-30 gap-1 mb-4">
        {months.map((month) =>
          Object.entries(pomodoroData[month]).map(([day, count]) => (
            <div
              key={`${month}-${day}`}
              className={`w-full aspect-square rounded-sm ${getColorIntensity(count)}`}
              title={`${day} ${month}: ${count} pomodoros`}
            />
          )),
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#333333] rounded-sm mr-2"></div>
          <span>No pomodoros</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#ff4d4d] rounded-sm mr-2"></div>
          <span>7+ pomodoros</span>
        </div>
      </div>
=======
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 text-[#ff4d4d] animate-spin" aria-label="Loading pomodoro data" />
        </div>
      ) : (
        <>
          <div className="flex space-x-4 mb-2 overflow-x-auto pb-2">
            {months.map((monthData) => (
              <div key={monthData.key} className="text-xs text-gray-400 min-w-[30px] text-center">
                {monthData.display}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-30 gap-1 mb-4">
            {months.map((monthData) =>
              Array.from({ length: monthData.daysInMonth }, (_, i) => {
                const day = (i + 1).toString()
                const count = pomodoroData[monthData.display]?.[day] || 0

                return (
                  <div
                    key={`${monthData.key}-${day}`}
                    className={`w-full aspect-square rounded-sm ${getColorIntensity(count)}`}
                    title={`${day} ${monthData.display} ${monthData.year}: ${count} pomodoros`}
                    role="cell"
                    aria-label={`${count} pomodoros on ${day} ${monthData.display} ${monthData.year}`}
                  />
                )
              }),
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#333333] rounded-sm mr-2" aria-hidden="true"></div>
              <span>No pomodoros</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ff4d4d] rounded-sm mr-2" aria-hidden="true"></div>
              <span>7+ pomodoros</span>
            </div>
          </div>
        </>
      )}
>>>>>>> a251471 (Second try nextauth.js)
    </div>
  )
}

