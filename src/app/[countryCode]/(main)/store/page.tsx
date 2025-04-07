import { Metadata } from "next"
import { redirect } from "next/navigation"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  params: {
    countryCode: string
  }
}

export default async function StorePage({ params }: Params) {
  // Rediriger vers la page commander
  redirect(`/${params.countryCode}/commander`)
}
