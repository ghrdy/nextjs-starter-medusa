import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Paramètres de requête pour trouver des produits similaires
  const queryParams: Record<string, any> = {}

  if (region?.id) {
    queryParams.region_id = region.id
  }

  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }

  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }

  // Exclure les cartes-cadeaux
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter((responseProduct) => {
      // Exclure le produit actuel
      if (responseProduct.id === product.id) {
        return false
      }

      // Exclure les produits de la catégorie "Toppings"
      if (
        responseProduct.categories?.some(
          (category) =>
            category.name.toLowerCase() === "toppings" ||
            category.handle === "toppings"
        )
      ) {
        return false
      }

      // Exclure les produits des collections spécifiques liées aux suppléments
      if (
        responseProduct.collection?.title === "Suppléments Viandes" ||
        responseProduct.collection?.title === "Suppléments Ingrédients" ||
        responseProduct.collection?.handle === "toppings-viande" ||
        responseProduct.collection?.handle === "toppings-ingredients"
      ) {
        return false
      }

      return true
    })
  })

  // Si aucun produit n'est trouvé après filtrage, ne pas afficher la section
  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6"></span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          Vous pourriez aussi aimer ces produits.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.slice(0, 4).map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
