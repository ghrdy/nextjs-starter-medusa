import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"
import GoogleMap from "@modules/contact/components/google-map"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-nous pour toute question ou demande.",
}

export default function ContactPage() {
  const address =
    "Centre Commercial La Croix Verte, Av. Charles de Gaulle, Saint-Germain-lès-Corbeil 91250"
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  return (
    <div className="flex flex-col items-center justify-center py-6 content-container">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-2xl-semi text-center">
          <h1>Contactez-nous</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-y-4">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-ui-border-base">
              <h2 className="text-xl-semi mb-4">Nos coordonnées</h2>
              <div className="flex flex-col gap-y-2">
                <p className="text-base-regular">
                  <strong>Adresse :</strong>
                  <br />
                  Centre Commercial La Croix Verte
                  <br />
                  Av. Charles de Gaulle
                  <br />
                  Saint-Germain-lès-Corbeil 91250
                </p>
                <p className="text-base-regular">
                  <strong>Téléphone :</strong>
                  <br />
                  <a href="tel:+33169648029" className="hover:text-ui-fg-base">
                    01.69.64.80.29
                  </a>
                </p>
                <p className="text-base-regular">
                  <strong>Email :</strong>
                  <br />
                  <a
                    href="mailto:contact@bellavista.fr"
                    className="hover:text-ui-fg-base"
                  >
                    contact@bellavista.fr
                  </a>
                </p>
              </div>
            </div>
            <GoogleMap address={address} apiKey={apiKey} />
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
