"use client"
import PomodoroTimer from "@/components/pomodoro-timer"
import { Timer } from "lucide-react"

export default function PomodoroPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Timer className="w-6 h-6 text-[#ff4d4d] mr-2" />
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PomodoroTimer />

        <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Today's Pomodoros</h2>

          <div className="text-center py-8">
            <Timer size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No pomodoros for this day</p>
            <p className="text-sm text-gray-500">Time to start one!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

