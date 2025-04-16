"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useEffect, useState, useRef, memo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ToppingMetadata,
  getToppings,
  hasToppings,
} from "@lib/util/cart-helpers"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  item?: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

// Utilisation de memo pour éviter les re-rendus inutiles
const LineItemOptions = memo(
  ({
    variant,
    item,
    "data-testid": dataTestid,
    "data-value": dataValue,
  }: LineItemOptionsProps) => {
    // Obtenir les toppings depuis les metadata si disponibles
    const toppings =
      item && "metadata" in item
        ? getToppings(item as HttpTypes.StoreCartLineItem)
        : undefined
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

    return (
      <div data-testid={dataTestid} data-value={dataValue}>
        {/* <Text className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">
        Recette: {variant?.title}
      </Text> */}

        {/* Afficher les toppings s'ils existent */}
        {toppings && toppings.length > 0 && (
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <Text className="txt-small text-ui-fg-subtle">Suppléments:</Text>
              {item && "product_handle" in item && (
                <LocalizedClientLink
                  href={`/products/${item.product_handle}?edit_toppings=true&line_item=${item.id}&redirect_to=cart`}
                  className={`ml-2 text-xs px-2 py-0.5 rounded-md transition-colors ${
                    isUpdating
                      ? "bg-green-100 text-green-700 animate-pulse"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  {isUpdating ? "Mis à jour..." : "Modifier"}
                </LocalizedClientLink>
              )}
            </div>
            <ul className="pl-2 mt-1">
              {toppings.map((topping, index) => (
                <li
                  key={index}
                  className="txt-small text-ui-fg-subtle flex justify-between"
                >
                  <span>
                    {topping.quantity}x{" "}
                    {
                      // Le titre doit maintenant être calculé par Medusa
                      // Si Medusa n'affiche pas cette information, utilisez un texte générique
                      `Ingrédient ${index + 1}`
                    }
                  </span>
                  {/* Les prix sont désormais calculés et gérés par Medusa */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

// Définir un nom explicite pour faciliter le débogage
LineItemOptions.displayName = "LineItemOptions"

export default LineItemOptions
