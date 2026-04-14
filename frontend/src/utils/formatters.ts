export function formatNullableNumber(value: number | null): string {
  if (value === null) {
    return '-'
  }

  return value.toLocaleString('pt-BR')
}
