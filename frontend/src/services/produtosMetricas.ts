import type { ProdutoMetrica } from '../types/produtoMetrica'
import { API_ROOT } from './apiConfig'
import { parseProdutosMetricas } from './produtosMetricasParser'

const IDS_PRODUTOS_QUERY_THRESHOLD = 200

export async function listProdutosMetricas(
  idsProdutos: string[],
  signal?: AbortSignal,
): Promise<ProdutoMetrica[]> {
  if (idsProdutos.length === 0) {
    return []
  }

  const shouldFilterByIds = idsProdutos.length <= IDS_PRODUTOS_QUERY_THRESHOLD
  const searchParams = new URLSearchParams()

  if (shouldFilterByIds) {
    idsProdutos.forEach((idProduto) => {
      searchParams.append('ids_produtos', idProduto)
    })
  }

  const queryString = searchParams.toString()
  const url = queryString
    ? `${API_ROOT}/produtos/metricas/?${queryString}`
    : `${API_ROOT}/produtos/metricas/`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as metricas dos produtos.')
  }

  const payload: unknown = await response.json()
  return parseProdutosMetricas(payload)
}
