import type { ProdutoAvaliacao } from '../types/produtoAvaliacao'

type ApiProdutoAvaliacao = {
  id_avaliacao: string
  id_pedido: string
  nome_consumidor: string
  id_consumidor: string
  id_vendedor: string
  nome_vendedor: string
  descricao_avaliacao: string
  nota: number
  tem_comentario: boolean
}

function isApiProdutoAvaliacao(value: unknown): value is ApiProdutoAvaliacao {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.id_avaliacao === 'string' &&
    typeof item.id_pedido === 'string' &&
    typeof item.nome_consumidor === 'string' &&
    typeof item.id_consumidor === 'string' &&
    typeof item.id_vendedor === 'string' &&
    typeof item.nome_vendedor === 'string' &&
    typeof item.descricao_avaliacao === 'string' &&
    typeof item.nota === 'number' &&
    typeof item.tem_comentario === 'boolean'
  )
}

export function parseProdutoAvaliacoes(payload: unknown): ProdutoAvaliacao[] {
  if (!Array.isArray(payload)) {
    throw new Error('Resposta invalida da API de avaliacoes do produto.')
  }

  payload.forEach((item, index) => {
    if (!isApiProdutoAvaliacao(item)) {
      throw new Error(`Avaliacao de produto invalida na posicao ${index}.`)
    }
  })

  const avaliacoesApi = payload as ApiProdutoAvaliacao[]

  return avaliacoesApi.map((item) => ({
    idAvaliacao: item.id_avaliacao,
    idPedido: item.id_pedido,
    nomeConsumidor: item.nome_consumidor,
    idConsumidor: item.id_consumidor,
    idVendedor: item.id_vendedor,
    nomeVendedor: item.nome_vendedor,
    descricaoAvaliacao: item.descricao_avaliacao,
    nota: item.nota,
    temComentario: item.tem_comentario,
  }))
}
