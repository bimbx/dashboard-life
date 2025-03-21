"use client"

import { useState } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

interface Sound {
  id: string
  name: string
  icon: string
  playing: boolean
  volume: number
}

export default function AmbientSoundsPage() {
  const [sounds, setSounds] = useState<Sound[]>([
    { id: "1", name: "Rain", icon: "🌧️", playing: false, volume: 50 },
    { id: "2", name: "Forest", icon: "🌲", playing: false, volume: 50 },
    { id: "3", name: "Ocean", icon: "🌊", playing: false, volume: 50 },
    { id: "4", name: "Fireplace", icon: "🔥", playing: false, volume: 50 },
    { id: "5", name: "Coffee Shop", icon: "☕", playing: false, volume: 50 },
    { id: "6", name: "White Noise", icon: "🔊", playing: false, volume: 50 },
    { id: "7", name: "Thunder", icon: "⚡", playing: false, volume: 50 },
    { id: "8", name: "Birds", icon: "🐦", playing: false, volume: 50 },
  ])

  const [masterVolume, setMasterVolume] = useState(50)
  const [masterMuted, setMasterMuted] = useState(false)

  const toggleSound = (id: string) => {
    setSounds(sounds.map((sound) => (sound.id === id ? { ...sound, playing: !sound.playing } : sound)))
  }

  const updateVolume = (id: string, volume: number) => {
    setSounds(sounds.map((sound) => (sound.id === id ? { ...sound, volume } : sound)))
  }

  const toggleMasterMute = () => {
    setMasterMuted(!masterMuted)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ambient Sounds</h1>

      <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Volume2 className="w-5 h-5 text-[#6c5ce7] mr-2" />
            <h2 className="text-xl font-bold">Sound Mixer</h2>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#333]" onClick={toggleMasterMute}>
              {masterMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div className="w-32 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sounds.map((sound) => (
            <div key={sound.id} className="bg-[#2a2a2a] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{sound.icon}</span>
                  <span className="font-medium">{sound.name}</span>
                </div>
                <button
                  className={`p-2 rounded-full ${sound.playing ? "bg-[#6c5ce7] text-white" : "bg-[#333] hover:bg-[#444]"}`}
                  onClick={() => toggleSound(sound.id)}
                >
                  {sound.playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sound.volume}
                  onChange={(e) => updateVolume(sound.id, Number.parseInt(e.target.value))}
                  className="w-full"
                  disabled={!sound.playing}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-[#333] pt-4">
          <h3 className="text-lg font-medium mb-4">Presets</h3>

          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-[#2a2a2a] rounded-md hover:bg-[#333]">Focus</button>
            <button className="px-4 py-2 bg-[#2a2a2a] rounded-md hover:bg-[#333]">Relax</button>
            <button className="px-4 py-2 bg-[#2a2a2a] rounded-md hover:bg-[#333]">Sleep</button>
            <button className="px-4 py-2 bg-[#2a2a2a] rounded-md hover:bg-[#333]">Nature</button>
            <button className="px-4 py-2 bg-[#2a2a2a] rounded-md hover:bg-[#333]">Urban</button>
          </div>
        </div>
      </div>
    </div>
  )
}

