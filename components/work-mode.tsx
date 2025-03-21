"use client"

import { useState } from "react"
import { Briefcase } from "lucide-react"

export default function WorkMode() {
  const [isActive, setIsActive] = useState(false)

  const toggleWorkMode = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <Briefcase className="w-5 h-5 text-[#ff4d4d] mr-2" />
        <h2 className="text-lg font-semibold">Work Mode</h2>
      </div>

      <div className="flex justify-center">
        <button
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isActive ? "bg-[#ff4d4d]" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]"}
          `}
          onClick={toggleWorkMode}
          aria-label={isActive ? "Deactivate Work Mode" : "Activate Work Mode"}
        >
          <Briefcase className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  )
}

