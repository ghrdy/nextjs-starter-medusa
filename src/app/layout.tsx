import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

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
    <html lang="fr" className="dark">
      <body id="top" className="bg-zinc-900 text-gray-200">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
