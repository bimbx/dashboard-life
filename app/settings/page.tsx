"use client"

import type React from "react"

import { useState } from "react"
import { User, Layers, Lock, Mail, CreditCard, BrainCircuit, Clock, MessageSquare, Keyboard } from "lucide-react"

type SettingsTab =
  | "account"
  | "features"
  | "privacy"
  | "email"
  | "billing"
  | "ai"
  | "daily-check-in"
  | "telegram"
  | "webhooks"
  | "shortcuts"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("features")

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "Account", icon: <User size={18} /> },
    { id: "features", label: "Features", icon: <Layers size={18} /> },
    { id: "privacy", label: "Privacy", icon: <Lock size={18} /> },
    { id: "email", label: "Email", icon: <Mail size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
    { id: "ai", label: "Benji AI", icon: <BrainCircuit size={18} /> },
    { id: "daily-check-in", label: "Daily check in", icon: <Clock size={18} /> },
    { id: "telegram", label: "Telegram", icon: <MessageSquare size={18} /> },
    { id: "webhooks", label: "Webhooks", icon: <Keyboard size={18} /> },
    { id: "shortcuts", label: "Shortcuts", icon: <Keyboard size={18} /> },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center w-full px-4 py-3 rounded-md text-left mb-1 ${activeTab === tab.id ? "bg-[#6c5ce7] text-white" : "hover:bg-[#2a2a2a]"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-3">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
          {activeTab === "features" && <FeaturesSettings />}
          {activeTab === "privacy" && <PrivacySettings />}
          {activeTab === "daily-check-in" && <DailyCheckInSettings />}
          {activeTab === "webhooks" && <WebhookSettings />}
          {activeTab === "shortcuts" && <ShortcutSettings />}
        </div>
      </div>
    </div>
  )
}

function FeaturesSettings() {
  const enabledFeatures = [
    { id: "home", name: "Home", icon: "🏠" },
    { id: "habits", name: "Habits", icon: "🔄" },
    { id: "routines", name: "Routines", icon: "📋" },
    { id: "countdowns", name: "Countdowns", icon: "⏱️" },
    { id: "todos", name: "Todos", icon: "✅" },
    { id: "timeline", name: "Timeline", icon: "📊" },
    { id: "planner", name: "Planner", icon: "📆" },
    { id: "food", name: "Food", icon: "🍽️" },
    { id: "weight", name: "Weight", icon: "⚖️" },
    { id: "hydration", name: "Hydration", icon: "💧" },
    { id: "fasting", name: "Fasting", icon: "⏲️" },
    { id: "mood", name: "Mood", icon: "😊" },
    { id: "pomodoros", name: "Pomodoros", icon: "🍅" },
    { id: "workouts", name: "Workouts", icon: "💪" },
    { id: "trips", name: "Trips", icon: "✈️" },
    { id: "packing", name: "Packing", icon: "🧳" },
    { id: "ambient-sounds", name: "Ambient Sounds", icon: "🔊" },
    { id: "goals", name: "Goals", icon: "🎯" },
  ]

  const disabledFeatures = [
    { id: "journal", name: "Journal", icon: "📓" },
    { id: "contacts", name: "Contacts", icon: "👥" },
    { id: "pain-log", name: "Pain log", icon: "🤕" },
    { id: "activities", name: "Activities", icon: "🏃" },
    { id: "locations", name: "Locations", icon: "📍" },
    { id: "summary", name: "Summary", icon: "📊" },
    { id: "finances", name: "Finances", icon: "💰" },
    { id: "blood-pressure", name: "Blood Pressure", icon: "❤️" },
    { id: "hot-cold", name: "Hot & Cold", icon: "🧊" },
    { id: "household", name: "Household", icon: "🏠" },
    { id: "affirmations", name: "Affirmations", icon: "💬" },
    { id: "weeks-of-life", name: "Weeks of life", icon: "📅" },
    { id: "dump", name: "Dump", icon: "🗑️" },
    { id: "problems", name: "Problems", icon: "⚠️" },
    { id: "blocker", name: "Blocker", icon: "🚫" },
    { id: "shopping", name: "Shopping", icon: "🛒" },
    { id: "progress-pictures", name: "Progress Pictures", icon: "📸" },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Enabled features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {enabledFeatures.map((feature) => (
          <div key={feature.id} className="bg-[#2a2a2a] rounded-lg p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#6c5ce7] flex items-center justify-center mr-3">
              <span className="text-lg">{feature.icon}</span>
            </div>
            <span>{feature.name}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Disabled features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {disabledFeatures.map((feature) => (
          <div key={feature.id} className="bg-[#2a2a2a] rounded-lg p-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center mr-3">
              <span className="text-lg">{feature.icon}</span>
            </div>
            <span>{feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PrivacySettings() {
  const privacySettings = [
    {
      id: "habits",
      title: "Habits",
      description: "Who can visit your habits page and see posts about your habits in their timeline",
      selected: "private",
    },
    {
      id: "meals",
      title: "Meals",
      description: "Who can see posts about your meals in their timeline",
      selected: "private",
    },
    {
      id: "weight",
      title: "Weight",
      description: "Who can see your weight page and posts about your weight",
      selected: "private",
    },
    {
      id: "fasting",
      title: "Fasting",
      description: "Who can see posts about starting/ending your fast",
      selected: "private",
    },
    {
      id: "workouts",
      title: "Workouts",
      description: "Who can see posts when you complete a workout",
      selected: "private",
    },
    {
      id: "hydration",
      title: "Hydration",
      description: "Who can see a post when you complete your hydration goal for the day",
      selected: "private",
    },
    {
      id: "hot-cold",
      title: "Hot/Cold Sessions",
      description: "Who can see posts about your hot/cold sessions",
      selected: "private",
    },
    {
      id: "check-ins",
      title: "Check-ins",
      description: "Participate on the check-in leaderboard",
      selected: "private",
    },
    {
      id: "pomodoros",
      title: "During pomodoros",
      description: "Choose who can see that you're doing a pomodoro",
      selected: "private",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Content visibility</h2>

      <div className="space-y-6">
        {privacySettings.map((setting) => (
          <div key={setting.id} className="border-b border-[#333] pb-4">
            <h3 className="font-medium mb-1">{setting.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{setting.description}</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`privacy-${setting.id}`}
                  checked={setting.selected === "private"}
                  className="mr-2"
                />
                <span>Private</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`privacy-${setting.id}`}
                  checked={setting.selected === "following"}
                  className="mr-2"
                />
                <span>Following</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`privacy-${setting.id}`}
                  checked={setting.selected === "public"}
                  className="mr-2"
                />
                <span>Public</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyCheckInSettings() {
  const [mode, setMode] = useState<"hidden" | "wizard">("wizard")
  const [showMood, setShowMood] = useState(true)
  const [showAffirmations, setShowAffirmations] = useState(true)
  const [showTasks, setShowTasks] = useState(true)
  const [showSchedule, setShowSchedule] = useState(true)
  const [showSleep, setShowSleep] = useState(true)
  const [showDailyPosition, setShowDailyPosition] = useState(true)

  return (
    <div>
      <p className="text-gray-400 mb-6">
        When you open Benji for the first time, it will show you the Daily Check In. Here's where you can customize it
        or completely disable it.
      </p>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Mode</h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="check-in-mode"
              checked={mode === "hidden"}
              onChange={() => setMode("hidden")}
              className="mr-2"
            />
            <span>Hidden</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="check-in-mode"
              checked={mode === "wizard"}
              onChange={() => setMode("wizard")}
              className="mr-2"
            />
            <span>Wizard</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-mood"
            checked={showMood}
            onChange={(e) => setShowMood(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-mood">Show mood</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-affirmations"
            checked={showAffirmations}
            onChange={(e) => setShowAffirmations(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-affirmations">Show affirmations</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-tasks"
            checked={showTasks}
            onChange={(e) => setShowTasks(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-tasks">Show tasks</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-schedule"
            checked={showSchedule}
            onChange={(e) => setShowSchedule(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-schedule">Show schedule</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-sleep"
            checked={showSleep}
            onChange={(e) => setShowSleep(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-sleep">Show sleep</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-daily-position"
            checked={showDailyPosition}
            onChange={(e) => setShowDailyPosition(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-daily-position">Show daily position</label>
        </div>
      </div>
    </div>
  )
}

function WebhookSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Pomodoro</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Pomodoro Started</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Pomodoro Finished</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Pomodoro Cancelled</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-6">Pomodoro Break</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Pomodoro Break Finished</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Pomodoro Break Ended</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Pomodoro Break Cancelled</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-6">Work mode</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Started Work Mode</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Ended Work Mode</h3>
          <input
            type="text"
            className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
            placeholder="Enter webhook URL here..."
          />
        </div>
      </div>
    </div>
  )
}

function ShortcutSettings() {
  const shortcuts = [
    {
      category: "Ambient sounds",
      items: [
        { key: "⌘ M", description: "Toggle ambient sounds" },
        { key: "⌘ A", description: "Open ambient sound dialog" },
      ],
    },
    {
      category: "Planner",
      items: [
        { key: "⌘ C", description: "Toggle calendar drawer" },
        { key: "⌘ +", description: "Zoom in" },
        { key: "⌘ -", description: "Zoom out" },
        { key: "M", description: "Switch planner view to Monthly" },
        { key: "W", description: "Switch planner view to Weekly" },
        { key: "D", description: "Switch planner view to Daily" },
        { key: "A", description: "Switch planner view to Agenda" },
        { key: "1-9", description: "Toggle planner list visibility" },
      ],
    },
    { category: "Pomodoros", items: [{ key: "⌘ P", description: "Start a pomodoro or toggle the pomodoro dialog" }] },
    {
      category: "Other",
      items: [
        { key: "⌘ R", description: "Refetch data" },
        { key: "⌘ K", description: "Toggle spotlight" },
        { key: "⌘ ,", description: "Toggle settings" },
        { key: "⌘ I", description: "Open AI modal" },
        { key: "⌘ B", description: "Report a bug" },
      ],
    },
  ]

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
          placeholder="Quick add todo"
        />
      </div>

      {shortcuts.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-lg font-bold mb-4">{category.category}</h2>
          <div className="space-y-3">
            {category.items.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 flex-shrink-0">
                  <span className="bg-[#2a2a2a] px-2 py-1 rounded text-sm">{item.key}</span>
                </div>
                <span className="ml-4">{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

