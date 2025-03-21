"use client"

import { useState } from "react"
import { StickyNote, Save, X } from "lucide-react"

export default function QuickNotes() {
  const [note, setNote] = useState("Stop reading my todos 👀")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note)

  const startEditing = () => {
    setIsEditing(true)
    setEditContent(note)
  }

  const saveNote = () => {
    if (editContent.trim()) {
      setNote(editContent)
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <StickyNote className="w-5 h-5 text-[#ff4d4d] mr-2" />
          <h2 className="text-lg font-semibold">Quick Note</h2>
        </div>

        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={saveNote}
              className="text-[#ff4d4d] hover:text-white transition-colors"
              aria-label="Save note"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEditing}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Cancel editing"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <textarea
          className="w-full h-[calc(100%-3rem)] bg-[#2a2a2a] text-white rounded-md p-3 focus:outline-none resize-none"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          autoFocus
        />
      ) : (
        <div className="w-full h-[calc(100%-3rem)] bg-[#1e1e1e] text-white p-2 cursor-pointer" onClick={startEditing}>
          <p>{note}</p>
        </div>
      )}
    </div>
  )
}

