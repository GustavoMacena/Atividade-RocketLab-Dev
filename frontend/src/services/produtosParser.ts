import type { Produto } from '../types/produto'

type ApiProduto = {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
}

function isNullableNumber(value: unknown): value is number | null {
  return typeof value === 'number' || value === null
}

function isApiProduto(value: unknown): value is ApiProduto {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.id_produto === 'string' &&
    typeof item.nome_produto === 'string' &&
    typeof item.categoria_produto === 'string' &&
    isNullableNumber(item.peso_produto_gramas) &&
    isNullableNumber(item.comprimento_centimetros) &&
    isNullableNumber(item.altura_centimetros) &&
    isNullableNumber(item.largura_centimetros)
  )
}

function mapApiProduto(item: ApiProduto): Produto {
  return {
    idProduto: item.id_produto,
    nomeProduto: item.nome_produto,
    categoriaProduto: item.categoria_produto,
    pesoProdutoGramas: item.peso_produto_gramas,
    comprimentoCentimetros: item.comprimento_centimetros,
    alturaCentimetros: item.altura_centimetros,
    larguraCentimetros: item.largura_centimetros,
  }
}

export function parseProduto(payload: unknown): Produto {
  if (!isApiProduto(payload)) {
    throw new Error('Resposta invalida da API de produto.')
  }

  return mapApiProduto(payload)
}

export function parseProdutos(payload: unknown): Produto[] {
  if (!Array.isArray(payload)) {
    throw new Error('Resposta invalida da API de produtos.')
  }

  return payload.map((item, index) => {
    if (!isApiProduto(item)) {
      throw new Error(`Produto invalido na posicao ${index}.`)
    }

    return mapApiProduto(item)
  })
}
