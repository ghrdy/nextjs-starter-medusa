import { Metadata } from "next"
import { Suspense } from "react"
import CategoriesTemplate from "@modules/categories/templates/categories-template"
import CategoriesLoading from "@modules/categories/components/loading"

export const metadata: Metadata = {
  title: "Commander",
  description: "Découvrez nos différentes catégories de produits.",
}

type Params = {
  params: {
    countryCode: string
  }
}

export default async function CommanderPage({ params }: Params) {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesTemplate countryCode={params.countryCode} />
    </Suspense>
  )
}
