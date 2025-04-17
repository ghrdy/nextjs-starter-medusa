"use client"

import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

const ProductThumbnail = ({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
}) => {
  const initialImage =
    product.thumbnail || (product.images && product.images[0]?.url)

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        {
          "aspect-[4/3]": isFeatured,
          "aspect-[1/1]": !isFeatured,
        },
        "w-full",
        "group-hover:shadow-lg"
      )}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt={product.title}
          className="absolute inset-0 object-cover object-center transition-all duration-300 group-hover:scale-105 opacity-0"
          draggable={false}
          quality={70}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          fill
          priority
          onLoadingComplete={(image) => {
            image.classList.add("opacity-100")
          }}
        />
      ) : (
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <PlaceholderImage size={24} />
        </div>
      )}
    </Container>
  )
}

export default ProductThumbnail
