"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, CheckCircle, Clock, Frown, Meh, Moon, Smile } from "lucide-react"
import Image from "next/image"

interface CheckInStep {
  id: number
  title: string
  icon: React.ReactNode
}

export default function DailyCheckIn({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isVisible, setIsVisible] = useState(true)
  const [sleep, setSleep] = useState<"bad" | "okay" | "good" | null>(null)
  const [mood, setMood] = useState<"awful" | "bad" | "meh" | "good" | "rad" | null>(null)
  const [newTodo, setNewTodo] = useState("")
  const [todos, setTodos] = useState<string[]>([
    "ver video de api",
    "crear video para harpagan",
    "Terminar CM",
    "crear tasks para el va",
  ])

  const steps: CheckInStep[] = [
    { id: 1, title: "Check in", icon: <CheckCircle className="w-5 h-5" /> },
    { id: 2, title: "Sleep & Mood", icon: <Moon className="w-5 h-5" /> },
    { id: 3, title: "Schedule", icon: <Calendar className="w-5 h-5" /> },
    { id: 4, title: "Todos", icon: <CheckCircle className="w-5 h-5" /> },
    { id: 5, title: "Let's go", icon: <Clock className="w-5 h-5" /> },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsVisible(false)
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo])
      setNewTodo("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl w-full max-w-xl p-6 shadow-lg">
        <div className="text-xl font-bold mb-6">Daily check in</div>

        {/* Steps indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                  ${
                    currentStep === step.id
                      ? "bg-[#6c5ce7] text-white"
                      : currentStep > step.id
                        ? "bg-[#6c5ce7]/50 text-white"
                        : "bg-[#333] text-gray-400"
                  }`}
              >
                {step.id}
              </div>
              <div className="text-xs text-gray-400">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[200px] mb-6">
          {currentStep === 1 && (
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Image src="/placeholder.svg?height=80&width=80" alt="Owl" width={80} height={80} />
              </div>
              <div className="text-xl font-bold mb-2">
                Daily check in @ {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-gray-400 mb-6">Night owl, huh? Let's get to it.</div>

              <div className="text-center">
                <div className="text-gray-400 mb-2">Your position is</div>
                <div className="text-2xl font-bold text-[#f1c40f]">#3</div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <div className="text-lg font-medium mb-4">How did you sleep?</div>
                <div className="flex justify-center space-x-6">
                  <button
                    className={`flex flex-col items-center p-3 rounded-md ${sleep === "bad" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setSleep("bad")}
                  >
                    <Frown className="w-8 h-8 mb-2" />
                    <span>Bad</span>
                  </button>
                  <button
                    className={`flex flex-col items-center p-3 rounded-md ${sleep === "okay" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setSleep("okay")}
                  >
                    <Meh className="w-8 h-8 mb-2" />
                    <span>Okay</span>
                  </button>
                  <button
                    className={`flex flex-col items-center p-3 rounded-md ${sleep === "good" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setSleep("good")}
                  >
                    <Smile className="w-8 h-8 mb-2" />
                    <span>Good</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="text-lg font-medium mb-4">How do you feel?</div>
                <div className="flex justify-center space-x-4">
                  <button
                    className={`flex flex-col items-center p-2 rounded-md ${mood === "awful" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setMood("awful")}
                  >
                    <Frown className="w-6 h-6 mb-1" />
                    <span className="text-xs">Awful</span>
                  </button>
                  <button
                    className={`flex flex-col items-center p-2 rounded-md ${mood === "bad" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setMood("bad")}
                  >
                    <Frown className="w-6 h-6 mb-1" />
                    <span className="text-xs">Bad</span>
                  </button>
                  <button
                    className={`flex flex-col items-center p-2 rounded-md ${mood === "meh" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setMood("meh")}
                  >
                    <Meh className="w-6 h-6 mb-1" />
                    <span className="text-xs">Meh</span>
                  </button>
                  <button
                    className={`flex flex-col items-center p-2 rounded-md ${mood === "good" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setMood("good")}
                  >
                    <Smile className="w-6 h-6 mb-1" />
                    <span className="text-xs">Good</span>
                  </button>
                  <button
                    className={`flex flex-col items-center p-2 rounded-md ${mood === "rad" ? "bg-[#333] text-white" : "text-gray-400"}`}
                    onClick={() => setMood("rad")}
                  >
                    <Smile className="w-6 h-6 mb-1" />
                    <span className="text-xs">Rad</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <div className="text-lg font-medium">Events today</div>
              </div>

              <div className="flex items-center justify-center h-32 text-gray-400">No events for today</div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                <div className="text-lg font-medium">Today</div>
              </div>

              <div className="mb-4">
                <div className="flex mb-4">
                  <input
                    type="text"
                    className="flex-1 bg-[#2a2a2a] text-white rounded-l-md px-3 py-2 text-sm focus:outline-none"
                    placeholder="Quick add todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="bg-[#6c5ce7] text-white rounded-r-md px-3 py-2" onClick={addTodo}>
                    +
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-400 mb-2">Overplanned</div>
                <div className="space-y-2">
                  {todos.map((todo, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 rounded-full border border-gray-500 mr-2"></div>
                      <div className="text-sm">{todo}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="flex items-center justify-center h-32">
              <button className="bg-[#6c5ce7] text-white px-6 py-3 rounded-md font-medium" onClick={handleNext}>
                Let's go!
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-[#333] text-white rounded-md"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </button>

          {currentStep < 5 && (
            <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

