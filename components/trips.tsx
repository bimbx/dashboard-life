"use client"

import { useState } from "react"
import { Plane, Map, Building, Bus, Plus, X, Luggage } from "lucide-react"

type TripTab = "trips" | "cards" | "table"
type TripActivityTab = "cards" | "table" | "kanban"
type PackingItemTab = "cards" | "kanban" | "table"
type StayTab = "cards" | "table"
type TransportTab = "cards" | "table"

interface Trip {
  id: string
  name: string
  location: string
  startDate?: string
  endDate?: string
  activities?: string[]
  projects?: string[]
  stayingAtOwnPlace: boolean
  ownTransport: boolean
}

interface TripActivity {
  id: string
  name: string
  emoji?: string
  date?: string
}

interface PackingItem {
  id: string
  name: string
  activities?: string[]
  description?: string
  expendable: boolean
  needsCharging: boolean
  essential: boolean
  needsDoubleCheck: boolean
  chargingStatus?: string
  whenToPack?: string
}

interface Stay {
  id: string
  name: string
  notes?: string
  location?: string
  booked: boolean
  startDate?: string
  endDate?: string
}

interface Transport {
  id: string
  name: string
  type: "plane" | "train" | "bus" | "car" | "ferry" | "other"
  startDate?: string
  endDate?: string
  notes?: string
  from?: string
  to?: string
  arriveTimeBefore?: {
    hours: number
    minutes: number
  }
  seat?: string
}

export default function Trips() {
  const [activeTab, setActiveTab] = useState<TripTab>("trips")
  const [activeActivityTab, setActiveActivityTab] = useState<TripActivityTab>("cards")
  const [activePackingTab, setActivePackingTab] = useState<PackingItemTab>("cards")
  const [activeStayTab, setActiveStayTab] = useState<StayTab>("cards")
  const [activeTransportTab, setActiveTransportTab] = useState<TransportTab>("cards")

  const [activeSection, setActiveSection] = useState<"trips" | "activities" | "packing" | "stays" | "transports">(
    "trips",
  )

  const [showTripForm, setShowTripForm] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showPackingForm, setShowPackingForm] = useState(false)
  const [showStayForm, setShowStayForm] = useState(false)
  const [showTransportForm, setShowTransportForm] = useState(false)

  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    name: "",
    location: "",
    stayingAtOwnPlace: false,
    ownTransport: false,
  })

  const [newActivity, setNewActivity] = useState<Partial<TripActivity>>({
    name: "",
  })

  const [newPackingItem, setNewPackingItem] = useState<Partial<PackingItem>>({
    name: "",
    expendable: false,
    needsCharging: false,
    essential: false,
    needsDoubleCheck: false,
  })

  const [newStay, setNewStay] = useState<Partial<Stay>>({
    name: "",
    booked: false,
  })

  const [newTransport, setNewTransport] = useState<Partial<Transport>>({
    name: "",
    type: "plane",
  })

  const handleSaveTrip = () => {
    // Save trip logic would go here
    setShowTripForm(false)
  }

  const handleSaveActivity = () => {
    // Save activity logic would go here
    setShowActivityForm(false)
  }

  const handleSavePackingItem = () => {
    // Save packing item logic would go here
    setShowPackingForm(false)
  }

  const handleSaveStay = () => {
    // Save stay logic would go here
    setShowStayForm(false)
  }

  const handleSaveTransport = () => {
    // Save transport logic would go here
    setShowTransportForm(false)
  }

  const renderTripForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Trip</h2>
          <button className="p-1 rounded-md hover:bg-[#333] text-gray-400" onClick={() => setShowTripForm(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Name"
              value={newTrip.name}
              onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="City, Country, Address, or whatever you prefer"
              value={newTrip.location}
              onChange={(e) => setNewTrip({ ...newTrip, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Start Date <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newTrip.startDate}
                onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setNewTrip({ ...newTrip, startDate: undefined })}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              End Date <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newTrip.endDate}
                onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setNewTrip({ ...newTrip, endDate: undefined })}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Activities <span className="text-gray-500">(optional)</span>
            </label>
            <select className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]">
              <option value="">Select activities...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Projects <span className="text-gray-500">(optional)</span>
            </label>
            <select className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]">
              <option value="">Select projects...</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="staying-at-own-place"
              checked={newTrip.stayingAtOwnPlace}
              onChange={(e) => setNewTrip({ ...newTrip, stayingAtOwnPlace: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="staying-at-own-place">Staying at own place</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="own-transport"
              checked={newTrip.ownTransport}
              onChange={(e) => setNewTrip({ ...newTrip, ownTransport: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="own-transport">Own transport</label>
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md" onClick={handleSaveTrip}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActivityForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Trip Activity</h2>
          <button className="p-1 rounded-md hover:bg-[#333] text-gray-400" onClick={() => setShowActivityForm(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Name"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md" onClick={handleSaveActivity}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPackingForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Packing Item</h2>
          <button className="p-1 rounded-md hover:bg-[#333] text-gray-400" onClick={() => setShowPackingForm(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Name"
              value={newPackingItem.name}
              onChange={(e) => setNewPackingItem({ ...newPackingItem, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Activities <span className="text-gray-500">(optional)</span>
            </label>
            <select className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]">
              <option value="">Select activities...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7] min-h-[100px]"
              placeholder="Description"
              value={newPackingItem.description}
              onChange={(e) => setNewPackingItem({ ...newPackingItem, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="expendable"
                checked={newPackingItem.expendable}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, expendable: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="expendable">Expendable</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="needs-charging"
                checked={newPackingItem.needsCharging}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, needsCharging: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="needs-charging">Needs charging</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="essential"
                checked={newPackingItem.essential}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, essential: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="essential">Essential</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="double-check"
                checked={newPackingItem.needsDoubleCheck}
                onChange={(e) => setNewPackingItem({ ...newPackingItem, needsDoubleCheck: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="double-check">Needs to be double checked</label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Charging status <span className="text-gray-500">(optional)</span>
            </label>
            <select
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              value={newPackingItem.chargingStatus}
              onChange={(e) => setNewPackingItem({ ...newPackingItem, chargingStatus: e.target.value })}
            >
              <option value="">Select Charging status...</option>
              <option value="not-needed">Not needed</option>
              <option value="to-charge">To charge</option>
              <option value="charging">Charging</option>
              <option value="charged">Charged</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              When to pack <span className="text-gray-500">(optional)</span>
            </label>
            <select
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              value={newPackingItem.whenToPack}
              onChange={(e) => setNewPackingItem({ ...newPackingItem, whenToPack: e.target.value })}
            >
              <option value="">Select When to pack...</option>
              <option value="now">Now</option>
              <option value="day-before">Day before</option>
              <option value="last-minute">Last minute</option>
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md" onClick={handleSavePackingItem}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStayForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Stay</h2>
          <button className="p-1 rounded-md hover:bg-[#333] text-gray-400" onClick={() => setShowStayForm(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Name"
              value={newStay.name}
              onChange={(e) => setNewStay({ ...newStay, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Notes"
              value={newStay.notes}
              onChange={(e) => setNewStay({ ...newStay, notes: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Location <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Location/Address"
              value={newStay.location}
              onChange={(e) => setNewStay({ ...newStay, location: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="booked"
              checked={newStay.booked}
              onChange={(e) => setNewStay({ ...newStay, booked: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="booked">Booked</label>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Start Date <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newStay.startDate}
                onChange={(e) => setNewStay({ ...newStay, startDate: e.target.value })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setNewStay({ ...newStay, startDate: undefined })}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              End Date <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newStay.endDate}
                onChange={(e) => setNewStay({ ...newStay, endDate: e.target.value })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setNewStay({ ...newStay, endDate: undefined })}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md" onClick={handleSaveStay}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTransportForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Transport</h2>
          <button className="p-1 rounded-md hover:bg-[#333] text-gray-400" onClick={() => setShowTransportForm(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Name"
              value={newTransport.name}
              onChange={(e) => setNewTransport({ ...newTransport, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Type <span className="text-gray-500">(optional)</span>
            </label>
            <select
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              value={newTransport.type}
              onChange={(e) => setNewTransport({ ...newTransport, type: e.target.value as any })}
            >
              <option value="plane">Plane</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
              <option value="car">Car</option>
              <option value="ferry">Ferry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Start Date <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newTransport.startDate}
                onChange={(e) => setNewTransport({ ...newTransport, startDate: e.target.value })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setNewTransport({ ...newTransport, startDate: undefined })}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              End Date <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                value={newTransport.endDate}
                onChange={(e) => setNewTransport({ ...newTransport, endDate: e.target.value })}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setNewTransport({ ...newTransport, endDate: undefined })}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Notes <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Notes..."
              value={newTransport.notes}
              onChange={(e) => setNewTransport({ ...newTransport, notes: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              From <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="From address"
              value={newTransport.from}
              onChange={(e) => setNewTransport({ ...newTransport, from: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              To <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="To address"
              value={newTransport.to}
              onChange={(e) => setNewTransport({ ...newTransport, to: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Arrive time before <span className="text-gray-500">(optional)</span>
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Hours</label>
                <input
                  type="number"
                  className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                  min="0"
                  max="24"
                  placeholder="0"
                  value={newTransport.arriveTimeBefore?.hours || ""}
                  onChange={(e) =>
                    setNewTransport({
                      ...newTransport,
                      arriveTimeBefore: {
                        ...(newTransport.arriveTimeBefore || { hours: 0, minutes: 0 }),
                        hours: Number.parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Minutes</label>
                <input
                  type="number"
                  className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
                  min="0"
                  max="59"
                  placeholder="0"
                  value={newTransport.arriveTimeBefore?.minutes || ""}
                  onChange={(e) =>
                    setNewTransport({
                      ...newTransport,
                      arriveTimeBefore: {
                        ...(newTransport.arriveTimeBefore || { hours: 0, minutes: 0 }),
                        minutes: Number.parseInt(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Seat <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              className="w-full bg-[#2a2a2a] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6c5ce7]"
              placeholder="Seat"
              value={newTransport.seat}
              onChange={(e) => setNewTransport({ ...newTransport, seat: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-[#6c5ce7] text-white rounded-md" onClick={handleSaveTransport}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plane className="w-5 h-5 text-[#6c5ce7] mr-2" />
          <h2 className="text-xl font-bold">Packing & Trips</h2>
        </div>
      </div>

      <div className="flex border-b border-[#333] mb-6">
        <button
          className={`px-4 py-2 ${activeSection === "trips" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
          onClick={() => setActiveSection("trips")}
        >
          Trips
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "activities" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
          onClick={() => setActiveSection("activities")}
        >
          Trip activities
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "packing" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
          onClick={() => setActiveSection("packing")}
        >
          Packing items
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "stays" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
          onClick={() => setActiveSection("stays")}
        >
          Stays
        </button>
        <button
          className={`px-4 py-2 ${activeSection === "transports" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
          onClick={() => setActiveSection("transports")}
        >
          Transports
        </button>
      </div>

      {activeSection === "trips" && (
        <>
          <div className="flex border-b border-[#333] mb-6">
            <button
              className={`px-4 py-2 ${activeTab === "trips" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveTab("trips")}
            >
              Trips
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "cards" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveTab("cards")}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "table" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveTab("table")}
            >
              Table
            </button>
            <button className="ml-auto px-2 py-2 text-gray-400" onClick={() => setShowTripForm(true)}>
              <Plus size={18} />
            </button>
          </div>

          <div className="text-center py-12 text-gray-400">
            <Plane size={48} className="mx-auto mb-4 opacity-50" />
            <p>No trips yet</p>
            <p className="text-sm mt-2">Plan your next adventure</p>
            <button className="mt-4 px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={() => setShowTripForm(true)}>
              Add Trip
            </button>
          </div>
        </>
      )}

      {activeSection === "activities" && (
        <>
          <div className="flex border-b border-[#333] mb-6">
            <button
              className={`px-4 py-2 ${activeActivityTab === "cards" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveActivityTab("cards")}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 ${activeActivityTab === "table" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveActivityTab("table")}
            >
              Table
            </button>
            <button
              className={`px-4 py-2 ${activeActivityTab === "kanban" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveActivityTab("kanban")}
            >
              Kanban
            </button>
            <button className="ml-auto px-2 py-2 text-gray-400" onClick={() => setShowActivityForm(true)}>
              <Plus size={18} />
            </button>
          </div>

          <div className="text-center py-12 text-gray-400">
            <Map size={48} className="mx-auto mb-4 opacity-50" />
            <p>No trip activities yet</p>
            <p className="text-sm mt-2">Add activities for your trips</p>
            <button
              className="mt-4 px-4 py-2 rounded-md bg-[#6c5ce7] text-white"
              onClick={() => setShowActivityForm(true)}
            >
              Add Activity
            </button>
          </div>
        </>
      )}

      {activeSection === "packing" && (
        <>
          <div className="flex border-b border-[#333] mb-6">
            <button
              className={`px-4 py-2 ${activePackingTab === "cards" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActivePackingTab("cards")}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 ${activePackingTab === "kanban" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActivePackingTab("kanban")}
            >
              Kanban
            </button>
            <button
              className={`px-4 py-2 ${activePackingTab === "table" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActivePackingTab("table")}
            >
              Table
            </button>
            <button className="ml-auto px-2 py-2 text-gray-400" onClick={() => setShowPackingForm(true)}>
              <Plus size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2a2a2a] p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Not Charged</h3>
              <div className="text-center py-8 text-gray-400">
                <Luggage size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items yet</p>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Charged</h3>
              <div className="text-center py-8 text-gray-400">
                <Luggage size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items yet</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === "stays" && (
        <>
          <div className="flex border-b border-[#333] mb-6">
            <button
              className={`px-4 py-2 ${activeStayTab === "cards" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveStayTab("cards")}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 ${activeStayTab === "table" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveStayTab("table")}
            >
              Table
            </button>
            <button className="ml-auto px-2 py-2 text-gray-400" onClick={() => setShowStayForm(true)}>
              <Plus size={18} />
            </button>
          </div>

          <div className="text-center py-12 text-gray-400">
            <Building size={48} className="mx-auto mb-4 opacity-50" />
            <p>No stays yet</p>
            <p className="text-sm mt-2">Add accommodations for your trips</p>
            <button className="mt-4 px-4 py-2 rounded-md bg-[#6c5ce7] text-white" onClick={() => setShowStayForm(true)}>
              Add Stay
            </button>
          </div>
        </>
      )}

      {activeSection === "transports" && (
        <>
          <div className="flex border-b border-[#333] mb-6">
            <button
              className={`px-4 py-2 ${activeTransportTab === "cards" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveTransportTab("cards")}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 ${activeTransportTab === "table" ? "border-b-2 border-[#6c5ce7] text-white" : "text-gray-400"}`}
              onClick={() => setActiveTransportTab("table")}
            >
              Table
            </button>
            <button className="ml-auto px-2 py-2 text-gray-400" onClick={() => setShowTransportForm(true)}>
              <Plus size={18} />
            </button>
          </div>

          <div className="text-center py-12 text-gray-400">
            <Bus size={48} className="mx-auto mb-4 opacity-50" />
            <p>No transports yet</p>
            <p className="text-sm mt-2">Add transportation for your trips</p>
            <button
              className="mt-4 px-4 py-2 rounded-md bg-[#6c5ce7] text-white"
              onClick={() => setShowTransportForm(true)}
            >
              Add Transport
            </button>
          </div>
        </>
      )}

      {showTripForm && renderTripForm()}
      {showActivityForm && renderActivityForm()}
      {showPackingForm && renderPackingForm()}
      {showStayForm && renderStayForm()}
      {showTransportForm && renderTransportForm()}
    </div>
  )
}

