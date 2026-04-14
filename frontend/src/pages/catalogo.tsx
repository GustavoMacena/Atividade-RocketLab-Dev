import { Pagination } from 'antd'
import { useMemo, useState } from 'react'

import Container from '../components/atoms/container'
import ProductCard from '../components/organisms/productCard'
import { useCategoriasImagens } from '../hooks/useCategoriasImagens'
import { useCatalogFiltersContext } from '../hooks/useCatalogFiltersContext'
import { useProdutosMetricas } from '../hooks/useProdutosMetricas'
import type { Produto } from '../types/produto'
import { normalizeCategoriaProduto } from '../utils/categoriaProduto'

const PRODUTOS_POR_PAGINA = 60

type CatalogoPageProps = {
	produtos: Produto[]
	isLoading: boolean
	errorMessage: string | null
}

function CatalogoPage({ produtos, isLoading, errorMessage }: CatalogoPageProps) {
	const { categoriaImagemPorCategoria } = useCategoriasImagens()
	const { filters } = useCatalogFiltersContext()
	const [paginaPorFiltro, setPaginaPorFiltro] = useState<Record<string, number>>({})
	const produtosPorId = useMemo(() => {
		const map = new Map<string, Produto>()

		produtos.forEach((produto) => {
			map.set(produto.idProduto, produto)
		})

		return map
	}, [produtos])

	const idsProdutos = useMemo(
		() => Array.from(produtosPorId.keys()),
		[produtosPorId],
	)
	const { metricasPorProdutoId } = useProdutosMetricas(idsProdutos)

	const idsProdutosFiltrados = useMemo(() => {
		const termoPesquisaNormalizado = filters.termoPesquisa.trim().toLowerCase()
		const nenhumFiltroAplicado =
			termoPesquisaNormalizado.length === 0 &&
			!filters.categoriaSelecionada &&
			filters.mediaAvaliacaoMinima <= 0 &&
			filters.quantidadeVendidaMinima <= 0

		if (nenhumFiltroAplicado) {
			return idsProdutos
		}

		return idsProdutos.filter((idProduto) => {
			const produto = produtosPorId.get(idProduto)
			if (!produto) {
				return false
			}

			if (termoPesquisaNormalizado) {
				const correspondeAoTermo =
					produto.nomeProduto.toLowerCase().includes(termoPesquisaNormalizado) ||
					idProduto.toLowerCase().includes(termoPesquisaNormalizado)

				if (!correspondeAoTermo) {
					return false
				}
			}

			const categoriaNormalizada = normalizeCategoriaProduto(produto.categoriaProduto)
			if (
				filters.categoriaSelecionada &&
				categoriaNormalizada !== filters.categoriaSelecionada
			) {
				return false
			}

			const metrica = metricasPorProdutoId[idProduto]
			const mediaAvaliacao = metrica?.mediaAvaliacao ?? 0
			const quantidadeVendida = metrica?.quantidadeVendida ?? 0

			if (mediaAvaliacao < filters.mediaAvaliacaoMinima) {
				return false
			}

			if (quantidadeVendida < filters.quantidadeVendidaMinima) {
				return false
			}

			return true
		})
	}, [filters, idsProdutos, metricasPorProdutoId, produtosPorId])

	const produtosFiltrados = useMemo(
		() =>
			idsProdutosFiltrados
				.map((idProduto) => produtosPorId.get(idProduto))
				.filter((produto): produto is Produto => produto !== undefined),
		[idsProdutosFiltrados, produtosPorId],
	)

	const filtrosKey = useMemo(
		() =>
			[
				filters.termoPesquisa.trim().toLowerCase(),
				filters.categoriaSelecionada ?? '',
				String(filters.mediaAvaliacaoMinima),
				String(filters.quantidadeVendidaMinima),
			].join('|'),
		[
			filters.termoPesquisa,
			filters.categoriaSelecionada,
			filters.mediaAvaliacaoMinima,
			filters.quantidadeVendidaMinima,
		],
	)

	const totalPaginas = Math.max(
		1,
		Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA),
	)

	const paginaSolicitada = paginaPorFiltro[filtrosKey] ?? 1
	const paginaAtual = Math.min(paginaSolicitada, totalPaginas)

	const produtosPaginaAtual = useMemo(() => {
		const start = (paginaAtual - 1) * PRODUTOS_POR_PAGINA
		const end = start + PRODUTOS_POR_PAGINA
		return produtosFiltrados.slice(start, end)
	}, [paginaAtual, produtosFiltrados])

	return (
		<Container className="py-8 sm:py-10 lg:py-12">
			<section aria-labelledby="catalogo-title">
				<h1 id="catalogo-title" className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
					Catálogo de Produtos
				</h1>
				<p className="mt-2 text-slate-300">
					Quantidade de produtos encontrados: {produtosFiltrados.length.toLocaleString('pt-BR')}
				</p>
				{!isLoading && !errorMessage && produtosFiltrados.length > 0 && (
					<p className="mt-1 text-sm text-slate-400">
						Exibindo pagina {paginaAtual} de {totalPaginas}
					</p>
				)}
			</section>

			{isLoading && (
				<p className="mt-8 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
					Carregando produtos...
				</p>
			)}

			{errorMessage && (
				<p
					role="alert"
					className="mt-8 rounded-lg border border-rose-700 bg-rose-950/40 p-4 text-sm text-rose-200"
				>
					{errorMessage}
				</p>
			)}

			{!isLoading && !errorMessage && produtosFiltrados.length === 0 && (
				<p className="mt-8 rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
					Nenhum produto encontrado com os filtros atuais.
				</p>
			)}

			{!isLoading && !errorMessage && produtosFiltrados.length > 0 && (
				<section className="mt-6 sm:mt-8" aria-label="Lista de produtos">
					<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{produtosPaginaAtual.map((produto) => (
							<ProductCard
								key={produto.idProduto}
								produto={produto}
								categoriaImagemUrl={
									categoriaImagemPorCategoria[
										normalizeCategoriaProduto(produto.categoriaProduto)
									]
								}
								metricaProduto={metricasPorProdutoId[produto.idProduto]}
							/>
						))}
					</ul>

					{produtosFiltrados.length > PRODUTOS_POR_PAGINA && (
						<div className="mt-8 overflow-x-auto pb-1">
							<div className="flex min-w-max justify-center">
							<Pagination
								current={paginaAtual}
								pageSize={PRODUTOS_POR_PAGINA}
								total={produtosFiltrados.length}
								showSizeChanger={false}
								onChange={(page) => {
									setPaginaPorFiltro((prev) => ({
										...prev,
										[filtrosKey]: page,
									}))
								}}
							/>
							</div>
						</div>
					)}
				</section>
			)}
		</Container>
	)
}

export default CatalogoPage

