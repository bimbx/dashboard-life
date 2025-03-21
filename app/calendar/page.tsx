"use client"

import React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week">("week")

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const timeSlots = ["All day", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"]

  const getWeekDates = () => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const weekDates = getWeekDates()

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatMonthRange = () => {
    const firstDate = weekDates[0]
    const lastDate = weekDates[6]

    if (firstDate.getMonth() === lastDate.getMonth()) {
      return `${firstDate.toLocaleString("default", { month: "short" })} ${firstDate.getDate()} - ${lastDate.getDate()}`
    } else {
      return `${firstDate.toLocaleString("default", { month: "short" })} ${firstDate.getDate()} - ${lastDate.toLocaleString("default", { month: "short" })} ${lastDate.getDate()}`
    }
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>

        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${view === "day" ? "bg-[#6c5ce7] text-white" : "bg-[#2a2a2a] text-gray-300"}`}
            onClick={() => setView("day")}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 rounded-md ${view === "week" ? "bg-[#6c5ce7] text-white" : "bg-[#2a2a2a] text-gray-300"}`}
            onClick={() => setView("week")}
          >
            Week
          </button>
        </div>
      </div>

      <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded-md hover:bg-[#333]" onClick={goToPreviousWeek}>
              <ChevronLeft size={20} />
            </button>
            <button className="px-3 py-1 rounded-md hover:bg-[#333]" onClick={goToToday}>
              Today
            </button>
            <button className="p-1 rounded-md hover:bg-[#333]" onClick={goToNextWeek}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-lg font-medium">{formatMonthRange()}</div>
        </div>

        <div className="grid grid-cols-8 border-b border-[#333]">
          <div className="p-2"></div>
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`p-2 text-center ${isToday(date) ? "bg-[#ff4d4d] text-white rounded-t-md" : ""}`}
            >
              <div>{daysOfWeek[index]}</div>
              <div className="text-lg font-medium">{date.getDate()}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8">
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div className="p-2 text-sm text-gray-400 border-r border-[#333]">{time}</div>
              {weekDates.map((date, dateIndex) => (
                <div key={`${timeIndex}-${dateIndex}`} className="p-2 border-b border-r border-[#333] min-h-[60px]">
                  {/* Event would go here */}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

