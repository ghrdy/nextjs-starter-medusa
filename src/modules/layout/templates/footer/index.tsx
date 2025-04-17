import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import NotreHistoireLink from "@modules/layout/components/scroll-to-top"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-zinc-800 w-full bg-zinc-900">
      <div className="content-container flex flex-col w-full px-4 md:px-8">
        <div className="flex flex-row items-start justify-between py-10 md:py-20">
          <div className="w-1/3 flex flex-col justify-start items-start relative z-10 px-1 md:px-4">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus text-amber-400">
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
                        className="flex flex-col gap-2 text-gray-300 txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className="hover:text-amber-400"
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
          <div className="w-1/3 flex flex-col justify-center items-center px-1 md:px-4">
            <NotreHistoireLink />
          </div>
          <div className="w-1/3 flex flex-col justify-start items-end relative z-10 px-1 md:px-4">
            <div className="flex flex-col gap-y-2 items-end">
              <span className="txt-small-plus text-amber-400 text-right">
                Contact
              </span>
              <div className="flex flex-col gap-2 sm:hidden">
                <a
                  href="tel:+33169648029"
                  className="txt-small text-gray-300 hover:text-amber-400 text-right"
                >
                  Téléphone
                </a>
                <a
                  href="mailto:contact@labellavista.fr"
                  className="txt-small text-gray-300 hover:text-amber-400 text-right"
                >
                  Mail
                </a>
                <a
                  href="https://goo.gl/maps/example"
                  target="_blank"
                  rel="noreferrer"
                  className="txt-small text-gray-300 hover:text-amber-400 text-right"
                >
                  Adresse
                </a>
              </div>
              <ul className="hidden sm:grid grid-cols-1 gap-y-2 text-gray-300 txt-small text-right">
                <li className="hover:text-amber-400">
                  <a href="tel:+33169648029">01.69.64.80.29</a>
                </li>
                <li className="hover:text-amber-400">
                  <a
                    href="mailto:contact@labellavista.fr"
                    className="inline-block max-w-[150px] sm:max-w-none truncate sm:text-right overflow-hidden"
                  >
                    contact@labellavista.fr
                  </a>
                </li>
                <li className="hover:text-amber-400">
                  <a
                    href="https://goo.gl/maps/example"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm"
                  >
                    Centre Commercial La Croix Verte,
                    <br />
                    <span className="hidden sm:inline">
                      Av. Charles de Gaulle,
                      <br />
                    </span>
                    Saint-Germain-lès-Corbeil 91250
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-8 justify-between text-gray-400 relative z-10">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} La Bella Vista, tous droits réservés.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
