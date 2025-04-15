"use client"

import { listProducts } from "@lib/data/products"
import { addToCart } from "@lib/data/cart"
import { Button } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

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
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false)
  const [toppingCategories, setToppingCategories] = useState<ToppingCategory[]>(
    []
  )
  const countryCode = useParams().countryCode as string

  // Pour le moment, affichons le composant pour tous les produits
  // pour tester si ça fonctionne correctement
  const isPizza = true

  // Uncomment this for production use:
  /*
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
  */

  // Désactivé temporairement pour tester
  // if (!isPizza) {
  //   return null
  // }

  useEffect(() => {
    const fetchToppings = async () => {
      setIsLoading(true)
      try {
        // Find collections by handle
        const ingredientsCollection = "toppings-ingredients"
        const meatCollection = "toppings-viande"

        // Fetch all toppings using a general query
        const toppingsResult = await listProducts({
          queryParams: {},
          countryCode,
        })

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
      } catch (error) {
        console.error("Error fetching toppings:", error)
      } finally {
        setIsLoading(false)
      }
    }

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

  const openToppings = () => {
    // Sur mobile, ouvrir la modale. Sur desktop, développer la section
    if (window.innerWidth < 768) {
      setIsMobileModalOpen(true)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const closeMobileModal = () => {
    setIsMobileModalOpen(false)
  }

  // Composant pour afficher la liste des toppings
  const ToppingsList = () => (
    <>
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
    </>
  )

  return (
    <div className="mt-2">
      <Button
        variant="secondary"
        className="w-full h-10"
        onClick={openToppings}
      >
        Ajouter des ingrédients
      </Button>

      {/* Affichage desktop : section extensible */}
      {isExpanded && (
        <div className="mt-4 border rounded-lg p-4 max-h-80 overflow-y-auto hidden md:block">
          <ToppingsList />
        </div>
      )}

      {/* Modale mobile plein écran */}
      <Transition appear show={isMobileModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeMobileModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel className="w-full h-screen transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all flex flex-col">
                  <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
                    <Dialog.Title as="h3" className="text-lg font-medium">
                      Ajouter des ingrédients
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-full p-2 hover:bg-gray-100"
                      onClick={closeMobileModal}
                    >
                      <span className="sr-only">Fermer</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <ToppingsList />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
