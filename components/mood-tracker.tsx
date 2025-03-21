"use client"

import { useState } from "react"
import { Smile, Frown, Meh } from "lucide-react"

type MoodType = "awful" | "bad" | "neutral" | "good" | "great"

interface MoodEntry {
  id: string
  mood: MoodType
  time: string
  note?: string
}

export default function MoodTracker() {
  const [showForm, setShowForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState("")
  const [entries, setEntries] = useState<MoodEntry[]>([])

  const saveMood = () => {
    if (!selectedMood) return

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      note: note || undefined,
    }

    setEntries([newEntry, ...entries])
    setShowForm(false)
    setSelectedMood(null)
    setNote("")
  }

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case "awful":
        return <Frown className="w-6 h-6 text-red-500" />
      case "bad":
        return <Frown className="w-6 h-6 text-orange-500" />
      case "neutral":
        return <Meh className="w-6 h-6 text-yellow-500" />
      case "good":
        return <Smile className="w-6 h-6 text-green-500" />
      case "great":
        return <Smile className="w-6 h-6 text-emerald-500" />
    }
  }

  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case "awful":
        return "bg-red-500"
      case "bad":
        return "bg-orange-500"
      case "neutral":
        return "bg-yellow-500"
      case "good":
        return "bg-green-500"
      case "great":
        return "bg-emerald-500"
    }
  }

  const getLatestMood = () => {
    return entries.length > 0 ? entries[0].mood : null
  }

  const latestMood = getLatestMood()

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Smile className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Mood</h2>
        </div>
        <button className="px-3 py-1 rounded-md bg-[#6c5ce7] text-white text-sm" onClick={() => setShowForm(true)}>
          Log mood
        </button>
      </div>

      {showForm ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-3">How are you feeling?</label>
            <div className="flex justify-between">
              {(["awful", "bad", "neutral", "good", "great"] as const).map((mood) => (
                <button
                  key={mood}
                  className={`flex flex-col items-center p-2 rounded-md ${selectedMood === mood ? "bg-[#333] ring-2 ring-[#6c5ce7]" : "hover:bg-[#2a2a2a]"}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1">
                    {getMoodIcon(mood)}
                  </div>
                  <span className="text-xs capitalize">{mood}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Note (optional)</label>
            <textarea
              className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7] resize-none h-20"
              placeholder="How are you feeling today?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button className="px-3 py-1 rounded-md bg-[#333] text-white" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded-md bg-[#6c5ce7] text-white"
              onClick={saveMood}
              disabled={!selectedMood}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Smile size={40} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No mood logs yet</p>
              <p className="text-sm text-gray-500">How are you feeling today?</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full border-8 border-[#333]"></div>
                <div
                  className={`absolute top-0 left-0 w-full h-full rounded-full border-8 ${latestMood ? getMoodColor(latestMood) : "border-[#333]"}`}
                  style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)" }}
                ></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xl font-bold">{latestMood ? latestMood : "N/A"}</div>
                  <div className="text-xs text-gray-400">{entries.length > 0 ? entries[0].time : ""}</div>
                </div>
              </div>

              <div className="w-full space-y-3 max-h-[200px] overflow-y-auto">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg bg-[#2a2a2a] flex items-center">
                    <div className="mr-3">{getMoodIcon(entry.mood)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{entry.mood}</span>
                        <span className="text-sm text-gray-400">{entry.time}</span>
                      </div>
                      {entry.note && <p className="text-sm text-gray-400">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

