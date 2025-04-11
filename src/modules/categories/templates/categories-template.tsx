import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import { Container, Text, clx } from "@medusajs/ui"
import Image from "next/image"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { listProducts } from "@lib/data/products"
import CategoryThumbnail from "../components/category-thumbnail"

// Fonction pour récupérer la meilleure image pour une catégorie
const getCategoryBestImage = async (
  categoryId: string,
  countryCode: string
) => {
  try {
    // Récupérer jusqu'à 5 produits de la catégorie pour avoir plus de chances de trouver une bonne image
    const { response } = await listProducts({
      countryCode,
      queryParams: {
        category_id: [categoryId],
        limit: 5,
      },
    })

    const products = response.products

    if (!products || products.length === 0) return null

    // Parcourir les produits pour trouver la meilleure image
    for (const product of products) {
      // Préférer un produit avec une miniature
      if (product.thumbnail) {
        return product.thumbnail
      }

      // Sinon, prendre le premier produit avec des images
      if (product.images && product.images.length > 0) {
        return product.images[0].url
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching category image:", error)
    return null
  }
}

// Composant côté serveur pour la liste des catégories
const CategoriesTemplate = async ({ countryCode }: { countryCode: string }) => {
  const productCategories = await listCategories()

  // Filtrer pour n'avoir que les catégories principales, en excluant "toppings"
  const mainCategories = productCategories.filter(
    (category) => !category.parent_category && category.handle !== "toppings"
  )

  // Récupérer l'image pour chaque catégorie
  const categoriesWithImages = await Promise.all(
    mainCategories.map(async (category) => {
      const image = await getCategoryBestImage(category.id, countryCode)
      return {
        ...category,
        featuredImage: image,
      }
    })
  )

  return (
    <div className="flex flex-col items-center justify-center py-6 content-container">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-2xl-semi text-center">
          <h1>Nos produits</h1>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 gap-x-4 gap-y-8">
          {categoriesWithImages.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              featuredImage={category.featuredImage}
              handle={category.handle}
              countryCode={countryCode}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Composant carte de catégorie inspiré du ProductPreview
const CategoryCard = ({
  category,
  handle,
  countryCode,
  featuredImage,
}: {
  category: HttpTypes.StoreProductCategory
  handle: string
  countryCode: string
  featuredImage: string | null
}) => {
  return (
    <a
      href={`/${countryCode}/categories/${handle}`}
      className="no-underline text-inherit group"
    >
      <div
        data-testid="category-wrapper"
        className="transform transition-all duration-300 hover:scale-[1.03]"
      >
        <CategoryThumbnail category={category} featuredImage={featuredImage} />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle group-hover:text-ui-fg-base transition-colors duration-300">
            {category.name}
          </Text>
        </div>
      </div>
    </a>
  )
}

export default CategoriesTemplate
