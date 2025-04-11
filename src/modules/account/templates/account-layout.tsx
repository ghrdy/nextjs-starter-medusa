import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        {customer ? (
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12">
            <div>{customer && <AccountNav customer={customer} />}</div>
            <div className="flex flex-col items-center justify-center">
              {children}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-12">{children}</div>
        )}
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">Une Question?</h3>
            <span className="txt-medium">
              Rendez-vous sur notre page de contact pour obtenir de l'aide.
            </span>
          </div>
          <div>
            <UnderlineLink href="/contact">Contact</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
