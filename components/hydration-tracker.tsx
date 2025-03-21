"use client"

import { useState } from "react"
import { Droplet, Plus, X } from "lucide-react"

type DrinkType = "water" | "coffee" | "tea" | "other"

interface HydrationEntry {
  id: string
  amount: number
  type: DrinkType
  time: string
  note?: string
  countsTowardsGoal: boolean
}

export default function HydrationTracker() {
  const [goal, setGoal] = useState(2000) // ml
  const [current, setCurrent] = useState(0) // ml
  const [showAddForm, setShowAddForm] = useState(false)
  const [amount, setAmount] = useState(250) // ml
  const [drinkType, setDrinkType] = useState<DrinkType>("water")
  const [note, setNote] = useState("")
  const [countsTowardsGoal, setCountsTowardsGoal] = useState(true)
  const [entries, setEntries] = useState<HydrationEntry[]>([])

  const addWater = () => {
    const newEntry: HydrationEntry = {
      id: Date.now().toString(),
      amount,
      type: drinkType,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      note: note || undefined,
      countsTowardsGoal,
    }

    setEntries([newEntry, ...entries])

    if (countsTowardsGoal) {
      setCurrent(Math.min(current + amount, goal))
    }

    setShowAddForm(false)
    setAmount(250)
    setDrinkType("water")
    setNote("")
    setCountsTowardsGoal(true)
  }

  const percentage = Math.round((current / goal) * 100)

  const getDrinkIcon = (type: DrinkType) => {
    switch (type) {
      case "water":
        return "💧"
      case "coffee":
        return "☕"
      case "tea":
        return "🍵"
      case "other":
        return "🥤"
    }
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Droplet className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Hydration</h2>
        </div>
        <button className="p-2 rounded-full bg-[#6c5ce7] text-white" onClick={() => setShowAddForm(true)}>
          <Plus size={20} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{current} ml</span>
          <span>{goal} ml</span>
        </div>
        <div className="h-4 bg-[#333] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6c5ce7] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">{percentage}% of daily goal</div>
      </div>

      {showAddForm ? (
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add hydration</h3>
            <button className="p-1 text-gray-400 hover:text-white" onClick={() => setShowAddForm(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount (ml)</label>
              <input
                type="number"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(["water", "coffee", "tea", "other"] as const).map((type) => (
                  <button
                    key={type}
                    className={`flex flex-col items-center p-3 rounded-md ${drinkType === type ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"}`}
                    onClick={() => setDrinkType(type)}
                  >
                    <span className="text-xl mb-1">{getDrinkIcon(type)}</span>
                    <span className="text-xs capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Note (optional)</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                placeholder="e.g., i.e what did you drink"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="counts-towards-goal"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#6c5ce7] focus:ring-[#6c5ce7]"
                checked={countsTowardsGoal}
                onChange={(e) => setCountsTowardsGoal(e.target.checked)}
              />
              <label htmlFor="counts-towards-goal" className="text-sm text-gray-300">
                Counts towards goal
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={addWater}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Droplet size={40} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No hydration logs</p>
              <p className="text-sm text-gray-500">Add a hydration log to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="p-3 rounded-lg bg-[#2a2a2a] flex items-center">
                  <div className="text-2xl mr-3">{getDrinkIcon(entry.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{entry.amount} ml</span>
                      <span className="text-sm text-gray-400">{entry.time}</span>
                    </div>
                    {entry.note && <p className="text-sm text-gray-400">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

