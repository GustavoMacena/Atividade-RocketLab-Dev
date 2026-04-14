type ProductCategoryBadgeProps = {
  label: string
}

function ProductCategoryBadge({ label }: ProductCategoryBadgeProps) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-cyan-300">
      {label}
    </p>
  )
}

export default ProductCategoryBadge
