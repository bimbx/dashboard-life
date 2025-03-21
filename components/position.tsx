"use client"

import { Medal } from "lucide-react"

export default function Position() {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <Medal className="w-5 h-5 text-yellow-500 mr-2" />
        <h2 className="text-lg font-semibold">Position</h2>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
          <Medal className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">259 points</p>
          <p className="text-sm text-gray-400">Rank 2 of 17</p>
        </div>
      </div>
    </div>
  )
}

