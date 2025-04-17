"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Search } from "lucide-react"
import { useState } from "react"

const NotreHistoireLink = () => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <LocalizedClientLink
        href="/notre-histoire"
        className="relative block transition-transform hover:scale-105 duration-300"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col items-center w-[130px] sm:w-[150px] md:w-[170px] bg-white rounded-[100px] shadow-lg border border-gray-300 overflow-hidden py-2">
          {/* Partie avec le logo */}
          <div className="pt-2 pb-0 px-3 w-full relative">
            <div className="h-32 sm:h-36 md:h-40 relative w-full">
              <Image
                src="/images/logo-seul.png"
                alt="Bella Vista Restaurant - Notre Histoire"
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                priority
              />
            </div>
          </div>

          {/* Partie avec le texte "Notre Histoire" qui apparaît au survol ou la loupe quand pas de survol */}
          <div className="h-10 w-full flex items-center justify-center -mt-2 mb-1">
            <div
              className={`text-center text-amber-500 font-medium text-sm transition-opacity duration-300 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              Notre Histoire
            </div>
            <div
              className={`text-center text-amber-500 transition-opacity duration-300 absolute ${
                isHovering ? "opacity-0" : "opacity-100"
              }`}
            >
              <Search size={20} strokeWidth={2.5} className="text-amber-500" />
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}

export default NotreHistoireLink
