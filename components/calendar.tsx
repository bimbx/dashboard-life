"use client"
import { CalendarIcon } from "lucide-react"

interface CalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const currentDate = new Date(2025, 2, 1) // March 2025 as shown in the image

  // Calendar data for March 2025
  const daysInMonth = 31
  const firstDayOfMonth = 6 // Saturday (0 is Sunday, 6 is Saturday)

  // Create calendar days array
  const calendarDays = []

  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const isToday = (day: number) => day === 11 // Assuming 11 is today as it's highlighted in the image

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <CalendarIcon className="w-5 h-5 text-[#ff4d4d] mr-2" />
        <h2 className="text-lg font-semibold">March 2025</h2>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="text-xs text-gray-400">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center text-sm
              ${day === null ? "invisible" : ""}
              ${isToday(day as number) ? "bg-[#ff4d4d] rounded-full" : ""}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

