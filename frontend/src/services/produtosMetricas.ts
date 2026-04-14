import type { ProdutoMetrica } from '../types/produtoMetrica'
import { API_ROOT } from './apiConfig'
import { parseProdutosMetricas } from './produtosMetricasParser'

export async function listProdutosMetricas(
  idsProdutos: string[],
  signal?: AbortSignal,
): Promise<ProdutoMetrica[]> {
  if (idsProdutos.length === 0) {
    return []
  }

  const searchParams = new URLSearchParams()
  idsProdutos.forEach((idProduto) => {
    searchParams.append('ids_produtos', idProduto)
  })

  const response = await fetch(
    `${API_ROOT}/produtos/metricas/?${searchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    },
  )

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as metricas dos produtos.')
  }

  const payload: unknown = await response.json()
  return parseProdutosMetricas(payload)
}
