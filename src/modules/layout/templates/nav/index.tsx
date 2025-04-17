import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavLinks from "@modules/layout/components/nav-links"
import User from "@modules/common/icons/user"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Header mobile */}
      <header className="relative flex flex-col overflow-visible sm:hidden">
        <div className="h-16 bg-white border-b border-zinc-200">
          <nav className="content-container txt-xsmall-plus text-gray-700 flex items-center justify-between w-full h-full text-small-regular">
            <div className="flex-1 basis-0 h-full flex items-center z-20">
              <div className="h-full">
                <SideMenu regions={regions} />
              </div>
            </div>

            <div className="flex-auto flex items-center justify-center overflow-visible h-full z-10">
              <LocalizedClientLink
                href="/"
                aria-label="Bella Vista Restaurant"
                data-testid="nav-store-link-mobile"
                className="relative block mx-auto"
              >
                <Image
                  src="/images/bellavista-logo.png"
                  alt="Bella Vista Restaurant"
                  width={110}
                  height={28}
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                  priority
                />
              </LocalizedClientLink>
            </div>

            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <LocalizedClientLink
                className="hover:text-amber-600 text-gray-700 flex items-center justify-center mr-2 relative z-30"
                href="/account"
                data-testid="nav-account-link-mobile"
                aria-label="Compte"
              >
                <User size={20} />
              </LocalizedClientLink>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-amber-600 text-gray-700 flex gap-2"
                    href="/cart"
                    data-testid="nav-cart-link"
                  ></LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </div>
        <div className="bg-zinc-900 border-b border-zinc-800 py-1">
          <NavLinks />
        </div>
      </header>

      {/* Header desktop */}
      <header className="hidden sm:flex flex-col overflow-visible">
        {/* Logo section avec fond blanc */}
        <div className="bg-white border-b border-zinc-200">
          <div className="content-container flex flex-col items-center justify-center py-3">
            <div className="flex w-full items-center justify-between mb-1">
              <div className="flex-1 basis-0">
                {/* Espace vide pour centrer le logo */}
              </div>

              <div className="flex items-center justify-center">
                <LocalizedClientLink
                  href="/"
                  aria-label="Bella Vista Restaurant"
                  data-testid="nav-store-link"
                  className="relative block mx-auto"
                >
                  <Image
                    src="/images/bellavista-logo.png"
                    alt="Bella Vista Restaurant"
                    width={180}
                    height={67}
                    style={{
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                    priority
                  />
                </LocalizedClientLink>
              </div>

              <div className="flex items-center gap-x-6 flex-1 basis-0 justify-end">
                <div className="hidden small:flex items-center gap-x-6">
                  <LocalizedClientLink
                    className="hover:text-amber-600 text-gray-700 flex items-center justify-center relative z-30"
                    href="/account"
                    data-testid="nav-account-link"
                    aria-label="Compte"
                  >
                    <User size={20} />
                  </LocalizedClientLink>
                </div>
                <Suspense
                  fallback={
                    <LocalizedClientLink
                      className="hover:text-amber-600 text-gray-700 flex gap-2"
                      href="/cart"
                      data-testid="nav-cart-link"
                    ></LocalizedClientLink>
                  }
                >
                  <CartButton />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation menu avec fond sombre */}
        <div className="bg-zinc-900 border-b border-zinc-800 py-1">
          <NavLinks />
        </div>
      </header>
    </div>
  )
}
