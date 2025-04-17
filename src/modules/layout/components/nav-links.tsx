"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const NavLinks = () => {
  return (
    <div className="flex items-center justify-center mt-1 w-full overflow-x-hidden">
      <nav className="flex space-x-6 sm:space-x-12 text-gray-700 flex-wrap justify-center px-2">
        <div className="relative">
          <LocalizedClientLink
            href="/"
            className="text-base font-medium hover:text-black pb-1 inline-block"
          >
            Accueil
          </LocalizedClientLink>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-out"></span>
          <style jsx>{`
            div:hover span {
              width: 100%;
            }
          `}</style>
        </div>

        <div className="relative">
          <LocalizedClientLink
            href="/commander"
            className="text-base font-medium hover:text-black pb-1 inline-block"
          >
            Commander
          </LocalizedClientLink>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-out"></span>
          <style jsx>{`
            div:hover span {
              width: 100%;
            }
          `}</style>
        </div>

        <div className="relative">
          <LocalizedClientLink
            href="/notre-histoire"
            className="text-base font-medium hover:text-black pb-1 inline-block"
          >
            Notre Histoire
          </LocalizedClientLink>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-out"></span>
          <style jsx>{`
            div:hover span {
              width: 100%;
            }
          `}</style>
        </div>

        <div className="relative">
          <LocalizedClientLink
            href="/contact"
            className="text-base font-medium hover:text-black pb-1 inline-block"
          >
            Contact
          </LocalizedClientLink>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 ease-out"></span>
          <style jsx>{`
            div:hover span {
              width: 100%;
            }
          `}</style>
        </div>
      </nav>
    </div>
  )
}

export default NavLinks
