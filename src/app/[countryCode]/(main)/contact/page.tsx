import { Metadata } from "next"
import ContactForm from "@modules/contact/components/contact-form"
import GoogleMap from "@modules/contact/components/google-map"
import { MapPin } from "lucide-react"
import RecenterButton from "@modules/contact/components/recenter-button"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-nous pour toute question ou demande.",
}

export default function ContactPage() {
  const address =
    "Centre Commercial La Croix Verte, Av. Charles de Gaulle, Saint-Germain-lès-Corbeil 91250"
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  // URL directe vers La Bella Vista sur Google Maps
  const googleMapsUrl =
    "https://www.google.com/maps/place/La+Bella+Vista/@48.6202061,2.4868062,17z/data=!3m1!4b1!4m6!3m5!1s0x47e5e1d54582bc73:0x99e80ab97417a766!8m2!3d48.6202027!4d2.4916771!16s%2Fg%2F11tdqgv54n?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-4 content-container">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-3">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-ui-border-base">
              <h2 className="text-xl-semi mb-3">Nos coordonnées</h2>
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
            <div className="relative">
              <GoogleMap address={address} apiKey={apiKey} className="h-80" />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <RecenterButton />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <MapPin size={18} />
                  <span>Ouvrir dans Google Maps</span>
                </a>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
