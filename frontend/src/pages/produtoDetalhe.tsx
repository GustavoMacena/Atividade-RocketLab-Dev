import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import Container from '../components/atoms/container'
import ProductDetailCard from '../components/organisms/productDetailCard'
import { useCategoriasImagens } from '../hooks/useCategoriasImagens'
import { getProdutoById } from '../services/produtos'
import { listProdutosMetricas } from '../services/produtosMetricas'
import type { Produto } from '../types/produto'
import type { ProdutoMetrica } from '../types/produtoMetrica'
import {
  formatCategoriaProduto,
  normalizeCategoriaProduto,
} from '../utils/categoriaProduto'
import { formatNullableNumber } from '../utils/formatters'

type ProdutoDetalheLocationState = {
  nomeProduto?: string
}

function ProdutoDetalhePage() {
  const { idProduto } = useParams<{ idProduto: string }>()
  const location = useLocation()
  const state = location.state as ProdutoDetalheLocationState | null
  const { categoriaImagemPorCategoria } = useCategoriasImagens()
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

  const nomeProdutoFallback = state?.nomeProduto?.trim() || 'Produto selecionado'
  const nomeProduto = produto?.nomeProduto ?? nomeProdutoFallback

  const tamanhoProduto = useMemo(() => {
    if (!produto) {
      return '-'
    }

    const medidas = [
      produto.comprimentoCentimetros,
      produto.alturaCentimetros,
      produto.larguraCentimetros,
    ]

    if (medidas.every((medida) => medida === null)) {
      return '-'
    }

    const [comprimento, altura, largura] = medidas.map(formatNullableNumber)
    return `${comprimento} x ${altura} x ${largura} cm`
  }, [produto])

  const pesoProduto = produto
    ? produto.pesoProdutoGramas === null
      ? '-'
      : `${formatNullableNumber(produto.pesoProdutoGramas)} g`
    : '-'

  const quantidadeVendida = (metricaProduto?.quantidadeVendida ?? 0).toLocaleString('pt-BR')

  const mediaAvaliacao =
    metricaProduto?.mediaAvaliacao !== null &&
    metricaProduto?.mediaAvaliacao !== undefined
      ? metricaProduto.mediaAvaliacao.toFixed(1)
      : '-'

  const categoriaImagemUrl = produto
    ? categoriaImagemPorCategoria[normalizeCategoriaProduto(produto.categoriaProduto)]
    : undefined

  const categoriaProdutoLabel = produto
    ? formatCategoriaProduto(produto.categoriaProduto)
    : '-'

  const imagemCategoriaStatus = categoriaImagemUrl
    ? 'Disponivel'
    : 'Placeholder padrao'

  return (
    <Container className="py-10 sm:py-12">
      <div className="mx-auto w-full lg:w-2/3">
        <p className="text-sm text-slate-400">
          <Link to="/" className="transition hover:text-cyan-300">
            Voltar ao catalogo
          </Link>
        </p>

        {isLoading && (
          <p className="mt-6 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
            Carregando detalhes do produto...
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-rose-700 bg-rose-950/40 p-4 text-sm text-rose-200"
          >
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && produto && (
          <div className="mt-6">
            <ProductDetailCard
              idProduto={produto.idProduto}
              nomeProduto={nomeProduto}
              categoriaProduto={produto.categoriaProduto}
              categoriaProdutoLabel={categoriaProdutoLabel}
              categoriaImagemUrl={categoriaImagemUrl}
              imagemCategoriaStatus={imagemCategoriaStatus}
              tamanhoProduto={tamanhoProduto}
              pesoProduto={pesoProduto}
              quantidadeVendida={quantidadeVendida}
              mediaAvaliacao={mediaAvaliacao}
            />
          </div>
        )}
      </div>
    </Container>
  )
}

export default ProdutoDetalhePage
