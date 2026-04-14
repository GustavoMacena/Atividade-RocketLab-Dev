type ProductReviewCardProps = {
  idAvaliacao: string
  idPedido: string
  idConsumidor: string
  idVendedor: string
  nomeVendedor: string
  nomeConsumidor: string
  descricaoAvaliacao: string
  nota: number
  isExpanded: boolean
  onToggle: () => void
}

function ProductReviewCard({
  idAvaliacao,
  idPedido,
  idConsumidor,
  idVendedor,
  nomeVendedor,
  nomeConsumidor,
  descricaoAvaliacao,
  nota,
  isExpanded,
  onToggle,
}: ProductReviewCardProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`avaliacao-expandida-${idAvaliacao}`}
        className={[
          'group w-full cursor-pointer rounded-xl border bg-slate-900 p-3 text-left shadow-lg shadow-black/20 transition duration-200 sm:p-4',
          isExpanded
            ? 'border-cyan-700/70'
            : 'border-slate-800 hover:-translate-y-0.5 hover:border-cyan-500/70 hover:shadow-xl',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
        ].join(' ')}
      >
        <p className="text-sm font-semibold text-slate-100">{nomeConsumidor}</p>
        <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-300">{descricaoAvaliacao}</p>
        <p className="mt-3 text-sm font-medium text-cyan-300">Nota: {nota}</p>
        <p
          className={[
            'mt-1 text-xs font-medium transition-colors',
            isExpanded
              ? 'text-cyan-300'
              : 'text-slate-400 group-hover:text-cyan-300',
          ].join(' ')}
        >
          {isExpanded ? 'Clique para recolher detalhes' : 'Clique para ver detalhes'}
        </p>

        <div
          id={`avaliacao-expandida-${idAvaliacao}`}
          className={[
            'mt-3 grid overflow-hidden transition-all duration-300 ease-out',
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          ].join(' ')}
        >
          <div className="min-h-0 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-400">
            <dl className="grid gap-2">
              <div className="grid gap-1 sm:grid-cols-[6.5rem,1fr] sm:gap-2">
                <dt className="font-medium uppercase tracking-wide text-slate-500">ID pedido</dt>
                <dd className="truncate">{idPedido}</dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[6.5rem,1fr] sm:gap-2">
                <dt className="font-medium uppercase tracking-wide text-slate-500">ID vendedor</dt>
                <dd className="truncate">{idVendedor}</dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[6.5rem,1fr] sm:gap-2">
                <dt className="font-medium uppercase tracking-wide text-slate-500">Vendedor</dt>
                <dd className="truncate">{nomeVendedor}</dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[6.5rem,1fr] sm:gap-2">
                <dt className="font-medium uppercase tracking-wide text-slate-500">ID consumidor</dt>
                <dd className="truncate">{idConsumidor}</dd>
              </div>
            </dl>
          </div>
        </div>
      </button>
    </li>
  )
}

export default ProductReviewCard
