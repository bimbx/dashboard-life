"use client"

import MoodTracker from "@/components/mood-tracker"
import { Smile } from "lucide-react"

export default function MoodPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Smile className="w-6 h-6 text-[#6c5ce7] mr-2" />
        <h1 className="text-2xl font-bold">Mood Tracker</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MoodTracker />

        <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Mood Insights</h2>

          <div className="text-center py-8">
            <Smile size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Not enough data</p>
            <p className="text-sm text-gray-500">Log your mood daily to see insights</p>
          </div>
        </div>
      </div>
    </div>
  )
}

