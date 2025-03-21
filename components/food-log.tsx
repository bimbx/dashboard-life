"use client"

import { useState } from "react"
import { Camera, Plus, Utensils } from "lucide-react"

interface FoodEntry {
  id: string
  name: string
  time: string
  type: "meal" | "snack" | "drink" | "other"
  healthRating: "unhealthy" | "kinda-healthy" | "healthy" | "super-healthy"
  reason: string[]
  portion: "S" | "M" | "L" | "XL" | "XXL"
}

export default function FoodLog() {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<FoodEntry>>({
    name: "",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type: "meal",
    healthRating: "healthy",
    reason: [],
    portion: "M",
  })

  const addEntry = () => {
    if (!newEntry.name?.trim()) return

    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: newEntry.name || "",
      time: newEntry.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: newEntry.type || "meal",
      healthRating: newEntry.healthRating || "healthy",
      reason: newEntry.reason || [],
      portion: newEntry.portion || "M",
    }

    setEntries([entry, ...entries])
    setNewEntry({
      name: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "meal",
      healthRating: "healthy",
      reason: [],
      portion: "M",
    })
    setShowForm(false)
  }

  const toggleReason = (reason: string) => {
    if (!newEntry.reason) {
      setNewEntry({ ...newEntry, reason: [reason] })
      return
    }

    if (newEntry.reason.includes(reason)) {
      setNewEntry({
        ...newEntry,
        reason: newEntry.reason.filter((r) => r !== reason),
      })
    } else {
      setNewEntry({
        ...newEntry,
        reason: [...newEntry.reason, reason],
      })
    }
  }

  const getHealthIcon = (rating: FoodEntry["healthRating"]) => {
    switch (rating) {
      case "unhealthy":
        return "🍔"
      case "kinda-healthy":
        return "🥪"
      case "healthy":
        return "🥗"
      case "super-healthy":
        return "🥦"
      default:
        return "🍽️"
    }
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Utensils className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Food Log</h2>
        </div>
        <button className="p-2 rounded-full bg-[#6c5ce7] text-white" onClick={() => setShowForm(true)}>
          <Plus size={20} />
        </button>
      </div>

      {showForm ? (
        <div className="mb-6 bg-[#2a2a2a] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add food entry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">What did you eat?</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                placeholder="e.g., Salad, Burger, Coffee..."
                value={newEntry.name || ""}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">When did you eat?</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newEntry.time || ""}
                onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <div className="flex space-x-2">
                {(["meal", "snack", "drink", "other"] as const).map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-2 rounded-md ${newEntry.type === type ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"}`}
                    onClick={() => setNewEntry({ ...newEntry, type })}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">How healthy was this meal?</label>
              <div className="flex space-x-2">
                {(["unhealthy", "kinda-healthy", "healthy", "super-healthy"] as const).map((rating) => (
                  <button
                    key={rating}
                    className={`px-3 py-2 rounded-md ${newEntry.healthRating === rating ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"}`}
                    onClick={() => setNewEntry({ ...newEntry, healthRating: rating })}
                  >
                    {getHealthIcon(rating)}{" "}
                    {rating
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Why did you eat?</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hungry",
                  "Social",
                  "It was time",
                  "Bored",
                  "Stressed",
                  "Cravings",
                  "Tired",
                  "The taste",
                  "Why not?",
                ].map((reason) => (
                  <button
                    key={reason}
                    className={`px-3 py-2 rounded-md ${newEntry.reason?.includes(reason) ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"}`}
                    onClick={() => toggleReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Portion size</label>
              <div className="flex space-x-2">
                {(["S", "M", "L", "XL", "XXL"] as const).map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-2 rounded-md ${newEntry.portion === size ? "bg-[#6c5ce7] text-white" : "bg-[#333] text-gray-300"}`}
                    onClick={() => setNewEntry({ ...newEntry, portion: size })}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Image (optional)</label>
              <button className="w-full bg-[#333] text-white rounded-md px-3 py-6 flex flex-col items-center justify-center">
                <Camera size={24} className="mb-2" />
                <span>Choose File</span>
              </button>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button className="px-4 py-2 rounded-md bg-[#333] text-white" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={addEntry}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Utensils size={40} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No food logs</p>
              <p className="text-sm text-gray-500">Add a food log to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="p-3 rounded-lg bg-[#2a2a2a]">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-sm text-gray-400">{entry.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">{getHealthIcon(entry.healthRating)}</span>
                    <span className="mr-2">{entry.type}</span>
                    <span>{entry.portion}</span>
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

