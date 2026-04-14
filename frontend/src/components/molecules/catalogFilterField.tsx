import type { ReactNode } from 'react'

import FilterFieldLabel from '../atoms/filterFieldLabel'

type CatalogFilterFieldProps = {
  label: string
  htmlFor?: string
  children: ReactNode
}

function CatalogFilterField({
  label,
  htmlFor,
  children,
}: CatalogFilterFieldProps) {
  return (
    <div>
      <FilterFieldLabel text={label} htmlFor={htmlFor} />
      <div className="mt-2">{children}</div>
    </div>
  )
}

export default CatalogFilterField
