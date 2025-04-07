import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  page,
  countryCode,
}: {
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div
      className="flex flex-col items-center justify-center py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-2xl-semi text-center">
          <h1 data-testid="store-page-title">Tous les produits</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts page={pageNumber} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
