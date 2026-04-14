export function normalizeCategoriaProduto(categoria: string): string {
  return categoria.replaceAll('_', ' ').trim().toLowerCase()
}

export function formatCategoriaProduto(categoria: string): string {
  const normalized = categoria.replaceAll('_', ' ').trim()
  if (!normalized) {
    return '-'
  }

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
