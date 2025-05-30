"use client"

import { listProducts } from "@lib/data/products"
import { addToCart, updateLineItemMetadata } from "@lib/data/cart"
import { Button } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react"
import { useParams } from "next/navigation"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

type ProductToppingsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  onToppingsChange?: (toppings: ToppingSelection[]) => void
  initialToppings?: { variant_id: string; quantity: number }[]
  editMode?: boolean
  lineItemId?: string
  autoUpdate?: boolean
}

// Pour exposer des méthodes au parent
export type ProductToppingsRef = {
  clearToppings: () => void
}

type ToppingCategory = {
  title: string
  handle: string
  products: HttpTypes.StoreProduct[]
}

// Structure pour suivre les quantités de toppings
type ToppingQuantities = {
  [variantId: string]: number
}

// Représentation d'un topping sélectionné
export type ToppingSelection = {
  variantId: string
  quantity: number
  title: string
  price: number
}

// Fonction d'aide pour extraire le prix correctement
const extractPrice = (priceData: any): number => {
  if (typeof priceData === "number") {
    return priceData
  }

  if (typeof priceData === "string") {
    return parseFloat(priceData)
  }

  if (priceData && typeof priceData === "object") {
    // Vérifier si calculated_amount existe (nouvelle structure)
    if ("calculated_amount" in priceData) {
      return typeof priceData.calculated_amount === "number"
        ? priceData.calculated_amount
        : parseFloat(priceData.calculated_amount)
    }

    // Fallback sur d'autres propriétés
    if ("amount" in priceData) {
      return typeof priceData.amount === "number"
        ? priceData.amount
        : parseFloat(priceData.amount)
    }
  }

  return 0 // Valeur par défaut si aucune extraction n'est possible
}

export default forwardRef<ProductToppingsRef, ProductToppingsProps>(
  function ProductToppings(
    {
      product,
      region,
      onToppingsChange,
      initialToppings,
      editMode,
      lineItemId,
      autoUpdate = false,
    },
    ref
  ) {
    const [isLoading, setIsLoading] = useState(true)
    const [isExpanded, setIsExpanded] = useState(editMode || false)
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(
      editMode || false
    )
    const [isMobile, setIsMobile] = useState(false)
    const [toppingCategories, setToppingCategories] = useState<
      ToppingCategory[]
    >([])
    // Suivi des quantités de toppings sélectionnés localement
    const [toppingQuantities, setToppingQuantities] =
      useState<ToppingQuantities>({})
    const countryCode = useParams().countryCode as string
    const [updatingCart, setUpdatingCart] = useState(false)

    // Référence pour stocker la dernière valeur des toppings sélectionnés
    const toppingsRef = useRef<string | null>(null)

    // Référence pour gérer le debounce des mises à jour
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Exposer la méthode de reset des toppings au parent
    useImperativeHandle(ref, () => ({
      clearToppings: () => {
        setToppingQuantities({})
        // Si la section est développée, la réduire
        setIsExpanded(false)
        // Si la modale est ouverte, la fermer seulement si on est sur mobile
        if (isMobile) {
          setIsMobileModalOpen(false)
        }
      },
    }))

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

    // Calculer le nombre total de toppings sélectionnés
    const totalToppingsSelected = Object.values(toppingQuantities).reduce(
      (sum, quantity) => sum + quantity,
      0
    )

    // Initialiser les toppings à partir des données existantes si disponibles
    useEffect(() => {
      if (initialToppings && initialToppings.length > 0) {
        const initialQuantities: ToppingQuantities = {}
        initialToppings.forEach((t) => {
          if (t.quantity > 0) {
            initialQuantities[t.variant_id] = t.quantity
          }
        })

        if (Object.keys(initialQuantities).length > 0) {
          setToppingQuantities(initialQuantities)
          // Développer automatiquement le sélecteur de toppings en mode édition
          if (editMode) {
            setIsExpanded(true)
            if (isMobile) {
              setIsMobileModalOpen(true)
            }
          }
        }
      }
    }, [initialToppings, editMode, isMobile])

    // Notifier le parent lorsque les toppings changent
    useEffect(() => {
      if (onToppingsChange) {
        const selectedToppings: ToppingSelection[] = []

        // Parcourir toutes les catégories de toppings
        toppingCategories.forEach((category) => {
          category.products.forEach((topping) => {
            const toppingVariant = topping.variants?.[0]
            if (toppingVariant?.id) {
              const quantity = toppingQuantities[toppingVariant.id] || 0

              if (quantity > 0) {
                // Utiliser la fonction d'extraction de prix
                const price = extractPrice(toppingVariant.calculated_price)

                selectedToppings.push({
                  variantId: toppingVariant.id,
                  quantity,
                  title: topping.title || "Topping",
                  price,
                })
              }
            }
          })
        })

        // Utiliser JSON.stringify pour comparer les valeurs précédentes avec les nouvelles
        // afin d'éviter les mises à jour inutiles
        const toppingsJSON = JSON.stringify(selectedToppings)

        // Stocker la dernière valeur JSON pour comparaison
        if (!toppingsRef.current || toppingsRef.current !== toppingsJSON) {
          toppingsRef.current = toppingsJSON
          onToppingsChange(selectedToppings)
        }
      }
    }, [toppingQuantities, toppingCategories])

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

    // Mise à jour automatique du panier avec les nouveaux toppings
    useEffect(() => {
      // Si l'auto-update n'est pas activé ou si on n'est pas en mode édition, ne rien faire
      if (!autoUpdate || !editMode || !lineItemId) return

      // Si nous avons un timeout en cours, l'annuler
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }

      // Créer un nouveau timeout pour debounce
      updateTimeoutRef.current = setTimeout(async () => {
        try {
          if (toppingCategories.length === 0) return // Si les catégories ne sont pas chargées, on attend

          setUpdatingCart(true)

          // Préparer les données des toppings pour les metadata
          const selectedToppings: ToppingSelection[] = []

          // Parcourir toutes les catégories de toppings
          toppingCategories.forEach((category) => {
            category.products.forEach((topping) => {
              const toppingVariant = topping.variants?.[0]
              if (toppingVariant?.id) {
                const quantity = toppingQuantities[toppingVariant.id] || 0

                if (quantity > 0) {
                  const price = extractPrice(toppingVariant.calculated_price)

                  selectedToppings.push({
                    variantId: toppingVariant.id,
                    quantity,
                    title: topping.title || "Topping",
                    price,
                  })
                }
              }
            })
          })

          // Format pour les métadonnées
          const toppingsData = {
            toppings: selectedToppings.map((topping) => ({
              variant_id: topping.variantId,
              quantity: topping.quantity,
            })),
          }

          // Mettre à jour les métadonnées de l'article
          await updateLineItemMetadata({
            lineId: lineItemId,
            metadata: toppingsData,
          })
        } catch (error) {
          console.error("Error updating cart with new toppings:", error)
        } finally {
          setUpdatingCart(false)
        }
      }, 1000) // Attendre 1 seconde après la dernière modification

      // Nettoyer le timeout lors du démontage
      return () => {
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current)
        }
      }
    }, [toppingQuantities, toppingCategories, lineItemId, editMode, autoUpdate])

    // Ajouter un topping localement (sans l'ajouter au panier pour l'instant)
    const handleAddTopping = (toppingVariantId: string) => {
      if (!toppingVariantId) return

      // Mettre à jour le compteur localement
      setToppingQuantities((prev) => {
        const currentQuantity = prev[toppingVariantId] || 0
        return {
          ...prev,
          [toppingVariantId]: currentQuantity + 1,
        }
      })
    }

    // Enlever un topping localement
    const handleRemoveTopping = (toppingVariantId: string) => {
      if (!toppingVariantId) return

      const currentQuantity = toppingQuantities[toppingVariantId] || 0
      if (currentQuantity === 0) return

      // Mettre à jour le compteur localement
      setToppingQuantities((prev) => {
        const updatedQuantity = Math.max(0, (prev[toppingVariantId] || 0) - 1)
        if (updatedQuantity === 0) {
          const { [toppingVariantId]: _, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [toppingVariantId]: updatedQuantity,
        }
      })
    }

    // Supprimer complètement un topping
    const handleDeleteTopping = (toppingVariantId: string) => {
      if (!toppingVariantId) return

      const currentQuantity = toppingQuantities[toppingVariantId] || 0
      if (currentQuantity === 0) return

      // Supprimer du state local
      setToppingQuantities((prev) => {
        const { [toppingVariantId]: _, ...rest } = prev
        return rest
      })
    }

    // Detect if we're on mobile
    useEffect(() => {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      // Check initially
      checkIfMobile()

      // Add event listener for resize
      window.addEventListener("resize", checkIfMobile)

      // Cleanup
      return () => {
        window.removeEventListener("resize", checkIfMobile)
      }
    }, [])

    // Adjust displays when mobile state changes
    useEffect(() => {
      // If switching to mobile but expanded on desktop, switch to mobile modal
      if (isMobile && isExpanded) {
        setIsExpanded(false)
        setIsMobileModalOpen(true)
      }

      // If switching to desktop but mobile modal is open, switch to expanded desktop
      if (!isMobile && isMobileModalOpen) {
        setIsMobileModalOpen(false)
        setIsExpanded(true)
      }
    }, [isMobile])

    const openToppings = () => {
      // Sur mobile, ouvrir la modale. Sur desktop, développer la section
      if (isMobile) {
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
                      const variantId = toppingVariant?.id ?? ""
                      const quantity = toppingQuantities[variantId] || 0

                      // Utiliser la fonction d'extraction de prix
                      const price = extractPrice(
                        toppingVariant?.calculated_price
                      )

                      const formattedPrice = new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: region.currency_code,
                      }).format(price)

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
                          <div className="flex items-center space-x-2">
                            {quantity > 0 && (
                              <>
                                <Button
                                  variant="secondary"
                                  size="small"
                                  className="h-8 w-8 flex items-center justify-center p-0"
                                  onClick={() => handleRemoveTopping(variantId)}
                                >
                                  -
                                </Button>
                                <span className="text-sm w-6 text-center">
                                  {quantity}
                                </span>
                                <Button
                                  variant="secondary"
                                  size="small"
                                  className="h-8 w-8 flex items-center justify-center p-0"
                                  onClick={() => handleAddTopping(variantId)}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="danger"
                                  size="small"
                                  className="h-8 w-8 flex items-center justify-center p-0 ml-1"
                                  onClick={() => handleDeleteTopping(variantId)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </Button>
                              </>
                            )}
                            {quantity === 0 && (
                              <Button
                                variant="secondary"
                                size="small"
                                onClick={() => handleAddTopping(variantId)}
                              >
                                +
                              </Button>
                            )}
                          </div>
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
          {totalToppingsSelected > 0
            ? `${totalToppingsSelected} supplément${
                totalToppingsSelected > 1 ? "s" : ""
              } sélectionné${totalToppingsSelected > 1 ? "s" : ""}`
            : "Ajouter des ingrédients"}
        </Button>

        {/* Affichage desktop : section extensible */}
        {isExpanded && !isMobile && (
          <div className="mt-4 border rounded-lg p-4 max-h-80 overflow-y-auto md:block">
            <ToppingsList />
          </div>
        )}

        {/* Modale mobile plein écran */}
        {isMobile && (
          <Transition appear show={isMobileModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={closeMobileModal}
            >
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
                          {totalToppingsSelected > 0
                            ? `${totalToppingsSelected} supplément${
                                totalToppingsSelected > 1 ? "s" : ""
                              } sélectionné${
                                totalToppingsSelected > 1 ? "s" : ""
                              }`
                            : "Ajouter des ingrédients"}
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
        )}
      </div>
    )
  }
)
