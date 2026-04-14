import { useMemo, useState } from 'react'
import { message } from 'antd'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import Container from '../components/atoms/container'
import ProductActionsPanel from '../components/organisms/productActionsPanel'
import ProductDetailCard from '../components/organisms/productDetailCard'
import ProductReviewsPanel from '../components/organisms/productReviewsPanel'
import ProductUpdateModal from '../components/organisms/productUpdateModal'
import { useCategoriasImagens } from '../hooks/useCategoriasImagens'
import { useProdutoAvaliacoes } from '../hooks/useProdutoAvaliacoes'
import { useProdutoDetalhe } from '../hooks/useProdutoDetalhe'
import {
  deleteProdutoById,
  updateProdutoById,
  type UpdateProdutoPayload,
} from '../services/produtos'
import type { ProdutoUpdateFormValues } from '../types/produtoUpdateFormValues'
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
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ProdutoDetalheLocationState | null
  const { categoriaImagemPorCategoria } = useCategoriasImagens()
  const {
    produto,
    metricaProduto,
    isLoading,
    errorMessage,
    atualizarProdutoLocal,
  } = useProdutoDetalhe(idProduto)
  const [isModalAtualizarAberto, setIsModalAtualizarAberto] = useState(false)
  const [isAtualizandoProduto, setIsAtualizandoProduto] = useState(false)
  const [isRemovendoProduto, setIsRemovendoProduto] = useState(false)
  const {
    avaliacoes,
    isLoadingAvaliacoes,
    errorAvaliacoes,
  } = useProdutoAvaliacoes(idProduto)

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

  const valoresIniciaisProdutoForm = useMemo<ProdutoUpdateFormValues | undefined>(() => {
    if (!produto) {
      return undefined
    }

    return {
      nomeProduto: produto.nomeProduto,
      categoriaProduto: produto.categoriaProduto,
      pesoProdutoGramas: produto.pesoProdutoGramas,
      comprimentoCentimetros: produto.comprimentoCentimetros,
      alturaCentimetros: produto.alturaCentimetros,
      larguraCentimetros: produto.larguraCentimetros,
    }
  }, [produto])

  const imagemCategoriaStatus = categoriaImagemUrl
    ? 'Disponivel'
    : 'Placeholder padrao'

  function abrirModalAtualizarProduto() {
    if (!valoresIniciaisProdutoForm) {
      return
    }

    setIsModalAtualizarAberto(true)
  }

  function fecharModalAtualizarProduto() {
    setIsModalAtualizarAberto(false)
  }

  async function atualizarProduto(valores: ProdutoUpdateFormValues) {
    if (!produto) {
      return
    }

    try {
      const payload: UpdateProdutoPayload = {
        nomeProduto: valores.nomeProduto.trim(),
        categoriaProduto: valores.categoriaProduto.trim(),
        pesoProdutoGramas: valores.pesoProdutoGramas,
        comprimentoCentimetros: valores.comprimentoCentimetros,
        alturaCentimetros: valores.alturaCentimetros,
        larguraCentimetros: valores.larguraCentimetros,
      }

      setIsAtualizandoProduto(true)

      const produtoAtualizado = await updateProdutoById(produto.idProduto, payload)

      atualizarProdutoLocal(produtoAtualizado)
      setIsModalAtualizarAberto(false)
      message.success('Produto atualizado com sucesso.')
    } catch (error) {
      const mensagemErro =
        error instanceof Error && error.message
          ? error.message
          : 'Falha ao atualizar o produto.'

      message.error(mensagemErro)
    } finally {
      setIsAtualizandoProduto(false)
    }
  }

  async function removerProduto() {
    if (!produto) {
      return
    }

    try {
      setIsRemovendoProduto(true)
      await deleteProdutoById(produto.idProduto)
      message.success('Produto removido com sucesso.')
      navigate('/')
    } catch (error) {
      const mensagemErro =
        error instanceof Error && error.message
          ? error.message
          : 'Falha ao remover o produto.'

      message.error(mensagemErro)
    } finally {
      setIsRemovendoProduto(false)
    }
  }

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full">
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
          <div className="mt-6 grid gap-4 sm:gap-5 lg:grid-cols-3 lg:items-start lg:gap-6">
            <div className="lg:col-span-2">
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

              <ProductActionsPanel
                onAtualizarProduto={abrirModalAtualizarProduto}
                onRemoverProduto={removerProduto}
                isRemovendoProduto={isRemovendoProduto}
              />
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-4">
              <ProductReviewsPanel
                avaliacoes={avaliacoes}
                isLoading={isLoadingAvaliacoes}
                errorMessage={errorAvaliacoes}
              />
            </div>
          </div>
        )}
      </div>

      <ProductUpdateModal
        isOpen={isModalAtualizarAberto}
        isSubmitting={isAtualizandoProduto}
        initialValues={valoresIniciaisProdutoForm}
        onCancel={fecharModalAtualizarProduto}
        onSubmit={atualizarProduto}
      />
    </Container>
  )
}

export default ProdutoDetalhePage
