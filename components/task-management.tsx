"use client"

import type React from "react"

import { useState, useRef } from "react"
import { CheckCircle, Circle, AlertCircle, Clock, Plus } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  category: "done" | "todo" | "forgotten" | "overdue"
  priority?: "high" | "medium" | "low"
}

// Mock data for tasks
const initialTasks: Task[] = [
  { id: "1", text: "Calendar fix", completed: true, category: "done" },
  { id: "2", text: "Figure out customer Sizzy subscriptions that expired", completed: true, category: "done" },
  { id: "3", text: "Pay for billskitze.io", completed: true, category: "done" },
  { id: "4", text: "Ship new landing page vs todolist etc", completed: true, category: "done" },
  { id: "5", text: "Menus don't have bg on yeti", completed: true, category: "done" },
  { id: "6", text: "See why users cannot send pass reset email", completed: true, category: "done" },
  { id: "7", text: "benji email verification doesn't work", completed: true, category: "done" },
  { id: "8", text: "Pay mailgun", completed: true, category: "done" },
  { id: "9", text: "Text accountant", completed: true, category: "done" },
  { id: "10", text: "sizzy downloads for apple silicon", completed: true, category: "done" },
  { id: "11", text: "Refund customer", completed: true, category: "done" },
  { id: "12", text: "fix guy's sub on benji", completed: true, category: "done" },
  { id: "13", text: "Move benji to coolify", completed: true, category: "done" },
  { id: "14", text: "Deploy glink", completed: true, category: "done" },
  { id: "15", text: "Make sure ppl can buy sizzy", completed: true, category: "done" },
  { id: "16", text: "Sizzy new subs don't load", completed: true, category: "done" },
  { id: "17", text: "Pay PIT for Nov/Dec", completed: true, category: "done" },
  { id: "18", text: "Finalize taxes with accountant", completed: true, category: "done" },
  { id: "19", text: "see PIT email", completed: true, category: "done" },
  { id: "20", text: "appsumo money", completed: true, category: "done" },
  { id: "21", text: "Invoices expenses November", completed: true, category: "done" },
  { id: "22", text: "Invoices income December", completed: true, category: "done" },
  { id: "23", text: "Invoices expenses December", completed: true, category: "done" },

  { id: "24", text: "Event ghost for /move/create/resize", completed: false, category: "todo" },
  { id: "25", text: "Saving on mobile doesnt keep layout on refresh", completed: false, category: "todo" },
  { id: "26", text: "Switching dash doesnt get remembered in localstorage", completed: false, category: "todo" },
  { id: "27", text: "When dragging a todo into a section the entire section", completed: false, category: "todo" },

  { id: "28", text: "Ask accountant about crypto tax", completed: false, category: "forgotten" },
  { id: "29", text: "manage payment details button doesnt work", completed: false, category: "forgotten" },

  { id: "30", text: "Send invoices to accountant", completed: false, category: "overdue", priority: "high" },
  { id: "31", text: "Move emails out of spam", completed: false, category: "overdue", priority: "medium" },
  { id: "32", text: "Clean email inbox", completed: false, category: "overdue", priority: "medium" },
  { id: "33", text: "Daily work demo", completed: false, category: "overdue", priority: "high" },
  { id: "34", text: "Make finances snapshot", completed: false, category: "overdue", priority: "high" },
]

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTaskText, setNewTaskText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const categories: { id: Task["category"]; title: string }[] = [
    { id: "done", title: "Work done today" },
    { id: "todo", title: "Work todos today" },
    { id: "forgotten", title: "Forgotten" },
    { id: "overdue", title: "Overdue" },
  ]

  const getCategoryIcon = (category: Task["category"]) => {
    switch (category) {
      case "done":
        return <CheckCircle className="w-5 h-5 text-[#ff4d4d]" />
      case "todo":
        return <Circle className="w-5 h-5 text-blue-500" />
      case "forgotten":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "overdue":
        return <Clock className="w-5 h-5 text-orange-500" />
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const completed = !task.completed
          return {
            ...task,
            completed,
            // If task is completed, move it to "done" category, otherwise keep it in its current category
            category: completed ? "done" : task.category,
          }
        }
        return task
      }),
    )
  }

  const addNewTask = () => {
    if (!newTaskText.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      category: "todo",
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")

    // Focus the input after adding a task
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addNewTask()
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getCategoryIcon(category.id)}
              <h2 className="text-lg font-semibold ml-2">{category.title}</h2>
            </div>
            <span className="text-xs px-2 py-1 bg-[#2a2a2a] rounded-md text-[#ff4d4d]">work</span>
          </div>

          {category.id === "todo" && (
            <div className="mb-4 flex">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-[#2a2a2a] text-white rounded-l-md px-3 py-2 text-sm focus:outline-none"
                placeholder="Quick add todo..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="bg-[#ff4d4d] text-white rounded-r-md px-2 py-2 flex items-center justify-center"
                onClick={addNewTask}
                aria-label="Add task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tasks
              .filter((task) => task.category === category.id)
              .map((task) => (
                <div
                  key={task.id}
                  className={`
                    flex items-start p-2 rounded-md cursor-pointer hover:bg-[#2a2a2a] transition-colors
                    ${task.category === "overdue" && task.priority === "high" ? "text-[#ff4d4d]" : ""}
                  `}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  <div className="mt-0.5 mr-2 flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle className="w-4 h-4 text-[#ff4d4d]" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.text}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

