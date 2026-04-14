import { Input } from 'antd'

type CatalogSearchFieldProps = {
  id?: string
  value: string
  onChange: (nextValue: string) => void
}

function CatalogSearchField({ id, value, onChange }: CatalogSearchFieldProps) {

  return (
    <Input
      id={id}
      allowClear
      placeholder="Pesquisar por nome ou ID do produto"
      value={value}
      onChange={(event) => {
        onChange(event.target.value)
      }}
    />
  )
}

export default CatalogSearchField
