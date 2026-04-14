import type { Produto } from '../types/produto'
import { API_ROOT } from './apiConfig'
import { parseProduto, parseProdutos } from './produtosParser'

const PRODUTOS_PAGE_LIMIT = 500

export type CreateProdutoPayload = {
  idProduto: string
  nomeProduto: string
  categoriaProduto: string
  pesoProdutoGramas: number
  comprimentoCentimetros: number
  alturaCentimetros: number
  larguraCentimetros: number
}

export type UpdateProdutoPayload = {
  nomeProduto: string
  categoriaProduto: string
  pesoProdutoGramas: number | null
  comprimentoCentimetros: number | null
  alturaCentimetros: number | null
  larguraCentimetros: number | null
}

function mapCreateProdutoPayload(payload: CreateProdutoPayload) {
  return {
    id_produto: payload.idProduto,
    nome_produto: payload.nomeProduto,
    categoria_produto: payload.categoriaProduto,
    peso_produto_gramas: payload.pesoProdutoGramas,
    comprimento_centimetros: payload.comprimentoCentimetros,
    altura_centimetros: payload.alturaCentimetros,
    largura_centimetros: payload.larguraCentimetros,
  }
}

function mapUpdateProdutoPayload(payload: UpdateProdutoPayload) {
  return {
    nome_produto: payload.nomeProduto,
    categoria_produto: payload.categoriaProduto,
    peso_produto_gramas: payload.pesoProdutoGramas,
    comprimento_centimetros: payload.comprimentoCentimetros,
    altura_centimetros: payload.alturaCentimetros,
    largura_centimetros: payload.larguraCentimetros,
  }
}

async function buildApiErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const payload: unknown = await response.json()

    if (typeof payload === 'object' && payload !== null && 'detail' in payload) {
      const detail = (payload as { detail?: unknown }).detail

      if (typeof detail === 'string' && detail.trim().length > 0) {
        return detail
      }
    }
  } catch {
    return fallbackMessage
  }

  return fallbackMessage
}

export async function listProdutos(signal?: AbortSignal): Promise<Produto[]> {
  const produtos: Produto[] = []
  let skip = 0

  while (true) {
    const searchParams = new URLSearchParams({
      skip: String(skip),
      limit: String(PRODUTOS_PAGE_LIMIT),
    })

    const response = await fetch(`${API_ROOT}/produtos/?${searchParams.toString()}`, {
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
    const page = parseProdutos(payload)
    produtos.push(...page)

    if (page.length < PRODUTOS_PAGE_LIMIT) {
      break
    }

    skip += PRODUTOS_PAGE_LIMIT
  }

  return produtos
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

export async function createProduto(
  payload: CreateProdutoPayload,
  signal?: AbortSignal,
): Promise<Produto> {
  const response = await fetch(`${API_ROOT}/produtos/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapCreateProdutoPayload(payload)),
    signal,
  })

  if (response.status === 409) {
    throw new Error('Ja existe um produto com este ID.')
  }

  if (!response.ok) {
    const detailMessage = await buildApiErrorMessage(
      response,
      'Nao foi possivel criar o produto.',
    )
    throw new Error(detailMessage)
  }

  const body: unknown = await response.json()
  return parseProduto(body)
}

export async function updateProdutoById(
  idProduto: string,
  payload: UpdateProdutoPayload,
  signal?: AbortSignal,
): Promise<Produto> {
  const response = await fetch(
    `${API_ROOT}/produtos/${encodeURIComponent(idProduto)}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapUpdateProdutoPayload(payload)),
      signal,
    },
  )

  if (response.status === 404) {
    throw new Error('Produto nao encontrado.')
  }

  if (!response.ok) {
    throw new Error('Nao foi possivel atualizar o produto.')
  }

  const body: unknown = await response.json()
  return parseProduto(body)
}

export async function deleteProdutoById(
  idProduto: string,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(
    `${API_ROOT}/produtos/${encodeURIComponent(idProduto)}`,
    {
      method: 'DELETE',
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
    const detailMessage = await buildApiErrorMessage(
      response,
      'Nao foi possivel remover o produto.',
    )
    throw new Error(detailMessage)
  }
}
