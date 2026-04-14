import { useEffect, useState } from 'react'

import { listProdutos } from '../services/produtos'
import type { Produto } from '../types/produto'

type UseProdutosResult = {
  produtos: Produto[]
  isLoading: boolean
  errorMessage: string | null
}

export function useProdutos(): UseProdutosResult {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProdutos() {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const result = await listProdutos(controller.signal)
        setProdutos(result)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setErrorMessage('Falha ao carregar produtos da API.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProdutos()

    return () => {
      controller.abort()
    }
  }, [])

  return {
    produtos,
    isLoading,
    errorMessage,
  }
}
