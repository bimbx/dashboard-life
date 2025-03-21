"use client"

import { useState } from "react"
import { Target, Plus, Calendar, X, Check } from "lucide-react"

interface Goal {
  id: string
  name: string
  dueDate?: string
  isPublic: boolean
  completed: boolean
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", name: "Complete project proposal", dueDate: "2025-03-25", isPublic: false, completed: false },
    { id: "2", name: "Read 10 pages of book", dueDate: undefined, isPublic: true, completed: true },
    { id: "3", name: "Exercise 3 times this week", dueDate: "2025-03-24", isPublic: false, completed: false },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    name: "",
    dueDate: undefined,
    isPublic: false,
    completed: false,
  })

  const addGoal = () => {
    if (!newGoal.name?.trim()) return

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      dueDate: newGoal.dueDate,
      isPublic: newGoal.isPublic || false,
      completed: false,
    }

    setGoals([...goals, goal])
    setNewGoal({
      name: "",
      dueDate: undefined,
      isPublic: false,
      completed: false,
    })
    setShowForm(false)
  }

  const toggleGoalCompletion = (id: string) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)))
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">My Goals</h2>
        </div>
        <button className="p-2 rounded-full bg-[#6c5ce7] text-white" onClick={() => setShowForm(true)}>
          <Plus size={20} />
        </button>
      </div>

      {showForm ? (
        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add new goal</h3>
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
                placeholder="What do you want to achieve?"
                value={newGoal.name || ""}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Due date (optional)</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                  value={newGoal.dueDate || ""}
                  onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="public-goal"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#6c5ce7] focus:ring-[#6c5ce7]"
                checked={newGoal.isPublic || false}
                onChange={(e) => setNewGoal({ ...newGoal, isPublic: e.target.checked })}
              />
              <label htmlFor="public-goal" className="text-sm text-gray-300">
                Public
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={addGoal}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No goals yet</p>
            <p className="text-sm text-gray-500">Add your first goal to get started</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="p-3 rounded-lg bg-[#2a2a2a] flex items-start">
              <button
                className={`mt-1 mr-3 w-5 h-5 rounded-full flex items-center justify-center ${goal.completed ? "bg-[#6c5ce7]" : "border border-gray-500"}`}
                onClick={() => toggleGoalCompletion(goal.id)}
              >
                {goal.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className={`font-medium ${goal.completed ? "line-through text-gray-500" : ""}`}>
                    {goal.name}
                  </span>
                  {goal.isPublic && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#333] text-gray-400">Public</span>
                  )}
                </div>
                {goal.dueDate && (
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Due {new Date(goal.dueDate).toLocaleDateString()}</span>
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

