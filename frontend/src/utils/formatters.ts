export function formatNullableNumber(value: number | null): string {
  if (value === null) {
    return '-'
  }

  return value.toLocaleString('pt-BR')
}

const PRODUCT_ID_VISIBLE_SUFFIX_LENGTH = 6

export function formatMaskedProductId(idProduto: string): string {
  if (idProduto.length <= PRODUCT_ID_VISIBLE_SUFFIX_LENGTH) {
    return idProduto
  }

  return `******${idProduto.slice(-PRODUCT_ID_VISIBLE_SUFFIX_LENGTH)}`
}
