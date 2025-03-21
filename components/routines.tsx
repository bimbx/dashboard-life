"use client"

import { useState } from "react"
import { Calendar, Plus, X } from "lucide-react"

interface Routine {
  id: string
  name: string
  timeOfDay?: string
  daysOfWeek: string[]
  completed: boolean
}

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: "1",
      name: "Morning Routine",
      timeOfDay: "Morning",
      daysOfWeek: ["M", "T", "W", "T", "F"],
      completed: false,
    },
    {
      id: "2",
      name: "Evening Workout",
      timeOfDay: "Evening",
      daysOfWeek: ["M", "W", "F"],
      completed: true,
    },
    {
      id: "3",
      name: "Weekend Planning",
      timeOfDay: "Morning",
      daysOfWeek: ["S"],
      completed: false,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newRoutine, setNewRoutine] = useState<Partial<Routine>>({
    name: "",
    timeOfDay: "",
    daysOfWeek: [],
  })

  const addRoutine = () => {
    if (!newRoutine.name?.trim()) return

    const routine: Routine = {
      id: Date.now().toString(),
      name: newRoutine.name,
      timeOfDay: newRoutine.timeOfDay,
      daysOfWeek: newRoutine.daysOfWeek || [],
      completed: false,
    }

    setRoutines([...routines, routine])
    setNewRoutine({
      name: "",
      timeOfDay: "",
      daysOfWeek: [],
    })
    setShowForm(false)
  }

  const toggleDay = (day: string) => {
    if (!newRoutine.daysOfWeek) {
      setNewRoutine({ ...newRoutine, daysOfWeek: [day] })
      return
    }

    if (newRoutine.daysOfWeek.includes(day)) {
      setNewRoutine({
        ...newRoutine,
        daysOfWeek: newRoutine.daysOfWeek.filter((d) => d !== day),
      })
    } else {
      setNewRoutine({
        ...newRoutine,
        daysOfWeek: [...newRoutine.daysOfWeek, day],
      })
    }
  }

  const toggleRoutineCompletion = (id: string) => {
    setRoutines(
      routines.map((routine) => (routine.id === id ? { ...routine, completed: !routine.completed } : routine)),
    )
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">My routines</h2>
        </div>
        <button className="p-2 rounded-full bg-[#6c5ce7] text-white" onClick={() => setShowForm(true)}>
          <Plus size={20} />
        </button>
      </div>

      {showForm ? (
        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add new routine</h3>
            <button className="p-1 text-gray-400 hover:text-white" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                placeholder="e.g., Morning Routine, Evening Workout..."
                value={newRoutine.name || ""}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Time of day (optional)</label>
              <select
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newRoutine.timeOfDay || ""}
                onChange={(e) => setNewRoutine({ ...newRoutine, timeOfDay: e.target.value })}
              >
                <option value="">Select time of day</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Days of week (optional)</label>
              <div className="flex flex-wrap gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      newRoutine.daysOfWeek?.includes(day) ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"
                    }`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={addRoutine}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {routines.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No routines yet</p>
            <p className="text-sm text-gray-500">Add your first routine to get started</p>
          </div>
        ) : (
          routines.map((routine) => (
            <div
              key={routine.id}
              className="p-3 rounded-lg bg-[#2a2a2a] flex items-start"
              onClick={() => toggleRoutineCompletion(routine.id)}
            >
              <div
                className={`mt-1 mr-3 w-5 h-5 rounded-full flex items-center justify-center ${routine.completed ? "bg-[#6c5ce7]" : "border border-gray-500"}`}
              >
                {routine.completed && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className={`font-medium ${routine.completed ? "line-through text-gray-500" : ""}`}>
                    {routine.name}
                  </span>
                  {routine.timeOfDay && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#333] text-gray-400">
                      {routine.timeOfDay}
                    </span>
                  )}
                </div>
                {routine.daysOfWeek.length > 0 && (
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span className="mr-1">Days:</span>
                    <div className="flex space-x-1">
                      {routine.daysOfWeek.map((day, index) => (
                        <span key={index} className="w-4 h-4 rounded-full bg-[#333] flex items-center justify-center">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

