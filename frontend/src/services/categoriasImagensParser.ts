import type { CategoriaImagem } from '../types/categoriaImagem'

function isCategoriaImagem(value: unknown): value is CategoriaImagem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return typeof item.categoria === 'string' && typeof item.link === 'string'
}

export function parseCategoriasImagens(payload: unknown): CategoriaImagem[] {
  if (!Array.isArray(payload)) {
    throw new Error('Resposta invalida da API de categorias de imagens.')
  }

  payload.forEach((item, index) => {
    if (!isCategoriaImagem(item)) {
      throw new Error(`Categoria de imagem invalida na posicao ${index}.`)
    }
  })

  return payload
}
