"use client"

import { Crosshair } from "lucide-react"

const RecenterButton = () => {
  const handleRecenter = () => {
    const event = new CustomEvent("recenter-map")
    window.dispatchEvent(event)
  }

  return (
    <button
      className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors text-gray-800"
      title="Recentrer la carte"
      onClick={handleRecenter}
    >
      <Crosshair size={18} className="text-black" />
    </button>
  )
}

export default RecenterButton
