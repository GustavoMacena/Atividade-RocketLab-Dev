export type CatalogFilters = {
  termoPesquisa: string
  categoriaSelecionada: string | null
  mediaAvaliacaoMinima: number
  quantidadeVendidaMinima: number
}

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  termoPesquisa: '',
  categoriaSelecionada: null,
  mediaAvaliacaoMinima: 0,
  quantidadeVendidaMinima: 0,
}
