import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Image from "next/image"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      {/* Header mobile */}
      <div className="bg-white border-b sm:hidden">
        <nav className="flex h-16 items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex-auto flex items-center justify-center"
            data-testid="store-link-mobile"
          >
            <div
              className="relative"
              style={{ width: "260px", height: "65px" }}
            >
              <Image
                src="/images/bellavista-logo.png"
                alt="Bella Vista Restaurant"
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                  transform: "scale(1.8)",
                  top: "1.5px",
                }}
                priority
              />
            </div>
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>

      {/* Header desktop */}
      <div className="hidden sm:block bg-white border-b">
        <div className="content-container py-3">
          <nav className="flex items-center justify-between">
            <LocalizedClientLink
              href="/cart"
              className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
              data-testid="back-to-cart-link"
            >
              <ChevronDown className="rotate-90" size={16} />
              <span className="mt-px txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                Retour au panier
              </span>
            </LocalizedClientLink>

            <div className="flex items-center justify-center">
              <LocalizedClientLink
                href="/"
                className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base"
                data-testid="store-link"
              >
                <div
                  className="relative"
                  style={{ width: "200px", height: "74px" }}
                >
                  <Image
                    src="/images/bellavista-logo.png"
                    alt="Bella Vista Restaurant"
                    fill
                    style={{
                      objectFit: "contain",
                      objectPosition: "center",
                      transform: "scale(1.8)",
                    }}
                    priority
                  />
                </div>
              </LocalizedClientLink>
            </div>

            <div className="flex-1 basis-0" />
          </nav>
        </div>
      </div>

      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div>
    </div>
  )
}
