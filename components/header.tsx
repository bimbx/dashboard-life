"use client"

import { useState } from "react"
import { Bell, Search, Settings, User } from "lucide-react"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <div className="w-8 h-8 bg-[#ff4d4d] rounded-md flex items-center justify-center text-white font-bold">P</div>
          <h1 className="text-xl font-bold ml-2">Productivity</h1>
        </div>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-[#2a2a2a] text-white rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#ff4d4d]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff4d4d] rounded-full"></span>
        </button>

        <button className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <span className="ml-2 text-sm font-medium hidden md:inline-block">John Doe</span>
        </div>
      </div>
    </header>
  )
}

