import { HttpTypes } from "@medusajs/types"

// Structure minimale des toppings dans les metadata
export type ToppingMetadata = {
  variant_id: string
  quantity: number
}

/**
 * Vérifie si un élément du panier contient des toppings
 * @param item - L'élément du panier à vérifier
 * @returns true si l'élément contient des toppings, false sinon
 */
export const hasToppings = (item: HttpTypes.StoreCartLineItem): boolean => {
  if (!item?.metadata?.toppings) return false;
  
  const toppings = item.metadata.toppings as ToppingMetadata[] | undefined;
  return Boolean(toppings && Array.isArray(toppings) && toppings.length > 0);
};

/**
 * Obtient les toppings d'un élément du panier
 * @param item - L'élément du panier
 * @returns Un tableau de toppings ou undefined si aucun n'est trouvé
 */
export const getToppings = (item: HttpTypes.StoreCartLineItem): ToppingMetadata[] | undefined => {
  if (!hasToppings(item)) return undefined;
  return item.metadata?.toppings as ToppingMetadata[];
}; 