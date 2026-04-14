import { useMemo, useState } from 'react'

import type { ProdutoAvaliacao } from '../../types/produtoAvaliacao'
import ProductReviewCard from '../molecules/productReviewCard'

const REVIEWS_INITIAL_LIMIT = 5

type ProductReviewsPanelProps = {
  avaliacoes: ProdutoAvaliacao[]
  isLoading: boolean
  errorMessage: string | null
}

function ProductReviewsPanel({
  avaliacoes,
  isLoading,
  errorMessage,
}: ProductReviewsPanelProps) {
  const [chaveAvaliacoesExpandidas, setChaveAvaliacoesExpandidas] = useState<string | null>(
    null,
  )
  const [idAvaliacaoExpandida, setIdAvaliacaoExpandida] = useState<string | null>(null)

  const avaliacoesOrdenadas = useMemo(() => {
    const avaliacoesOrdenadasPorPrioridade = [...avaliacoes]

    avaliacoesOrdenadasPorPrioridade.sort((avaliacaoA, avaliacaoB) => {
      if (avaliacaoA.temComentario !== avaliacaoB.temComentario) {
        return avaliacaoA.temComentario ? -1 : 1
      }

      if (avaliacaoA.nota !== avaliacaoB.nota) {
        return avaliacaoB.nota - avaliacaoA.nota
      }

      return avaliacaoA.idAvaliacao.localeCompare(avaliacaoB.idAvaliacao, 'pt-BR')
    })

    return avaliacoesOrdenadasPorPrioridade
  }, [avaliacoes])

  const avaliacoesVisiveis = useMemo(() => {
    const chaveAvaliacoes = avaliacoesOrdenadas
      .map((avaliacao) => avaliacao.idAvaliacao)
      .join('|')

    const exibirTodasAvaliacoes =
      chaveAvaliacoes.length > 0 && chaveAvaliacoesExpandidas === chaveAvaliacoes

    if (exibirTodasAvaliacoes) {
      return avaliacoesOrdenadas
    }

    return avaliacoesOrdenadas.slice(0, REVIEWS_INITIAL_LIMIT)
  }, [avaliacoesOrdenadas, chaveAvaliacoesExpandidas])

  const chaveAvaliacoesAtuais = useMemo(
    () => avaliacoesOrdenadas.map((avaliacao) => avaliacao.idAvaliacao).join('|'),
    [avaliacoesOrdenadas],
  )

  const exibirTodasAvaliacoes =
    chaveAvaliacoesAtuais.length > 0 &&
    chaveAvaliacoesExpandidas === chaveAvaliacoesAtuais

  const podeExpandirAvaliacoes =
    avaliacoesOrdenadas.length > REVIEWS_INITIAL_LIMIT && !exibirTodasAvaliacoes

  return (
    <section
      aria-labelledby="produto-avaliacoes-title"
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/25 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="produto-avaliacoes-title" className="text-lg font-semibold text-slate-100">
          Avaliacoes
        </h2>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {avaliacoesOrdenadas.length} itens
        </span>
      </div>

      {isLoading && (
        <p className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
          Carregando avaliacoes...
        </p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-rose-700 bg-rose-950/40 p-3 text-sm text-rose-200"
        >
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && avaliacoesOrdenadas.length === 0 && (
        <p className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
          Este produto ainda nao possui avaliacoes.
        </p>
      )}

      {!isLoading && !errorMessage && avaliacoesOrdenadas.length > 0 && (
        <ul className="mt-4 space-y-3">
          {avaliacoesVisiveis.map((avaliacao) => (
            <ProductReviewCard
              key={avaliacao.idAvaliacao}
              idAvaliacao={avaliacao.idAvaliacao}
              idPedido={avaliacao.idPedido}
              idConsumidor={avaliacao.idConsumidor}
              idVendedor={avaliacao.idVendedor}
              nomeVendedor={avaliacao.nomeVendedor}
              nomeConsumidor={avaliacao.nomeConsumidor}
              descricaoAvaliacao={avaliacao.descricaoAvaliacao}
              nota={avaliacao.nota}
              isExpanded={idAvaliacaoExpandida === avaliacao.idAvaliacao}
              onToggle={() => {
                setIdAvaliacaoExpandida((atual) =>
                  atual === avaliacao.idAvaliacao ? null : avaliacao.idAvaliacao,
                )
              }}
            />
          ))}
        </ul>
      )}

      {!isLoading && !errorMessage && podeExpandirAvaliacoes && (
        <button
          type="button"
          onClick={() => {
            setChaveAvaliacoesExpandidas(chaveAvaliacoesAtuais)
          }}
          className="mt-4 w-full rounded-lg border border-cyan-700/70 bg-cyan-900/20 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-500 hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          Exibir todas as avaliacoes
        </button>
      )}
    </section>
  )
}

export default ProductReviewsPanel
