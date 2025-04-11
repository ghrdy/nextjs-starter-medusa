import { Container } from "@medusajs/ui"

const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Container className="relative w-full overflow-hidden p-4 bg-ui-bg-subtle rounded-large aspect-[16/10] animate-pulse" />
      <div className="h-4 w-24 bg-ui-bg-subtle rounded animate-pulse" />
    </div>
  )
}

const CategoriesLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 content-container">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-2xl-semi text-center">
          <div className="h-8 w-48 bg-ui-bg-subtle rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-2 small:grid-cols-3 gap-x-4 gap-y-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesLoading
