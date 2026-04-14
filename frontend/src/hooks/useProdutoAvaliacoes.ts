import { useEffect, useState } from 'react'

import { listProdutoAvaliacoes } from '../services/produtoAvaliacoes'
import type { ProdutoAvaliacao } from '../types/produtoAvaliacao'

type UseProdutoAvaliacoesResult = {
  avaliacoes: ProdutoAvaliacao[]
  isLoadingAvaliacoes: boolean
  errorAvaliacoes: string | null
}

export function useProdutoAvaliacoes(
  idProduto?: string,
): UseProdutoAvaliacoesResult {
  const [avaliacoes, setAvaliacoes] = useState<ProdutoAvaliacao[]>([])
  const [isLoadingAvaliacoes, setIsLoadingAvaliacoes] = useState(false)
  const [errorAvaliacoes, setErrorAvaliacoes] = useState<string | null>(null)

  useEffect(() => {
    if (!idProduto) {
      setAvaliacoes([])
      setIsLoadingAvaliacoes(false)
      setErrorAvaliacoes(null)
      return
    }

    const idProdutoAtual = idProduto
    const controller = new AbortController()

    async function loadAvaliacoes() {
      try {
        setIsLoadingAvaliacoes(true)
        setErrorAvaliacoes(null)

        const result = await listProdutoAvaliacoes(idProdutoAtual, controller.signal)
        setAvaliacoes(result)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setAvaliacoes([])
        setErrorAvaliacoes('Falha ao carregar avaliacoes do produto.')
      } finally {
        setIsLoadingAvaliacoes(false)
      }
    }

    loadAvaliacoes()

    return () => {
      controller.abort()
    }
  }, [idProduto])

  return {
    avaliacoes,
    isLoadingAvaliacoes,
    errorAvaliacoes,
  }
}
