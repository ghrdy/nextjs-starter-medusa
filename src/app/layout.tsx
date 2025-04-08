import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Bella Vista Restaurant",
  description: "Restaurant italien authentique",
  icons: {
    icon: "/images/bellavista-logo.png",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
