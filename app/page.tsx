"use client"

import { useState } from "react"
import DailyCheckIn from "@/components/daily-check-in"
import TaskManagement from "@/components/task-management"
import HabitTracker from "@/components/habit-tracker"
import FoodLog from "@/components/food-log"
import HydrationTracker from "@/components/hydration-tracker"
import PomodoroTimer from "@/components/pomodoro-timer"
import MoodTracker from "@/components/mood-tracker"
import Goals from "@/components/goals"
import Countdowns from "@/components/countdowns"
import FastingTracker from "@/components/fasting-tracker"
import Routines from "@/components/routines"

export default function Dashboard() {
  const [showCheckIn, setShowCheckIn] = useState(true)

  const handleCheckInComplete = () => {
    setShowCheckIn(false)
    // You could save the check-in data to localStorage or a database here
  }

  return (
    <div>
      {showCheckIn && <DailyCheckIn onComplete={handleCheckInComplete} />}

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PomodoroTimer />
        <MoodTracker />
        <HydrationTracker />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TaskManagement />
        <HabitTracker />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FoodLog />
        <Goals />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Countdowns />
        <FastingTracker />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Routines />
      </div>
    </div>
  )
}

