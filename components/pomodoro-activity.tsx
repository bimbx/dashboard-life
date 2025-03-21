"use client"

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
    if (count === 0) return "bg-[#333333]"
    if (count < 3) return "bg-[#ff4d4d]/30"
    if (count < 5) return "bg-[#ff4d4d]/60"
    return "bg-[#ff4d4d]"
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <Timer className="w-5 h-5 text-[#ff4d4d] mr-2" />
        <h2 className="text-lg font-semibold">Pomodoro Activity</h2>
      </div>

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
    </div>
  )
}

