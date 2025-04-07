"use client"

import { useEffect } from "react"
import { getRegion } from "@lib/data/regions"
import { getOrSetCart } from "@lib/data/cart"

/**
 * Composant qui initialise le panier au chargement de l'application
 * À placer dans le layout principal
 */
export default function CartInitializer() {
  useEffect(() => {
    const initialize = async () => {
      try {
        // Obtenir le code de pays depuis l'URL ou utiliser une valeur par défaut
        const countryCode = window.location.pathname.split("/")[1] || "fr"

        // Vérifier si un panier existe déjà ou en créer un nouveau
        await getOrSetCart(countryCode)
        console.log("Panier initialisé avec succès")
      } catch (error) {
        console.error("Erreur lors de l'initialisation du panier:", error)
      }
    }

    initialize()
  }, [])

  // Ce composant ne rend rien visuellement
  return null
}
