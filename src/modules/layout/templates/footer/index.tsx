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
        <div className="flex flex-row items-start justify-between py-10 md:py-20">
          <div className="w-1/3 flex flex-col justify-start items-start relative z-10 px-1 md:px-4">
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
          <div className="w-1/3 flex justify-center items-center px-1 md:px-4">
            <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
              <div className="h-28 sm:h-32 md:h-40 relative w-[160px] sm:w-[200px] md:w-[300px] z-0 flex items-center justify-center">
                <Image
                  src="/images/logo-seul.png"
                  alt="Bella Vista Restaurant"
                  fill
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                  priority
                />
              </div>
            </LocalizedClientLink>
          </div>
          <div className="w-1/3 flex flex-col justify-start items-end relative z-10 px-1 md:px-4">
            <div className="flex flex-col gap-y-2 items-end">
              <span className="txt-small-plus txt-ui-fg-base text-right">
                Contact
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small text-right">
                <li className="hover:text-ui-fg-base">
                  <a href="tel:+33169648029">01.69.64.80.29</a>
                </li>
                <li className="hover:text-ui-fg-base">
                  <a href="mailto:contact@labellavista.fr">
                    contact@labellavista.fr
                  </a>
                </li>
                <li className="hover:text-ui-fg-base">
                  <a
                    href="https://goo.gl/maps/example"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm"
                  >
                    Centre Commercial
                    <span className="hidden sm:inline">
                      ,<br />
                    </span>{" "}
                    <span className="sm:hidden">-</span>
                    <span className="hidden sm:inline">
                      Av. Charles de Gaulle,
                      <br />
                    </span>
                    <span className="sm:hidden">Saint-Germain</span>
                    <span className="hidden sm:inline">
                      Saint-Germain-lès-Corbeil 91250
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-8 justify-between text-ui-fg-muted relative z-10">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} La Bella Vista, tous droits réservés.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
