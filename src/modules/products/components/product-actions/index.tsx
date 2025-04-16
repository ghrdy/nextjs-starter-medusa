"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import ProductToppings, {
  ToppingSelection,
  ProductToppingsRef,
} from "../product-toppings"
import { retrieveCart, updateLineItem, deleteLineItem } from "@lib/data/cart"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState<ToppingSelection[]>(
    []
  )
  const countryCode = useParams().countryCode as string
  const searchParams = useSearchParams()

  // Déterminer si nous sommes en mode édition d'un élément du panier
  const isEditMode = searchParams.get("edit_toppings") === "true"
  const lineItemId = searchParams.get("line_item")

  // État pour stocker l'élément du panier à éditer
  const [lineItem, setLineItem] = useState<HttpTypes.StoreCartLineItem | null>(
    null
  )
  const [initialToppings, setInitialToppings] = useState<
    { variant_id: string; quantity: number }[]
  >([])

  // Référence au composant ProductToppings pour pouvoir appeler ses méthodes
  const toppingsRef = useRef<ProductToppingsRef>(null)

  // Récupérer l'élément du panier et ses toppings si on est en mode édition
  useEffect(() => {
    const fetchCartItem = async () => {
      if (isEditMode && lineItemId) {
        try {
          const cartData = await retrieveCart()
          if (cartData?.items) {
            const item = cartData.items.find(
              (i: HttpTypes.StoreCartLineItem) => i.id === lineItemId
            )
            if (item) {
              setLineItem(item)

              // Récupérer les toppings existants
              const toppings = item.metadata?.toppings as
                | { variant_id: string; quantity: number }[]
                | undefined
              if (toppings && toppings.length > 0) {
                setInitialToppings(toppings)
              }

              // Définir les options du produit selon la variante
              if (item.variant?.id) {
                const variantOptions = optionsAsKeymap(item.variant.options)
                setOptions(variantOptions ?? {})
              }
            }
          }
        } catch (error) {
          console.error("Error fetching cart item:", error)
        }
      }
    }

    fetchCartItem()
  }, [isEditMode, lineItemId, countryCode])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Gestionnaire pour les changements de toppings
  const handleToppingsChange = (toppings: ToppingSelection[]) => {
    setSelectedToppings(toppings)
  }

  // Mettre à jour l'élément du panier avec les nouveaux toppings
  const handleUpdateCartItem = async () => {
    if (!lineItemId || !selectedVariant?.id) return

    setIsAdding(true)

    // Préparer les données des toppings pour les metadata
    const toppingsData =
      selectedToppings.length > 0
        ? {
            toppings: selectedToppings.map((topping) => ({
              variant_id: topping.variantId,
              quantity: topping.quantity,
            })),
          }
        : undefined

    try {
      // Supprimer l'ancien élément
      await deleteLineItem(lineItemId)

      // Ajouter un nouvel élément avec les mêmes paramètres mais des toppings différents
      await addToCart({
        variantId: selectedVariant.id,
        quantity: lineItem?.quantity || 1,
        countryCode,
        metadata: toppingsData,
      })

      // Vérifier si une redirection spécifique est demandée
      const redirectTo = searchParams.get("redirect_to")

      // Remplacer l'entrée actuelle dans l'historique par la page produit sans paramètres
      // Cela permet d'éviter de revenir à la page d'édition quand on fait retour
      const productUrl = `/${countryCode}/products/${product.handle}`
      window.history.replaceState(null, "", productUrl)

      // Rediriger vers la page appropriée
      if (redirectTo === "cart") {
        window.location.href = `/${countryCode}/cart`
      } else {
        window.location.href = `/${countryCode}/cart`
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
    } finally {
      setIsAdding(false)
    }
  }

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    // Préparer les données des toppings pour les metadata, sans prix
    const toppingsData =
      selectedToppings.length > 0
        ? {
            toppings: selectedToppings.map((topping) => ({
              variant_id: topping.variantId,
              quantity: topping.quantity,
              // Ne pas envoyer price et title, Medusa calculera les prix
            })),
          }
        : undefined

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      metadata: toppingsData,
    })

    // Réinitialiser les toppings après l'ajout au panier
    if (toppingsRef.current) {
      toppingsRef.current.clearToppings()
    }

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {isEditMode ? (
          <Button
            onClick={handleUpdateCartItem}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="w-full h-10"
            isLoading={isAdding}
          >
            Mettre à jour le panier
          </Button>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="w-full h-10"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant && !options
              ? "Choisir une variante"
              : !inStock || !isValidVariant
              ? "Victime de son succès"
              : "Ajouter au panier"}
          </Button>
        )}

        {/* Toppings selector for pizzas */}
        <ProductToppings
          ref={toppingsRef}
          product={product}
          region={region}
          onToppingsChange={handleToppingsChange}
          initialToppings={initialToppings}
          editMode={isEditMode}
          lineItemId={lineItemId || undefined}
          autoUpdate={isEditMode}
        />

        {!isEditMode && (
          <MobileActions
            product={product}
            variant={selectedVariant}
            options={options}
            updateOptions={setOptionValue}
            inStock={inStock}
            handleAddToCart={handleAddToCart}
            isAdding={isAdding}
            show={!inView}
            optionsDisabled={!!disabled || isAdding}
          />
        )}
      </div>
    </>
  )
}
