"use client"

<<<<<<< HEAD
import { useState } from "react"
import { StickyNote, Save, X } from "lucide-react"

export default function QuickNotes() {
  const [note, setNote] = useState("Stop reading my todos 👀")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note)
=======
import { useState, useEffect, useCallback } from "react"
import { StickyNote, Save, X, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function QuickNotes() {
  const { data: session } = useSession()
  const [note, setNote] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const key = `quickNote-${session.user.id}`
      const savedNote = localStorage.getItem(key)

      if (savedNote) {
        setNote(savedNote)
      } else {
        // Initialize with default note
        setNote("Click to add a note")
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
      setError("Failed to load notes")
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])
>>>>>>> a251471 (Second try nextauth.js)

  const startEditing = () => {
    setIsEditing(true)
    setEditContent(note)
  }

  const saveNote = () => {
<<<<<<< HEAD
    if (editContent.trim()) {
      setNote(editContent)
=======
    if (!session?.user?.id) return

    if (editContent.trim()) {
      setNote(editContent)

      // Save to localStorage
      try {
        localStorage.setItem(`quickNote-${session.user.id}`, editContent)
      } catch (error) {
        console.error("Error saving note:", error)
        setError("Failed to save note")
      }
>>>>>>> a251471 (Second try nextauth.js)
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
<<<<<<< HEAD
=======
    setError(null)
>>>>>>> a251471 (Second try nextauth.js)
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

<<<<<<< HEAD
      {isEditing ? (
=======
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-6 h-6 text-[#ff4d4d] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      ) : isEditing ? (
>>>>>>> a251471 (Second try nextauth.js)
        <textarea
          className="w-full h-[calc(100%-3rem)] bg-[#2a2a2a] text-white rounded-md p-3 focus:outline-none resize-none"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          autoFocus
        />
      ) : (
<<<<<<< HEAD
        <div className="w-full h-[calc(100%-3rem)] bg-[#1e1e1e] text-white p-2 cursor-pointer" onClick={startEditing}>
          <p>{note}</p>
=======
        <div
          className="w-full h-[calc(100%-3rem)] bg-[#1e1e1e] text-white p-2 cursor-pointer"
          onClick={startEditing}
          role="button"
          tabIndex={0}
          aria-label="Edit note"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              startEditing()
            }
          }}
        >
          <p className="text-sm">{note}</p>
>>>>>>> a251471 (Second try nextauth.js)
        </div>
      )}
    </div>
  )
}

