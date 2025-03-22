"use client"

<<<<<<< HEAD
import { Medal } from "lucide-react"

export default function Position() {
=======
import { useState, useEffect, useCallback } from "react"
import { Medal, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Position() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [points, setPoints] = useState(0)
  const [rank, setRank] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchPositionData = useCallback(async () => {
    if (!session?.user?.id) return

    setIsLoading(true)

    try {
      // In a production app, this would be an API call
      // For now, we'll use localStorage to persist data
      const key = `position-${session.user.id}`
      const storedData = localStorage.getItem(key)

      if (storedData) {
        const data = JSON.parse(storedData)
        setPoints(data.points)
        setRank(data.rank)
        setTotalUsers(data.totalUsers)
      } else {
        // Initialize with default values
        const defaultData = {
          points: 259,
          rank: 2,
          totalUsers: 17,
        }
        localStorage.setItem(key, JSON.stringify(defaultData))
        setPoints(defaultData.points)
        setRank(defaultData.rank)
        setTotalUsers(defaultData.totalUsers)
      }
    } catch (error) {
      console.error("Error fetching position data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    fetchPositionData()
  }, [fetchPositionData])

>>>>>>> a251471 (Second try nextauth.js)
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <Medal className="w-5 h-5 text-yellow-500 mr-2" />
        <h2 className="text-lg font-semibold">Position</h2>
      </div>

<<<<<<< HEAD
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
          <Medal className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">259 points</p>
          <p className="text-sm text-gray-400">Rank 2 of 17</p>
        </div>
      </div>
=======
      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <Loader2 className="w-6 h-6 text-[#ff4d4d] animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
            <Medal className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{points} points</p>
            <p className="text-sm text-gray-400">
              Rank {rank} of {totalUsers}
            </p>
          </div>
        </div>
      )}
>>>>>>> a251471 (Second try nextauth.js)
    </div>
  )
}

