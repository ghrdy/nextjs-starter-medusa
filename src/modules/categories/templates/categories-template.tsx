import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import { Container, Text, clx } from "@medusajs/ui"
import Image from "next/image"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

// Composant côté serveur pour la liste des catégories
const CategoriesTemplate = async ({ countryCode }: { countryCode: string }) => {
  const productCategories = await listCategories()

  // Filtrer pour n'avoir que les catégories principales, en excluant "toppings"
  const mainCategories = productCategories.filter(
    (category) => !category.parent_category && category.handle !== "toppings"
  )

  return (
    <div className="flex flex-col items-center justify-center py-6 content-container">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-2xl-semi text-center">
          <h1>Nos catégories de produits</h1>
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 gap-x-4 gap-y-8">
          {mainCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
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
}: {
  category: HttpTypes.StoreProductCategory
  handle: string
  countryCode: string
}) => {
  return (
    <a
      href={`/${countryCode}/categories/${handle}`}
      className="no-underline text-inherit group"
    >
      <div data-testid="category-wrapper">
        <CategoryThumbnail category={category} />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle">{category.name}</Text>
        </div>
      </div>
    </a>
  )
}

// Composant thumbnail inspiré du Thumbnail des produits
const CategoryThumbnail = ({
  category,
}: {
  category: HttpTypes.StoreProductCategory
}) => {
  // Récupérer l'image d'un produit de la catégorie en utilisant la même logique que dans Thumbnail
  const getCategoryImage = () => {
    if (category.products && category.products.length > 0) {
      const firstProduct = category.products[0]
      // Essayer d'abord la miniature du produit, puis la première image
      return (
        firstProduct.thumbnail ||
        (firstProduct.images && firstProduct.images.length > 0
          ? firstProduct.images[0].url
          : null)
      )
    }
    return null
  }

  const categoryImage = getCategoryImage()

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        "aspect-[16/9]",
        "w-full"
      )}
    >
      {categoryImage ? (
        <Image
          src={categoryImage}
          alt={category.name}
          className="absolute inset-0 object-cover object-center"
          draggable={false}
          quality={50}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          fill
        />
      ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <PlaceholderImage size={24} />
        </div>
      )}
    </Container>
  )
}

export default CategoriesTemplate
