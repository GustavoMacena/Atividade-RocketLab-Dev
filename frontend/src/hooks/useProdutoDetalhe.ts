import { useEffect, useState } from 'react'

import { getProdutoById } from '../services/produtos'
import { listProdutosMetricas } from '../services/produtosMetricas'
import type { Produto } from '../types/produto'
import type { ProdutoMetrica } from '../types/produtoMetrica'

type UseProdutoDetalheResult = {
  produto: Produto | null
  metricaProduto: ProdutoMetrica | null
  isLoading: boolean
  errorMessage: string | null
  atualizarProdutoLocal: (produtoAtualizado: Produto) => void
}

export function useProdutoDetalhe(idProduto?: string): UseProdutoDetalheResult {
  const [produto, setProduto] = useState<Produto | null>(null)
  const [metricaProduto, setMetricaProduto] = useState<ProdutoMetrica | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!idProduto) {
      setProduto(null)
      setMetricaProduto(null)
      setErrorMessage('Produto nao encontrado.')
      setIsLoading(false)
      return
    }

    const produtoIdAtual = idProduto
    const controller = new AbortController()

    async function loadProdutoDetalhe() {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const [produtoResult, metricas] = await Promise.all([
          getProdutoById(produtoIdAtual, controller.signal),
          listProdutosMetricas([produtoIdAtual], controller.signal),
        ])

        setProduto(produtoResult)
        setMetricaProduto(metricas[0] ?? null)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setProduto(null)
        setMetricaProduto(null)
        setErrorMessage('Falha ao carregar detalhes do produto.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProdutoDetalhe()

    return () => {
      controller.abort()
    }
  }, [idProduto])

  return {
    produto,
    metricaProduto,
    isLoading,
    errorMessage,
    atualizarProdutoLocal: setProduto,
  }
}
