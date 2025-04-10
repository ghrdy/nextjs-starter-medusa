import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Adresses",
  description: "Voir et modifier vos adresses de livraison",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Adresse(s) de livraison</h1>
        <p className="text-base-regular">
          Voir et modifier votre(s) adresse(s) de livraison, vous pouvez en
          ajouter autant que vous le souhaitez. Enregistrer vos adresses vous
          permettra de les utiliser lors de votre prochaine commande.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
