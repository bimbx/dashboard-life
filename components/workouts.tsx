"use client"

import { useState } from "react"
import { Dumbbell, ChevronLeft, ChevronRight } from "lucide-react"

export default function Workouts() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  const getMonthData = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay() - 1
    if (firstDayOfWeek < 0) firstDayOfWeek = 6 // Adjust Sunday to be 6

    const daysInMonth = lastDay.getDate()

    // Create array for the days
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const monthData = getMonthData()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const isToday = (day: number | null) => {
    if (!day) return false

    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number | null) => {
    if (!day) return false

    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Mock workout data
  const hasWorkout = (day: number | null) => {
    if (!day) return false
    return [3, 7, 12, 15, 20].includes(day)
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Dumbbell className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Workouts</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded-md bg-[#6c5ce7] text-white" onClick={() => {}}>
            Log completed workout
          </button>
          <button className="px-3 py-1 rounded-md bg-[#6c5ce7] text-white" onClick={() => {}}>
            Start a workout
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button className="p-1 rounded-md hover:bg-[#333]" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-medium">{formatMonth(currentMonth)}</h3>
          <button className="p-1 rounded-md hover:bg-[#333]" onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm text-gray-400 py-1">
              {day}
            </div>
          ))}

          {monthData.map((day, index) => (
            <div
              key={index}
              className={`
                relative aspect-square flex items-center justify-center rounded-md
                ${day === null ? "invisible" : "cursor-pointer hover:bg-[#333]"}
                ${isToday(day) ? "bg-[#6c5ce7] text-white" : ""}
                ${isSelected(day) && !isToday(day) ? "border border-[#6c5ce7]" : ""}
              `}
              onClick={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            >
              <span>{day}</span>
              {hasWorkout(day) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-green-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#333] pt-4">
        <h3 className="text-lg font-medium mb-4">
          {selectedDate.toLocaleDateString("default", { month: "long", day: "numeric" })}
        </h3>

        {hasWorkout(selectedDate.getDate()) ? (
          <div className="bg-[#2a2a2a] rounded-lg p-3">
            <div className="font-medium mb-1">Upper Body Workout</div>
            <div className="text-sm text-gray-400">45 minutes • 5 exercises</div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">No workouts for this day</div>
        )}
      </div>
    </div>
  )
}

