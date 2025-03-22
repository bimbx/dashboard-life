"use client"

<<<<<<< HEAD
import { useState, useEffect, useRef } from "react"
import { Timer, Play, Pause, Settings, X, Plus, Check } from "lucide-react"

interface PomodoroSettings {
  pomodoroMinutes: number
  breakMinutes: number
  dailyGoal: number
  ambientSound: boolean
  giveFeedback: boolean
}

interface PomodoroTodo {
  id: string
  text: string
  completed: boolean
}

export default function PomodoroTimer() {
  const [status, setStatus] = useState<"ready" | "active" | "paused" | "done">("ready")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<PomodoroSettings>({
    pomodoroMinutes: 25,
    breakMinutes: 5,
    dailyGoal: 8,
    ambientSound: true,
    giveFeedback: true,
  })
  const [todos, setTodos] = useState<PomodoroTodo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [notes, setNotes] = useState("")

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
  }, [])

  const startTimer = () => {
=======
import { useState, useEffect, useRef, useCallback } from "react"
import { Timer, Play, Pause, RotateCcw } from "lucide-react"
import { useSession } from "next-auth/react"

export default function PomodoroTimer() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<"ready" | "active" | "paused" | "done">("ready")
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(8)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load user's pomodoro data
  useEffect(() => {
    if (!session?.user?.id) return

    // Initialize audio
    audioRef.current = new Audio("/notification.mp3")

    // Load completed pomodoros from localStorage
    try {
      const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
      const key = `pomodoros-${session.user.id}-${today}`

      const savedCompletedPomodoros = localStorage.getItem(key)
      if (savedCompletedPomodoros) {
        setCompletedPomodoros(Number(savedCompletedPomodoros))
      }

      const savedDailyGoal = localStorage.getItem(`dailyGoal-${session.user.id}`)
      if (savedDailyGoal) {
        setDailyGoal(Number(savedDailyGoal))
      }
    } catch (error) {
      console.error("Error loading pomodoro data:", error)
      setError("Failed to load pomodoro data")
    }

    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session?.user?.id])

  const startTimer = useCallback(() => {
>>>>>>> a251471 (Second try nextauth.js)
    if (status === "paused") {
      setStatus("active")
    } else if (status === "ready" || status === "done") {
      setStatus("active")
<<<<<<< HEAD
      setTimeLeft(settings.pomodoroMinutes * 60)
    }
  }

  const pauseTimer = () => {
    if (status === "active") {
      setStatus("paused")
    }
  }

  const resetTimer = () => {
    setStatus("ready")
    setTimeLeft(settings.pomodoroMinutes * 60)
  }

  const cancelPomodoro = () => {
    resetTimer()
    setNotes("")
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (status === "active" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && status === "active") {
      setStatus("done")
      setCompletedPomodoros((prev) => prev + 1)

      // Play notification sound
      if (settings.ambientSound && audioRef.current) {
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
    }

    return () => clearInterval(interval)
  }, [status, timeLeft, settings.ambientSound])
=======
      setTimeLeft(25 * 60)
    }
  }, [status])

  const pauseTimer = useCallback(() => {
    if (status === "active") {
      setStatus("paused")
    }
  }, [status])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setStatus("ready")
    setTimeLeft(25 * 60)
  }, [])

  // Handle timer countdown
  useEffect(() => {
    if (status === "active") {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Set up new interval
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer complete
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }

            // Play notification sound
            if (audioRef.current) {
              audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
            }

            // Update completed pomodoros
            const newCount = completedPomodoros + 1
            setCompletedPomodoros(newCount)

            // Save to localStorage
            if (session?.user?.id) {
              const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
              const key = `pomodoros-${session.user.id}-${today}`
              localStorage.setItem(key, String(newCount))

              // Update pomodoro activity data
              try {
                const pomodoroDataKey = `pomodoroData-${session.user.id}`
                const storedData = localStorage.getItem(pomodoroDataKey)

                if (storedData) {
                  const data = JSON.parse(storedData)
                  const currentDate = new Date()
                  const monthKey = currentDate.toLocaleDateString("default", { month: "short" })
                  const dayKey = currentDate.getDate().toString()

                  if (!data[monthKey]) {
                    data[monthKey] = {}
                  }

                  data[monthKey][dayKey] = (data[monthKey][dayKey] || 0) + 1
                  localStorage.setItem(pomodoroDataKey, JSON.stringify(data))
                }
              } catch (error) {
                console.error("Error updating pomodoro activity data:", error)
              }
            }

            setStatus("done")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (status !== "active" && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Clean up on unmount or status change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [status, completedPomodoros, session?.user?.id])
>>>>>>> a251471 (Second try nextauth.js)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

<<<<<<< HEAD
  const addTodo = () => {
    if (!newTodo.trim()) return

    const todo: PomodoroTodo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, todo])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const saveSettings = () => {
    setShowSettings(false)
    // If timer is ready, update the time left based on new settings
    if (status === "ready") {
      setTimeLeft(settings.pomodoroMinutes * 60)
    }
  }

=======
>>>>>>> a251471 (Second try nextauth.js)
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Timer className="w-5 h-5 text-[#ff4d4d] mr-2" />
          <h2 className="text-lg font-semibold">
<<<<<<< HEAD
            Pomodoro {completedPomodoros}/{settings.dailyGoal}
          </h2>
        </div>
        <button
          className="p-1 rounded-md hover:bg-[#333] text-gray-400 hover:text-white"
          onClick={() => setShowSettings(true)}
          aria-label="Pomodoro Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {showSettings ? (
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pomodoro settings</h3>
            <button className="p-1 text-gray-400 hover:text-white" onClick={() => setShowSettings(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Default pomodoro duration</label>
              <input
                type="number"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff4d4d]"
                value={settings.pomodoroMinutes}
                onChange={(e) => setSettings({ ...settings, pomodoroMinutes: Number(e.target.value) })}
                min={1}
                max={60}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Default break duration</label>
              <input
                type="number"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff4d4d]"
                value={settings.breakMinutes}
                onChange={(e) => setSettings({ ...settings, breakMinutes: Number(e.target.value) })}
                min={1}
                max={30}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily pomodoro goals</label>
              <input
                type="number"
                className="w-full bg-[#333] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff4d4d]"
                value={settings.dailyGoal}
                onChange={(e) => setSettings({ ...settings, dailyGoal: Number(e.target.value) })}
                min={1}
                max={20}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ambient-sound"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#ff4d4d] focus:ring-[#ff4d4d]"
                checked={settings.ambientSound}
                onChange={(e) => setSettings({ ...settings, ambientSound: e.target.checked })}
              />
              <label htmlFor="ambient-sound" className="text-sm text-gray-300">
                Toggle ambient sound when starting or ending a pomodoro
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="give-feedback"
                className="mr-2 h-4 w-4 rounded border-gray-300 text-[#ff4d4d] focus:ring-[#ff4d4d]"
                checked={settings.giveFeedback}
                onChange={(e) => setSettings({ ...settings, giveFeedback: e.target.checked })}
              />
              <label htmlFor="give-feedback" className="text-sm text-gray-300">
                Give feedback about focus and working mode after finishing pomodoro
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 rounded-md bg-[#ff4d4d] text-white" onClick={saveSettings}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : status === "active" || status === "paused" ? (
        <div>
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-[#ff4d4d] flex items-center justify-center mb-4 relative">
              <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
              <div className="absolute -bottom-2 flex space-x-2">
                <button
                  className="w-10 h-10 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white"
                  onClick={status === "active" ? pauseTimer : startTimer}
                >
                  {status === "active" ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            </div>

            <div className="flex space-x-1 mb-2">
              {Array.from({ length: settings.dailyGoal }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index < completedPomodoros ? "bg-[#ff4d4d]" : "bg-gray-600"}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">
                  Todos ({todos.filter((t) => t.completed).length}/{todos.length})
                </h3>
              </div>
              <div className="bg-[#2a2a2a] rounded-md p-2">
                <div className="flex mb-2">
                  <input
                    type="text"
                    className="flex-1 bg-[#333] text-white rounded-l-md px-3 py-1 text-sm focus:outline-none"
                    placeholder="Quick add todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTodo()}
                  />
                  <button
                    className="bg-[#ff4d4d] text-white rounded-r-md px-2 py-1 flex items-center justify-center"
                    onClick={addTodo}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                  {todos.length === 0 ? (
                    <div className="text-center py-2 text-sm text-gray-400">No todos yet</div>
                  ) : (
                    todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center p-2 rounded hover:bg-[#333] cursor-pointer"
                        onClick={() => toggleTodo(todo.id)}
                      >
                        <div className="mr-2">
                          {todo.completed ? (
                            <Check className="w-4 h-4 text-[#ff4d4d]" />
                          ) : (
                            <div className="w-4 h-4 rounded-sm border border-gray-500" />
                          )}
                        </div>
                        <span className={`text-sm ${todo.completed ? "line-through text-gray-500" : ""}`}>
                          {todo.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <textarea
                className="w-full h-[200px] bg-[#2a2a2a] text-white rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff4d4d] resize-none"
                placeholder="Write anything related to this pomodoro here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="px-4 py-2 rounded-md bg-[#333] text-white hover:bg-[#444]" onClick={cancelPomodoro}>
              Cancel pomodoro
            </button>
=======
            Pomodoro {completedPomodoros}/{dailyGoal}
          </h2>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-500">{error}</div>}

      {status === "active" || status === "paused" ? (
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-[#ff4d4d] flex items-center justify-center mb-4 relative">
            <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
            <div className="absolute -bottom-2 flex space-x-2">
              <button
                className="w-10 h-10 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white"
                onClick={status === "active" ? pauseTimer : startTimer}
                aria-label={status === "active" ? "Pause timer" : "Resume timer"}
              >
                {status === "active" ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-white"
                onClick={resetTimer}
                aria-label="Reset timer"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="flex space-x-1 mb-2">
            {Array.from({ length: dailyGoal }).map((_, index) => (
              <div
                key={`goal-${index}`}
                className={`w-2 h-2 rounded-full ${index < completedPomodoros ? "bg-[#ff4d4d]" : "bg-gray-600"}`}
                aria-hidden="true"
              />
            ))}
>>>>>>> a251471 (Second try nextauth.js)
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {completedPomodoros === 0 ? (
            <div className="text-center py-8">
<<<<<<< HEAD
              <Timer size={40} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No pomodoros for this day</p>
              <p className="text-sm text-gray-500">Time to start one!</p>
              <button className="mt-4 px-4 py-2 rounded-md bg-[#ff4d4d] text-white" onClick={startTimer}>
=======
              <Timer size={40} className="mx-auto text-gray-500 mb-4" aria-hidden="true" />
              <p className="text-gray-400">No pomodoros for today</p>
              <p className="text-sm text-gray-500">Time to start one!</p>
              <button
                className="mt-4 px-4 py-2 rounded-md bg-[#ff4d4d] text-white"
                onClick={startTimer}
                aria-label="Start Pomodoro"
              >
>>>>>>> a251471 (Second try nextauth.js)
                Start Pomodoro
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-2xl font-bold text-[#ff4d4d] mb-2">Pomodoro Complete!</div>
              <p className="text-gray-400 mb-4">You've completed {completedPomodoros} pomodoros today</p>
<<<<<<< HEAD
              <button className="px-4 py-2 rounded-md bg-[#ff4d4d] text-white" onClick={startTimer}>
=======
              <button
                className="px-4 py-2 rounded-md bg-[#ff4d4d] text-white"
                onClick={startTimer}
                aria-label="Start Another Pomodoro"
              >
>>>>>>> a251471 (Second try nextauth.js)
                Start Another
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

