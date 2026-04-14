type ProductSpecRowProps = {
  label: string
  value: string
  truncateValue?: boolean
}

function ProductSpecRow({
  label,
  value,
  truncateValue = false,
}: ProductSpecRowProps) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="font-medium text-slate-200">{label}</dt>
      <dd className={truncateValue ? 'truncate' : undefined}>{value}</dd>
    </div>
  )
}

export default ProductSpecRow
