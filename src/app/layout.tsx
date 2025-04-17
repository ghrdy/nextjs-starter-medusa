import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Great_Vibes } from "next/font/google"

const greatVibes = Great_Vibes({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Bella Vista Restaurant",
  description: "Restaurant italien authentique",
  icons: {
    icon: "/images/icon.png",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`dark ${greatVibes.variable}`}>
      <body id="top" className="bg-zinc-900 text-gray-200">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
