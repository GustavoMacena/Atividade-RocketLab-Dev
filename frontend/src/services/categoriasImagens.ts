import type { CategoriaImagem } from '../types/categoriaImagem'
import { API_ROOT } from './apiConfig'
import { parseCategoriasImagens } from './categoriasImagensParser'

export async function listCategoriasImagens(signal?: AbortSignal): Promise<CategoriaImagem[]> {
  const response = await fetch(`${API_ROOT}/categorias-imagens/?limit=500`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar as imagens das categorias.')
  }

  const payload: unknown = await response.json()
  return parseCategoriasImagens(payload)
}
