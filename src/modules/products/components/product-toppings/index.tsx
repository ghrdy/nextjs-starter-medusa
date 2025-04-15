"use client"

import { listProducts } from "@lib/data/products"
import { addToCart } from "@lib/data/cart"
import { Button } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type ProductToppingsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

type ToppingCategory = {
  title: string
  handle: string
  products: HttpTypes.StoreProduct[]
}

export default function ProductToppings({
  product,
  region,
}: ProductToppingsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTopping, setIsAddingTopping] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [toppingCategories, setToppingCategories] = useState<ToppingCategory[]>(
    []
  )
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const countryCode = useParams().countryCode as string

  // Plus de logs pour comprendre la détection des pizzas
  console.log("Product data:", {
    title: product.title,
    handle: product.handle,
    collection: product.collection?.handle,
    collectionTitle: product.collection?.title,
    categories: product.categories?.map((c) => c.handle),
    tags: product.tags?.map((t) => t.value),
  })

  // Condition plus permissive pour détecter les pizzas
  const isPizza =
    product.collection?.handle?.includes("pizza") ||
    product.collection?.title?.toLowerCase().includes("pizza") ||
    product.categories?.some(
      (cat) =>
        cat.handle?.includes("pizza") ||
        cat.name?.toLowerCase().includes("pizza")
    ) ||
    product.tags?.some((tag) => tag.value?.toLowerCase().includes("pizza")) ||
    product.title?.toLowerCase().includes("pizza") ||
    product.handle?.includes("pizza")

  console.log("Is pizza product?", isPizza)

  // Pour test: toujours afficher le composant
  // if (!isPizza) {
  //   return null
  // }

  useEffect(() => {
    const fetchToppings = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching toppings...")
        // Find collections by handle
        const ingredientsCollection = "toppings-ingredients"
        const meatCollection = "toppings-viande"

        // Fetch all toppings using a general query
        const toppingsResult = await listProducts({
          queryParams: {},
          countryCode,
        })

        console.log("All products:", toppingsResult.response.products.length)
        console.log(
          "Sample product collections:",
          toppingsResult.response.products.slice(0, 5).map((p) => ({
            title: p.title,
            collection: p.collection?.handle,
            collectionTitle: p.collection?.title,
          }))
        )

        // Filter toppings by collection handle
        const allToppings = toppingsResult.response.products.filter(
          (p) =>
            !p.is_giftcard &&
            (p.collection?.handle === ingredientsCollection ||
              p.collection?.handle === meatCollection ||
              // Also look for collection titles as fallbacks
              p.collection?.title === "Suppléments Ingrédients" ||
              p.collection?.title === "Suppléments Viandes")
        )

        console.log("Found toppings:", allToppings.length)

        // Separate by category
        const ingredientToppings = allToppings.filter(
          (p) =>
            p.collection?.handle === ingredientsCollection ||
            p.collection?.title === "Suppléments Ingrédients"
        )

        const meatToppings = allToppings.filter(
          (p) =>
            p.collection?.handle === meatCollection ||
            p.collection?.title === "Suppléments Viandes"
        )

        console.log("Ingredients toppings:", ingredientToppings.length)
        console.log("Meat toppings:", meatToppings.length)

        setToppingCategories([
          {
            title: "Ingrédients",
            handle: ingredientsCollection,
            products: ingredientToppings,
          },
          {
            title: "Viandes",
            handle: meatCollection,
            products: meatToppings,
          },
        ])

        // Save debug info
        setDebugInfo({
          allProducts: toppingsResult.response.products.length,
          allToppings: allToppings.length,
          ingredients: ingredientToppings.length,
          meat: meatToppings.length,
        })
      } catch (error) {
        console.error("Error fetching toppings:", error)
        setDebugInfo({ error: String(error) })
      } finally {
        setIsLoading(false)
      }
    }

    // Toujours charger les toppings pour débogage
    fetchToppings()
  }, [countryCode])

  const handleAddTopping = async (toppingVariantId: string) => {
    if (!toppingVariantId) return

    setIsAddingTopping(toppingVariantId)

    try {
      await addToCart({
        variantId: toppingVariantId,
        quantity: 1,
        countryCode,
      })
    } catch (error) {
      console.error("Error adding topping to cart:", error)
    } finally {
      setIsAddingTopping(null)
    }
  }

  return (
    <div className="mt-2">
      {/* Debug info */}
      {debugInfo && (
        <div className="text-xs text-gray-500 mb-2">
          {JSON.stringify(debugInfo)}
        </div>
      )}

      <Button
        variant="secondary"
        className="w-full h-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Masquer les ingrédients" : "Ajouter des ingrédients"}
      </Button>

      {isExpanded && (
        <div className="mt-4 border rounded-lg p-4 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : toppingCategories.every((cat) => cat.products.length === 0) ? (
            <div className="text-center py-4">Aucun supplément disponible</div>
          ) : (
            <div className="flex flex-col gap-y-6">
              {toppingCategories
                .filter((cat) => cat.products.length > 0)
                .map((category) => (
                  <div key={category.handle} className="flex flex-col gap-y-2">
                    <h3 className="font-medium text-base">{category.title}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {category.products.map((topping) => {
                        const toppingVariant = topping.variants?.[0]
                        const price = toppingVariant?.calculated_price ?? 0
                        const formattedPrice = new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: region.currency_code,
                        }).format(Number(price) / 100)

                        return (
                          <div
                            key={topping.id}
                            className="flex items-center justify-between p-2 border-b"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm">{topping.title}</span>
                              <span className="text-xs text-ui-fg-subtle">
                                {formattedPrice}
                              </span>
                            </div>
                            <Button
                              variant="secondary"
                              size="small"
                              isLoading={isAddingTopping === toppingVariant?.id}
                              onClick={() =>
                                handleAddTopping(toppingVariant?.id ?? "")
                              }
                            >
                              +
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
