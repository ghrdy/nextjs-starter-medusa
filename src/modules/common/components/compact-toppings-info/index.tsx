"use client"

import { useEffect, useState, useRef, memo } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ToppingMetadata, getToppings } from "@lib/util/cart-helpers"

// Structure minimale des toppings dans les metadata
// Supprimée car importée depuis cart-helpers

type CompactToppingsInfoProps = {
  item: HttpTypes.StoreCartLineItem
  closeCart: () => void
}

// Composant pour afficher les toppings en format compact sur plusieurs lignes
// Utilisation du memo pour éviter les re-rendus inutiles
const CompactToppingsInfo = memo(
  ({ item, closeCart }: CompactToppingsInfoProps) => {
    const toppings = getToppings(item)
    const [isUpdating, setIsUpdating] = useState(false)
    const lastToppingsRef = useRef<string>(JSON.stringify(toppings || []))

    // Vérifier si les toppings ont changé
    useEffect(() => {
      if (!toppings) return

      const currentToppingsStr = JSON.stringify(toppings || [])
      if (currentToppingsStr !== lastToppingsRef.current) {
        // Afficher brièvement un indicateur de mise à jour
        setIsUpdating(true)
        const timer = setTimeout(() => {
          setIsUpdating(false)
          lastToppingsRef.current = currentToppingsStr
        }, 1500)

        return () => clearTimeout(timer)
      }
    }, [toppings])

    if (!toppings || toppings.length === 0) {
      return null
    }

    return (
      <div className="text-xs text-gray-600 mb-2 overflow-hidden">
        <div className="flex items-center mb-1">
          <span className="font-medium">Suppléments:</span>
        </div>
        <div className="grid grid-cols-2 gap-x-1 gap-y-1">
          {toppings.map((t, i) => (
            <span key={i} className="truncate">
              {t.quantity}x {`Ingrédient ${i + 1}`}
            </span>
          ))}
        </div>
      </div>
    )
  }
)

// Définir un nom explicite pour le composant afin de faciliter le débogage
CompactToppingsInfo.displayName = "CompactToppingsInfo"

export default CompactToppingsInfo
