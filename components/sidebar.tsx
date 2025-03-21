"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  CheckCircle,
  Droplet,
  Home,
  RefreshCcw,
  Settings,
  Utensils,
  User,
  Clock,
  Timer,
  Dumbbell,
  Smile,
  Target,
  Plane,
  List,
  BrainCircuit,
  Volume2,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <CheckCircle size={20} />, label: "Tasks", href: "/tasks" },
    { icon: <RefreshCcw size={20} />, label: "Habits", href: "/habits" },
    { icon: <List size={20} />, label: "Routines", href: "/routines" },
    { icon: <Clock size={20} />, label: "Countdowns", href: "/countdowns" },
    { icon: <Calendar size={20} />, label: "Calendar", href: "/calendar" },
    { icon: <Utensils size={20} />, label: "Food Log", href: "/food-log" },
    { icon: <Droplet size={20} />, label: "Hydration", href: "/hydration" },
    { icon: <Timer size={20} />, label: "Fasting", href: "/fasting" },
    { icon: <Smile size={20} />, label: "Mood", href: "/mood" },
    { icon: <Timer size={20} />, label: "Pomodoro", href: "/pomodoro" },
    { icon: <Dumbbell size={20} />, label: "Workouts", href: "/workouts" },
    { icon: <Target size={20} />, label: "Goals", href: "/goals" },
    { icon: <Plane size={20} />, label: "Trips", href: "/trips" },
    { icon: <Volume2 size={20} />, label: "Ambient Sounds", href: "/ambient-sounds" },
    { icon: <BrainCircuit size={20} />, label: "AI", href: "/ai" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  ]

  return (
    <div className={`bg-[#1a1a1a] h-screen transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        {!collapsed && <span className="text-xl font-bold">Productivity</span>}
        <button className="p-1 rounded-md hover:bg-[#333]" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="py-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="font-medium">John Doe</div>
              <div className="text-xs text-gray-400">Premium</div>
            </div>
          )}
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors
                    ${pathname === item.href ? "bg-[#6c5ce7] text-white" : "hover:bg-[#333]"}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

