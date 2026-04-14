import { Select } from 'antd'

type CategoryOption = {
  value: string
  label: string
}

type CatalogCategorySelectProps = {
  id?: string
  options: CategoryOption[]
  value: string | null
  onChange: (nextValue: string | null) => void
}

function CatalogCategorySelect({
  id,
  options,
  value,
  onChange,
}: CatalogCategorySelectProps) {
  return (
    <Select
      id={id}
      allowClear
      showSearch
      placeholder="Filtrar por categoria"
      listHeight={240}
      options={options}
      value={value ?? undefined}
      onChange={(nextValue) => {
        onChange(nextValue ?? null)
      }}
    />
  )
}

export type { CategoryOption }

export default CatalogCategorySelect
