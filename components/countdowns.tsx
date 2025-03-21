"use client"

import { useState } from "react"
import { Clock, Plus, X, Calendar, Check } from "lucide-react"

interface Countdown {
  id: string
  title: string
  date: string
  showUntilMarked: boolean
  completed: boolean
}

export default function Countdowns() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([
    {
      id: "1",
      title: "Product Launch",
      date: "2025-04-15",
      showUntilMarked: true,
      completed: false,
    },
    {
      id: "2",
      title: "Vacation",
      date: "2025-06-10",
      showUntilMarked: false,
      completed: false,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [newCountdown, setNewCountdown] = useState<Partial<Countdown>>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    showUntilMarked: false,
  })

  const addCountdown = () => {
    if (!newCountdown.title?.trim() || !newCountdown.date) return

    const countdown: Countdown = {
      id: Date.now().toString(),
      title: newCountdown.title,
      date: newCountdown.date,
      showUntilMarked: newCountdown.showUntilMarked || false,
      completed: false,
    }

    setCountdowns([...countdowns, countdown])
    setNewCountdown({
      title: "",
      date: new Date().toISOString().split("T")[0],
      showUntilMarked: false,
    })
    setShowForm(false)
  }

  const toggleCountdownCompletion = (id: string) => {
    setCountdowns(
      countdowns.map((countdown) =>
        countdown.id === id ? { ...countdown, completed: !countdown.completed } : countdown,
      ),
    )
  }

  const calculateDaysLeft = (dateString: string) => {
    const targetDate = new Date(dateString)
    const today = new Date()

    // Reset time to compare just the dates
    today.setHours(0, 0, 0, 0)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Countdowns</h2>
        </div>
        <button className="p-2 rounded-full bg-[#6c5ce7] text-white" onClick={() => setShowForm(true)}>
          <Plus size={20} />
        </button>
      </div>

      {showForm ? (
        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add new countdown</h3>
            <button className="p-1 text-gray-400 hover:text-white" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                placeholder="What are you counting down to?"
                value={newCountdown.title || ""}
                onChange={(e) => setNewCountdown({ ...newCountdown, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                  value={newCountdown.date || ""}
                  onChange={(e) => setNewCountdown({ ...newCountdown, date: e.target.value })}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-until-marked"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#6c5ce7] focus:ring-[#6c5ce7]"
                checked={newCountdown.showUntilMarked || false}
                onChange={(e) => setNewCountdown({ ...newCountdown, showUntilMarked: e.target.checked })}
              />
              <label htmlFor="show-until-marked" className="text-sm text-gray-300">
                Show until marked as done
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={addCountdown}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {countdowns.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={40} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No countdowns yet</p>
            <p className="text-sm text-gray-500">Add your first countdown to get started</p>
          </div>
        ) : (
          countdowns.map((countdown) => {
            const daysLeft = calculateDaysLeft(countdown.date)
            const isPast = daysLeft < 0

            return (
              <div
                key={countdown.id}
                className={`p-4 rounded-lg ${isPast ? "bg-[#3a2a2a]" : "bg-[#2a2a2a]"} flex items-center`}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{countdown.title}</span>
                    <button
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${countdown.completed ? "bg-[#6c5ce7]" : "border border-gray-500"}`}
                      onClick={() => toggleCountdownCompletion(countdown.id)}
                    >
                      {countdown.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(countdown.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="ml-4 text-center">
                  <div className={`text-2xl font-bold ${isPast ? "text-red-500" : "text-[#6c5ce7]"}`}>
                    {isPast ? `${Math.abs(daysLeft)}d` : `${daysLeft}d`}
                  </div>
                  <div className="text-xs text-gray-400">{isPast ? "overdue" : "remaining"}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

