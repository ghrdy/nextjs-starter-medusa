import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full px-4 md:px-8">
        <div className="flex flex-col gap-y-10 xsmall:flex-row items-start justify-between py-20">
          <div className="w-full xsmall:w-1/3 flex flex-col justify-start items-start relative z-10 px-0 xsmall:px-4">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return null
                    }

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className="hover:text-ui-fg-base"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="w-full xsmall:w-1/3 flex justify-center items-center px-0 xsmall:px-4">
            <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
              <div className="h-32 sm:h-28 relative w-[260px] sm:w-64 z-0 flex items-center justify-center">
                <Image
                  src="/images/logo-seul.png"
                  alt="Bella Vista Restaurant"
                  fill
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    top: "82.5%",
                    transform: "translateY(-50%) scale(3)",
                  }}
                  priority
                />
              </div>
            </LocalizedClientLink>
          </div>
          <div className="w-full xsmall:w-1/3 flex flex-col justify-start items-end relative z-10 px-0 xsmall:px-4">
            <div className="flex flex-col gap-y-2 items-end">
              <span className="txt-small-plus txt-ui-fg-base text-right">
                Contact
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small text-right">
                <li className="hover:text-ui-fg-base">
                  <a href="tel:+33169648029">01.69.64.80.29</a>
                </li>
                <li className="hover:text-ui-fg-base">
                  <a href="mailto:contact@bellavista.fr">
                    contact@bellavista.fr
                  </a>
                </li>
                <li className="hover:text-ui-fg-base">
                  <a
                    href="https://goo.gl/maps/example"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Centre Commercial La Croix Verte,
                    <br />
                    Av. Charles de Gaulle,
                    <br />
                    Saint-Germain-lès-Corbeil 91250
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-8 justify-between text-ui-fg-muted relative z-10">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Bella Vista Restaurant. All rights
            reserved.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
