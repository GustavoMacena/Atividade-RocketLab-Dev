import { Input } from 'antd'

type CatalogSearchInputProps = {
  id?: string
  value: string
  onChange: (nextValue: string) => void
}

function CatalogSearchInput({
  id,
  value,
  onChange,
}: CatalogSearchInputProps) {
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

export default CatalogSearchInput
