import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

const PaginatedProducts = async ({
  page = 1,
  countryCode,
  categoryId,
}: {
  page: number
  countryCode: string
  categoryId?: string
}) => {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  const { response } = await listProductsWithSort({
    page,
    countryCode,
    queryParams,
  })

  const { products, count } = response
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="flex-1">
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-4 gap-y-8">
        {products &&
          products.map((p) => (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex justify-center mt-14">
          <Pagination page={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}

export default PaginatedProducts
