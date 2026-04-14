import { useMemo } from 'react'

import Container from '../components/atoms/container'
import ProductCard from '../components/organisms/productCard'
import { useCategoriasImagens } from '../hooks/useCategoriasImagens'
import { useCatalogFiltersContext } from '../hooks/useCatalogFiltersContext'
import { useProdutos } from '../hooks/useProdutos'
import { useProdutosMetricas } from '../hooks/useProdutosMetricas'
import type { Produto } from '../types/produto'
import { normalizeCategoriaProduto } from '../utils/categoriaProduto'

function CatalogoPage() {
	const { produtos, isLoading, errorMessage } = useProdutos()
	const { categoriaImagemPorCategoria } = useCategoriasImagens()
	const { filters } = useCatalogFiltersContext()
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

	return (
		<Container className="py-10 sm:py-12">
			<section aria-labelledby="catalogo-title">
				<h1 id="catalogo-title" className="text-3xl font-semibold tracking-tight text-slate-100">
					Catalogo de Produtos
				</h1>
				<p className="mt-2 text-slate-300">
					Lista de produtos carregada da API do backend.
				</p>
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
				<section className="mt-8" aria-label="Lista de produtos">
					<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{produtosFiltrados.map((produto) => (
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
				</section>
			)}
		</Container>
	)
}

export default CatalogoPage

