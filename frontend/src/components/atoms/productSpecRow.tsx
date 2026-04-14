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
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <dt className="font-medium text-slate-200">{label}</dt>
      <dd className={truncateValue ? 'truncate sm:max-w-[16rem]' : undefined}>{value}</dd>
    </div>
  )
}

export default ProductSpecRow
