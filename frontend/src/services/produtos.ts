import type { Produto } from '../types/produto'
import { API_ROOT } from './apiConfig'
import { parseProduto, parseProdutos } from './produtosParser'

export async function listProdutos(signal?: AbortSignal): Promise<Produto[]> {
  const response = await fetch(`${API_ROOT}/produtos/`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os produtos.')
  }

  const payload: unknown = await response.json()
  return parseProdutos(payload)
}

export async function getProdutoById(
  idProduto: string,
  signal?: AbortSignal,
): Promise<Produto> {
  const response = await fetch(
    `${API_ROOT}/produtos/${encodeURIComponent(idProduto)}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    },
  )

  if (response.status === 404) {
    throw new Error('Produto nao encontrado.')
  }

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar o detalhe do produto.')
  }

  const payload: unknown = await response.json()
  return parseProduto(payload)
}
