import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  // Filtrer les collections pour exclure les collections de suppléments/toppings
  const filteredCollections = collections.filter((collection) => {
    const handle = collection.handle?.toLowerCase() || ""
    const title = collection.title?.toLowerCase() || ""

    // Exclure les collections liées aux toppings/suppléments
    return !(
      handle.includes("topping") ||
      handle.includes("supplement") ||
      title.includes("supplément") ||
      title.includes("ingrédient")
    )
  })

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={filteredCollections} region={region} />
        </ul>
      </div>
    </>
  )
}
