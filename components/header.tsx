"use client"

import { useState } from "react"
<<<<<<< HEAD
import { Bell, Search, Settings, User } from "lucide-react"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
=======
import Link from "next/link"
import { signOut } from "next-auth/react"
import { Bell, Search, Settings, User, LogOut, ChevronDown } from "lucide-react"

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function Header({ user }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 border-b border-[#333]">
>>>>>>> a251471 (Second try nextauth.js)
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

<<<<<<< HEAD
        <button className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <span className="ml-2 text-sm font-medium hidden md:inline-block">John Doe</span>
=======
        <Link
          href="/settings"
          className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>

        <div className="relative">
          <button className="flex items-center space-x-2 focus:outline-none" onClick={toggleUserMenu}>
            <div className="w-8 h-8 rounded-full bg-[#ff4d4d] flex items-center justify-center text-white overflow-hidden">
              {user.image ? (
                <img
                  src={user.image || "/placeholder.svg"}
                  alt={user.name || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <span className="ml-2 text-sm font-medium hidden md:inline-block">{user.name || "User"}</span>
            <ChevronDown className="w-4 h-4 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] rounded-md shadow-lg py-1 z-10">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </div>
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <div className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </div>
              </button>
            </div>
          )}
>>>>>>> a251471 (Second try nextauth.js)
        </div>
      </div>
    </header>
  )
}

