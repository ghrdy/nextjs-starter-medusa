import { Metadata } from "next"
import CategoriesTemplate from "@modules/categories/templates/categories-template"

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
  return <CategoriesTemplate countryCode={params.countryCode} />
}
