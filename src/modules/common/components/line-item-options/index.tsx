import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  item?: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

// Structure minimale des toppings dans les metadata
type ToppingMetadata = {
  variant_id: string
  quantity: number
}

const LineItemOptions = ({
  variant,
  item,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  // Obtenir les toppings depuis les metadata si disponibles
  const toppings = item?.metadata?.toppings as ToppingMetadata[] | undefined

  return (
    <div data-testid={dataTestid} data-value={dataValue}>
      <Text className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">
        Recette: {variant?.title}
      </Text>

      {/* Afficher les toppings s'ils existent */}
      {toppings && toppings.length > 0 && (
        <div className="mt-1">
          <Text className="txt-small text-ui-fg-subtle">Suppléments :</Text>
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

export default LineItemOptions
