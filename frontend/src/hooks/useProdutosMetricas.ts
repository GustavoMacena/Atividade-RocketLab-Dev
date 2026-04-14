import { useEffect, useState } from 'react'

import { listProdutosMetricas } from '../services/produtosMetricas'
import type { ProdutoMetrica } from '../types/produtoMetrica'

type ProdutosMetricasPorId = Record<string, ProdutoMetrica>

type UseProdutosMetricasResult = {
  metricasPorProdutoId: ProdutosMetricasPorId
}

export function useProdutosMetricas(
  idsProdutos: string[],
): UseProdutosMetricasResult {
  const [metricasPorProdutoId, setMetricasPorProdutoId] =
    useState<ProdutosMetricasPorId>({})

  useEffect(() => {
    const controller = new AbortController()

    async function loadMetricas() {
      try {
        const metricas = await listProdutosMetricas(idsProdutos, controller.signal)

        const map: ProdutosMetricasPorId = {}
        metricas.forEach((metrica) => {
          map[metrica.idProduto] = metrica
        })

        setMetricasPorProdutoId(map)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setMetricasPorProdutoId({})
      }
    }

    loadMetricas()

    return () => {
      controller.abort()
    }
  }, [idsProdutos])

  return {
    metricasPorProdutoId,
  }
}
