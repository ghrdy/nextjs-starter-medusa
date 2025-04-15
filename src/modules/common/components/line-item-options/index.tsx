import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  item?: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

// Type pour les toppings stockés dans les metadata
type ToppingMetadata = {
  id: string
  quantity: number
  title: string
  price: number
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
                  {topping.quantity}x {topping.title}
                </span>
                <span className="ml-2">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR", // Idéalement, cela devrait être dynamique
                  }).format((topping.price / 100) * topping.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LineItemOptions
