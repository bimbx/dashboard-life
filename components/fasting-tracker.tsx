"use client"

import { useState, useEffect } from "react"
import { Clock, Settings } from "lucide-react"

export default function FastingTracker() {
  const [isFasting, setIsFasting] = useState(true)
  const [fastingGoal, setFastingGoal] = useState(16) // hours
  const [elapsed, setElapsed] = useState(0) // percentage
  const [elapsedHours, setElapsedHours] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Mock data
  const startTime = new Date()
  startTime.setHours(startTime.getHours() - 0)

  const endTime = new Date(startTime)
  endTime.setHours(endTime.getHours() + fastingGoal)

  useEffect(() => {
    // Simulate elapsed time
    setElapsedHours(0)
    setElapsed(0)

    const interval = setInterval(() => {
      setElapsedHours((prev) => {
        const newHours = Math.min(prev + 0.01, fastingGoal)
        setElapsed((newHours / fastingGoal) * 100)
        return newHours
      })
    }, 100)

    return () => clearInterval(interval)
  }, [fastingGoal])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatHoursMinutes = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h${m > 0 ? ` ${m}m` : ""}`
  }

  const endFast = () => {
    setIsFasting(false)
  }

  const startFast = () => {
    setIsFasting(true)
    setElapsedHours(0)
    setElapsed(0)
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Fasting</h2>
        </div>
        <button
          className="p-1 rounded-md hover:bg-[#333] text-gray-400 hover:text-white"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings ? (
        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-4">Default Fasting Goal (hours)</h3>
          <div className="flex items-center mb-4">
            <input
              type="number"
              className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              value={fastingGoal}
              onChange={(e) => setFastingGoal(Number(e.target.value))}
              min={1}
              max={72}
            />
          </div>

          <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={() => setShowSettings(false)}>
            Update
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#333" strokeWidth="10" />

                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#6c5ce7"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - elapsed / 100)}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold">{formatHoursMinutes(elapsedHours)}</div>
                <div className="text-xs text-gray-400">{isFasting ? "Elapsed: 0%" : "Complete!"}</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-sm text-gray-400 mb-1">Tomorrow, {formatTime(endTime)}</div>
            <div className="text-sm text-gray-400">Left: 100%</div>
          </div>

          <div className="flex justify-center mb-6">
            {isFasting ? (
              <button className="px-4 py-2 rounded-md bg-red-500 text-white" onClick={endFast}>
                End fast now
              </button>
            ) : (
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={startFast}>
                Start fasting
              </button>
            )}

            {isFasting && (
              <button className="px-4 py-2 rounded-md text-gray-400 ml-2" onClick={() => setIsFasting(false)}>
                Cancel
              </button>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-400 border-t border-[#333] pt-4">
            <div>
              <div className="font-medium">STARTED FASTING</div>
              <div>Today, {formatTime(startTime)}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">FAST ENDING</div>
              <div>Tomorrow, {formatTime(endTime)}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Currently Fasting</h3>
            <div className="flex space-x-2">
              {["S", "M", "T", "W"].map((initial, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-[#6c5ce7] flex items-center justify-center">
                  {initial}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

