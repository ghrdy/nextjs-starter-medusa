import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import ProductThumbnail from "../product-thumbnail"

type ProductPreviewProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
}

const ProductPreview = ({
  product,
  region,
  isFeatured,
}: ProductPreviewProps) => {
  const { variants } = product

  const cheapestVariant = variants?.reduce((prev, curr) => {
    return (prev.calculated_price?.calculated_amount || 0) <
      (curr.calculated_price?.calculated_amount || 0)
      ? prev
      : curr
  }, variants[0])

  const price = cheapestVariant?.calculated_price
  const amount = price?.calculated_amount
  const currencyCode = price?.currency_code

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
      data-testid="product-preview-link"
    >
      <div className="transform transition-all duration-300 hover:scale-[1.03]">
        <ProductThumbnail product={product} isFeatured={isFeatured} />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle group-hover:text-ui-fg-base transition-colors duration-300">
            {product.title}
          </Text>
          <Text className="text-ui-fg-subtle group-hover:text-ui-fg-base transition-colors duration-300">
            {amount &&
              currencyCode &&
              convertToLocale({
                amount: amount,
                currency_code: currencyCode,
              })}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default ProductPreview
