import type { ProdutoMetrica } from '../types/produtoMetrica'

type ApiProdutoMetrica = {
  id_produto: string
  media_avaliacao: number | null
  quantidade_vendida: number
}

function isNullableNumber(value: unknown): value is number | null {
  return typeof value === 'number' || value === null
}

function isApiProdutoMetrica(value: unknown): value is ApiProdutoMetrica {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.id_produto === 'string' &&
    isNullableNumber(item.media_avaliacao) &&
    typeof item.quantidade_vendida === 'number'
  )
}

export function parseProdutosMetricas(payload: unknown): ProdutoMetrica[] {
  if (!Array.isArray(payload)) {
    throw new Error('Resposta invalida da API de metricas de produtos.')
  }

  payload.forEach((item, index) => {
    if (!isApiProdutoMetrica(item)) {
      throw new Error(`Metrica de produto invalida na posicao ${index}.`)
    }
  })

  const metricasApi = payload as ApiProdutoMetrica[]

  return metricasApi.map((item) => ({
    idProduto: item.id_produto,
    mediaAvaliacao: item.media_avaliacao,
    quantidadeVendida: item.quantidade_vendida,
  }))
}
