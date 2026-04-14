import type { ProdutoAvaliacao } from '../types/produtoAvaliacao'
import { API_ROOT } from './apiConfig'
import { parseProdutoAvaliacoes } from './produtoAvaliacoesParser'

export async function listProdutoAvaliacoes(
  idProduto: string,
  signal?: AbortSignal,
): Promise<ProdutoAvaliacao[]> {
  const response = await fetch(
    `${API_ROOT}/produtos/${encodeURIComponent(idProduto)}/avaliacoes/`,
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
    throw new Error('Nao foi possivel carregar as avaliacoes do produto.')
  }

  const payload: unknown = await response.json()
  return parseProdutoAvaliacoes(payload)
}
