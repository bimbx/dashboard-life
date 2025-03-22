"use client"
<<<<<<< HEAD
import { CalendarIcon } from "lucide-react"
=======
import { useState, useEffect, useCallback, useMemo } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
>>>>>>> a251471 (Second try nextauth.js)

interface CalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export default function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
<<<<<<< HEAD
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
=======
  // Use current date instead of hardcoded date
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Initialize with the month of the selected date, or today if not provided
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    }
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  // Ensure selectedDate is valid
  useEffect(() => {
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      // Use a functional update to avoid stale closures
      onSelectDate(new Date())
    }
  }, [selectedDate, onSelectDate])

  // Update current month when selected date changes to a different month
  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      const selectedMonth = selectedDate.getMonth()
      const selectedYear = selectedDate.getFullYear()
      const currentMonthValue = currentMonth.getMonth()
      const currentYearValue = currentMonth.getFullYear()

      if (selectedMonth !== currentMonthValue || selectedYear !== currentYearValue) {
        setCurrentMonth(new Date(selectedYear, selectedMonth, 1))
      }
    }
  }, [selectedDate, currentMonth])

  // Get month and year for display
  const monthYear = useMemo(() => {
    return currentMonth.toLocaleDateString("default", { month: "long", year: "numeric" })
  }, [currentMonth])

  // Calculate calendar data for current month
  const { daysInMonth, firstDayOfMonth, calendarDays } = useMemo(() => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

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

    return { daysInMonth, firstDayOfMonth, calendarDays }
  }, [currentMonth])

  const isToday = useCallback(
    (day: number | null): boolean => {
      if (day === null) return false
      const today = new Date()
      return (
        day === today.getDate() &&
        currentMonth.getMonth() === today.getMonth() &&
        currentMonth.getFullYear() === today.getFullYear()
      )
    },
    [currentMonth],
  )

  const isSelected = useCallback(
    (day: number | null): boolean => {
      if (day === null || !selectedDate || isNaN(selectedDate.getTime())) return false

      return (
        day === selectedDate.getDate() &&
        currentMonth.getMonth() === selectedDate.getMonth() &&
        currentMonth.getFullYear() === selectedDate.getFullYear()
      )
    },
    [currentMonth, selectedDate],
  )

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      const year = prevMonth.getMonth() === 0 ? prevMonth.getFullYear() - 1 : prevMonth.getFullYear()
      const month = prevMonth.getMonth() === 0 ? 11 : prevMonth.getMonth() - 1
      return new Date(year, month, 1)
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prevMonth) => {
      const year = prevMonth.getMonth() === 11 ? prevMonth.getFullYear() + 1 : prevMonth.getFullYear()
      const month = prevMonth.getMonth() === 11 ? 0 : prevMonth.getMonth() + 1
      return new Date(year, month, 1)
    })
  }, [])

  const goToCurrentMonth = useCallback(() => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    onSelectDate(today)
  }, [onSelectDate])

  const handleDateSelect = useCallback(
    (day: number | null) => {
      if (day === null) return
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      onSelectDate(newDate)
    },
    [currentMonth, onSelectDate],
  )

  const weekDays = useMemo(() => ["S", "M", "T", "W", "T", "F", "S"], [])

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#ff4d4d] mr-2" />
          <h2 className="text-lg font-semibold">{monthYear}</h2>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-[#2a2a2a]"
            aria-label="Previous month"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToCurrentMonth}
            className="p-1 px-2 text-xs rounded-md hover:bg-[#2a2a2a]"
            aria-label="Go to current month"
            type="button"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-[#2a2a2a]"
            aria-label="Next month"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-xs text-gray-400">
>>>>>>> a251471 (Second try nextauth.js)
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
<<<<<<< HEAD
            key={index}
            className={`
              aspect-square flex items-center justify-center text-sm
              ${day === null ? "invisible" : ""}
              ${isToday(day as number) ? "bg-[#ff4d4d] rounded-full" : ""}
            `}
=======
            key={`day-${index}`}
            role={day !== null ? "button" : "presentation"}
            tabIndex={day !== null ? 0 : -1}
            aria-label={day !== null ? `${day} ${monthYear}` : undefined}
            aria-selected={day !== null ? isSelected(day) : undefined}
            className={`
              aspect-square flex items-center justify-center text-sm
              ${day === null ? "invisible" : "cursor-pointer"}
              ${isToday(day) ? "bg-[#ff4d4d] rounded-full" : ""}
              ${isSelected(day) && !isToday(day) ? "border border-[#ff4d4d] rounded-full" : ""}
              ${day !== null && !isToday(day) && !isSelected(day) ? "hover:bg-[#2a2a2a] rounded-full" : ""}
              ${day !== null ? "focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] focus:ring-opacity-50 rounded-full" : ""}
            `}
            onClick={() => day !== null && handleDateSelect(day)}
            onKeyDown={(e) => {
              if (day !== null && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault()
                handleDateSelect(day)
              }
            }}
>>>>>>> a251471 (Second try nextauth.js)
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

