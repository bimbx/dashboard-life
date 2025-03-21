"use client"

import { useState } from "react"
import { Plus, RefreshCcw, Settings } from "lucide-react"

interface Habit {
  id: string
  name: string
  completed: boolean
  streak: number
  color: string
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | "any"
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Meditate", completed: false, streak: 5, color: "#6c5ce7", timeOfDay: "morning" },
    { id: "2", name: "Read", completed: true, streak: 12, color: "#00cec9", timeOfDay: "evening" },
    { id: "3", name: "Exercise", completed: false, streak: 3, color: "#ff7675", timeOfDay: "afternoon" },
  ])

  const [showHabitForm, setShowHabitForm] = useState(false)
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitColor, setNewHabitColor] = useState("#6c5ce7")
  const [newHabitTime, setNewHabitTime] = useState<Habit["timeOfDay"]>("any")

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const completed = !habit.completed
          return {
            ...habit,
            completed,
            streak: completed ? habit.streak + 1 : habit.streak,
          }
        }
        return habit
      }),
    )
  }

  const addHabit = () => {
    if (!newHabitName.trim()) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completed: false,
      streak: 0,
      color: newHabitColor,
      timeOfDay: newHabitTime,
    }

    setHabits([...habits, newHabit])
    setNewHabitName("")
    setShowHabitForm(false)
  }

  const getTimeIcon = (time: Habit["timeOfDay"]) => {
    switch (time) {
      case "morning":
        return "🌅"
      case "afternoon":
        return "☀️"
      case "evening":
        return "🌆"
      case "night":
        return "🌙"
      default:
        return "⏱️"
    }
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <RefreshCcw className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Habits</h2>
        </div>
        <button className="p-2 rounded-full bg-[#6c5ce7] text-white" onClick={() => setShowHabitForm(true)}>
          <Plus size={20} />
        </button>
      </div>

      {showHabitForm ? (
        <div className="mb-6 bg-[#2a2a2a] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create a new habit</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Habit name</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                placeholder="e.g., Meditate, Read, Exercise..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Time of day</label>
              <div className="flex space-x-2">
                {(["any", "morning", "afternoon", "evening", "night"] as const).map((time) => (
                  <button
                    key={time}
                    className={`px-3 py-2 rounded-md ${newHabitTime === time ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"}`}
                    onClick={() => setNewHabitTime(time)}
                  >
                    {getTimeIcon(time)} {time.charAt(0).toUpperCase() + time.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Color</label>
              <div className="flex space-x-2">
                {["#6c5ce7", "#00cec9", "#ff7675", "#fdcb6e", "#00b894", "#e84393"].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${newHabitColor === color ? "ring-2 ring-white" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewHabitColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button className="px-4 py-2 rounded-md bg-[#333] text-white" onClick={() => setShowHabitForm(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={addHabit}>
                Create Habit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCcw size={40} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No habits yet</p>
              <p className="text-sm text-gray-500">Create your first habit?</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                <button
                  className={`w-6 h-6 rounded-md mr-4 flex items-center justify-center ${habit.completed ? "bg-[#6c5ce7]" : "border-2 border-gray-500"}`}
                  style={{ backgroundColor: habit.completed ? habit.color : "transparent", borderColor: habit.color }}
                  onClick={() => toggleHabit(habit.id)}
                >
                  {habit.completed && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{habit.name}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#333]">
                      {getTimeIcon(habit.timeOfDay)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{habit.streak} day streak</div>
                </div>

                <button className="p-1 text-gray-400 hover:text-white">
                  <Settings size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

