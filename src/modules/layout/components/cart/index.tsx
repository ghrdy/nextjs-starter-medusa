"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import LineItemOptions from "@modules/common/components/line-item-options"
import CompactToppingsInfo from "@modules/common/components/compact-toppings-info"
import { hasToppings } from "@lib/util/cart-helpers"

// Composant interne pour ImagePlaceholder
const ImagePlaceholder = ({ name = "" }: { name?: string }) => {
  const displayName = name ? name.charAt(0).toUpperCase() : "?"

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-medium">
      {displayName}
    </div>
  )
}

// Structure minimale des toppings dans les metadata
type ToppingMetadata = {
  variant_id: string
  quantity: number
}

// Fonction utilitaire pour vérifier si un élément du panier a des toppings
// Déplacée dans le fichier d'utilitaires pour éviter les problèmes HMR

const Cart = ({ cart: cartState }: { cart?: HttpTypes.StoreCart | null }) => {
  // Tous les hooks doivent être appelés inconditionnellement et toujours dans le même ordre
  const routeTransitionRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Utiliser un état local pour stocker le pathname et l'initialiser côté client uniquement
  const [pathname, setPathname] = useState("")

  // Mettre à jour le pathname après le montage, en utilisant window.location côté client uniquement
  useEffect(() => {
    if (!mounted) return
    // Only access window object after mounting (client-side only)
    setPathname(window.location.pathname)

    // Fonction pour mettre à jour le pathname lors des changements d'URL
    const handleLocationChange = () => {
      setPathname(window.location.pathname)
    }

    // Écouter les événements de navigation
    window.addEventListener("popstate", handleLocationChange)

    return () => {
      window.removeEventListener("popstate", handleLocationChange)
    }
  }, [mounted])

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0

  const [animateButton, setAnimateButton] = useState(false)
  const prevItemsCountRef = useRef<number>(totalItems || 0)

  // Ajout d'un délai pour éviter la réouverture accidentelle
  const toggleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTogglingRef = useRef<boolean>(false)

  // Vérification si on est sur une page de checkout ou sur la page du panier
  // Ces vérifications sont utilisées plus tard dans un rendu conditionnel
  const isCheckoutPage = mounted && pathname?.startsWith("/checkout")
  const isCartPage = mounted && pathname?.endsWith("/cart")

  // Fonction pour fermer le panier
  const closeCart = () => setIsOpen(false)

  // Fonction sécurisée pour basculer l'état du panier
  const handleToggleCart = useCallback(() => {
    // Si une transition de route est en cours ou si le composant n'est pas monté, ne rien faire
    if (routeTransitionRef.current || !mounted) {
      return
    }

    // Si une opération de basculement est déjà en cours, ne rien faire
    if (isTogglingRef.current) {
      return
    }

    // Marquer qu'une opération de basculement est en cours
    isTogglingRef.current = true

    // Basculer l'état du panier
    setIsOpen((prev) => !prev)

    // Définir un délai avant de permettre une autre opération de basculement
    if (toggleTimeoutRef.current) {
      clearTimeout(toggleTimeoutRef.current)
    }

    toggleTimeoutRef.current = setTimeout(() => {
      isTogglingRef.current = false
      toggleTimeoutRef.current = null
    }, 500) // Augmenter le délai pour éviter les clics rapides pendant les transitions
  }, [mounted])

  useEffect(() => {
    // Marquer le composant comme monté après le premier rendu
    setMounted(true)

    // Gérer les transitions de route
    const handleRouteChangeStart = () => {
      routeTransitionRef.current = true
    }

    // Simuler des écouteurs d'événements de routage
    window.addEventListener("beforeunload", handleRouteChangeStart)

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart)
    }
  }, [])

  // Déclencher l'animation lorsqu'un nouvel article est ajouté
  useEffect(() => {
    if (!mounted) return

    if (totalItems > prevItemsCountRef.current) {
      setAnimateButton(true)
      const timer = setTimeout(() => {
        setAnimateButton(false)
      }, 700) // Durée de l'animation

      return () => clearTimeout(timer)
    }
    prevItemsCountRef.current = totalItems
  }, [totalItems, mounted])

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (!mounted) return

    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen, mounted])

  // Close cart on escape key
  useEffect(() => {
    if (!mounted) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleToggleCart()
      }

      // Empêcher la touche espace de rouvrir le panier
      if (e.key === " " || e.key === "Spacebar") {
        if (isTogglingRef.current) {
          e.preventDefault()
        }
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, mounted, handleToggleCart])

  // Nettoyage des timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current)
      }
    }
  }, [])

  const handleQuantityChange = async (
    item: HttpTypes.StoreCartLineItem,
    newQuantity: number
  ) => {
    // Si une transition de route est en cours, ne rien faire
    if (routeTransitionRef.current || !mounted) {
      return
    }

    setIsLoading(true)
    try {
      if (newQuantity < 1) {
        await deleteLineItem(item.id)
      } else {
        await updateLineItem({
          lineId: item.id,
          quantity: newQuantity,
        })
      }
    } catch (error) {
      console.error("Error updating cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour supprimer un article
  const removeItem = async (itemId: string) => {
    if (routeTransitionRef.current || !mounted) {
      return
    }

    setIsLoading(true)
    try {
      await deleteLineItem(itemId)
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour fermer le panier sans risque de réouverture
  const handleCloseCart = (e: React.MouseEvent) => {
    // Si une transition de route est en cours, ne rien faire
    if (routeTransitionRef.current || !mounted) {
      return
    }

    e.stopPropagation() // Empêcher la propagation de l'événement
    closeCart() // Utiliser closeCart au lieu de toggleCart
  }

  // Après tous les hooks et avant le return principal, on peut ajouter notre condition
  // Si on est sur une page de checkout ou sur la page du panier, ne pas afficher le panier
  // Si le composant n'est pas monté, return null pour éviter le rendu serveur
  if (!mounted) {
    return null // Retour immédiat pendant le rendu serveur initial
  }

  // Après le montage, on peut vérifier en toute sécurité les chemins
  if (isCheckoutPage || isCartPage) {
    return null
  }

  return (
    <>
      {/* Floating cart button with longer animation durations */}
      <AnimatePresence mode="wait">
        {cartState?.items && cartState.items.length > 0 && !isOpen && (
          <motion.button
            className="fixed bottom-6 right-6 z-40 bg-black text-white rounded-xl shadow-lg p-4 flex items-center justify-center border border-white w-14 h-14"
            onClick={handleToggleCart}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{
              scale: animateButton ? [1, 1.2, 1] : 1,
              opacity: 1,
              y: 0,
              transition: animateButton
                ? {
                    scale: { duration: 0.5, times: [0, 0.5, 1] },
                    opacity: { duration: 0.3 },
                    y: { duration: 0.3 },
                  }
                : {
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    mass: 0.8,
                    duration: 0.5,
                  },
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 10,
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center justify-center">
              <FaShoppingCart size={24} />
              <motion.span
                className="absolute -top-3 -right-2 text-white text-xs font-bold flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{
                  scale: animateButton ? [1, 1.3, 1] : 1,
                  transition: animateButton
                    ? { duration: 0.3, times: [0, 0.5, 1] }
                    : { duration: 0.2 },
                }}
              >
                {totalItems}
              </motion.span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseCart}
            />

            {/* Cart panel */}
            <motion.div
              className="fixed right-6 bottom-6 h-[calc(100vh-3rem)] max-h-[80vh] w-[calc(100vw-3rem)] max-w-sm bg-white z-50 shadow-xl flex flex-col rounded-xl overflow-hidden"
              initial={{
                width: "56px",
                height: "56px",
                borderRadius: "0.75rem",
                right: "24px",
                bottom: "24px",
                opacity: 0.9,
                overflow: "hidden",
                scale: 0.95,
              }}
              animate={{
                width: "calc(100vw - 3rem)",
                height: "calc(100vh - 3rem)",
                maxWidth: "24rem",
                maxHeight: "80vh",
                borderRadius: "0.75rem",
                right: "24px",
                bottom: "24px",
                opacity: 1,
                overflow: "hidden",
                scale: 1,
              }}
              exit={{
                width: "56px",
                height: "56px",
                borderRadius: "0.75rem",
                right: "24px",
                bottom: "24px",
                opacity: 0,
                overflow: "hidden",
                scale: 0.95,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                mass: 0.8,
                duration: 0.4,
              }}
              onClick={(e) => e.stopPropagation()} // Empêcher la propagation des clics
            >
              {/* Header */}
              <motion.div
                className="p-4 flex justify-between items-center bg-white w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold flex items-center text-black">
                  <FaShoppingCart className="mr-2 text-black" />
                  Votre panier
                </h2>
                <button
                  onClick={handleCloseCart}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors text-black"
                  aria-label="Fermer le panier"
                >
                  <FaTimes size={20} />
                </button>
              </motion.div>

              {/* Cart items */}
              <motion.div
                className="flex-1 overflow-y-auto p-4 bg-white border-t border-gray-200 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                {!cartState?.items || cartState.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <p className="text-lg text-black mb-4">
                      Votre panier est vide
                    </p>
                    <button
                      onClick={handleCloseCart}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Continuer vos achats
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {cartState.items
                      .sort((a, b) => {
                        return (a.created_at ?? "") > (b.created_at ?? "")
                          ? -1
                          : 1
                      })
                      .map((item) => {
                        return (
                          <motion.li
                            key={item.id}
                            className="flex gap-3 p-3 bg-gray-50 rounded-xl overflow-hidden"
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: "spring" }}
                          >
                            {/* Item image */}
                            <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              {/* Utiliser thumbnail ou première image disponible */}
                              {!item.thumbnail &&
                              (!item.variant?.product?.images ||
                                item.variant?.product?.images.length === 0) ? (
                                <div className="absolute inset-0">
                                  <ImagePlaceholder name={item.title} />
                                </div>
                              ) : (
                                <Image
                                  src={
                                    item.thumbnail ||
                                    (item.variant?.product?.images &&
                                    item.variant?.product?.images.length > 0
                                      ? item.variant.product.images[0].url
                                      : "")
                                  }
                                  alt={item.title}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                  priority={true}
                                  onError={(e) => {
                                    // Masquer l'image en cas d'erreur et afficher le placeholder
                                    const target = e.target as HTMLImageElement
                                    target.style.display = "none"
                                    console.error(
                                      `Erreur de chargement d'image dans le panier: ${item.thumbnail}`
                                    )

                                    // Afficher le placeholder en cas d'erreur
                                    const parent = target.parentElement
                                    if (parent) {
                                      const placeholder =
                                        document.createElement("div")
                                      placeholder.className = "absolute inset-0"
                                      placeholder.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-medium">${item.title.charAt(
                                        0
                                      )}</div>`
                                      parent.appendChild(placeholder)
                                    }
                                  }}
                                />
                              )}
                            </div>

                            {/* Item details */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-black truncate mr-1">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>

                                {/* Bouton Modifier (seulement s'il y a des toppings) */}
                                {hasToppings(item) && (
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}?edit_toppings=true&line_item=${item.id}&redirect_to=cart`}
                                    onClick={closeCart}
                                    className="ml-2 text-xs px-2 py-0.5 rounded-md transition-colors bg-gray-200 hover:bg-gray-300 text-gray-700 flex-shrink-0"
                                  >
                                    Modifier
                                  </LocalizedClientLink>
                                )}
                              </div>
                              {item.variant && (
                                <p className="text-sm text-gray-500 mt-1 truncate">
                                  {item.variant.options
                                    ?.map((option) => option.value)
                                    .join(", ")}
                                </p>
                              )}

                              {/* Affichage des toppings en format compact */}
                              <CompactToppingsInfo
                                item={item}
                                closeCart={closeCart}
                              />

                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleQuantityChange(
                                        item,
                                        item.quantity - 1
                                      )
                                    }}
                                    className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors border border-gray-300 shadow-sm"
                                    aria-label="Diminuer la quantité"
                                    disabled={isLoading}
                                  >
                                    <FaMinus size={14} className="text-black" />
                                  </button>
                                  <span className="w-8 text-center font-medium text-black text-base">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleQuantityChange(
                                        item,
                                        item.quantity + 1
                                      )
                                    }}
                                    className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors border border-gray-300 shadow-sm"
                                    aria-label="Augmenter la quantité"
                                    disabled={isLoading}
                                  >
                                    <FaPlus size={14} className="text-black" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  <span className="font-medium text-black whitespace-nowrap">
                                    {convertToLocale({
                                      amount: item.total || 0,
                                      currency_code: cartState.currency_code,
                                    })}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeItem(item.id)
                                    }}
                                    className="p-2.5 text-red-500 hover:text-red-700 transition-colors hover:bg-red-50 rounded-lg"
                                    aria-label="Supprimer l'article"
                                    disabled={isLoading}
                                  >
                                    <FaTrash size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        )
                      })}
                  </ul>
                )}
              </motion.div>

              {/* Footer */}
              {cartState?.items && cartState.items.length > 0 && (
                <motion.div
                  className="p-4 border-t border-gray-200 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  {/* Bouton pour ajouter des articles */}
                  <div className="mb-4">
                    <LocalizedClientLink
                      href="/store"
                      className="text-sm text-gray-600 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
                      onClick={closeCart}
                    >
                      <FaPlus className="mr-2" />
                      Ajouter des articles
                    </LocalizedClientLink>
                  </div>

                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-black">Total</span>
                    <span className="font-bold text-black">
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <LocalizedClientLink
                    href="/cart"
                    className="block w-full py-3 bg-black text-white text-center rounded-xl font-medium hover:bg-gray-800 transition-all transform hover:scale-[1.02] flex items-center justify-center relative"
                    onClick={closeCart}
                  >
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      </div>
                    ) : null}
                    <div
                      className={`flex items-center justify-center ${
                        isLoading ? "opacity-0" : ""
                      }`}
                    >
                      <FaShoppingCart className="mr-2" />
                      <span>Commander</span>
                    </div>
                  </LocalizedClientLink>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Cart
