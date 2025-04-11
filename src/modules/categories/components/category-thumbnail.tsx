"use client"

import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

const CategoryThumbnail = ({
  category,
  featuredImage,
}: {
  category: HttpTypes.StoreProductCategory
  featuredImage: string | null
}) => {
  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        "aspect-[16/10]",
        "w-full",
        "group-hover:shadow-lg"
      )}
    >
      {featuredImage ? (
        <Image
          src={featuredImage}
          alt={category.name}
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

export default CategoryThumbnail
