import { useMemo } from 'react'

import CatalogCategorySelect, {
  type CategoryOption,
} from '../atoms/catalogCategorySelect'
import FilterRangeControl from '../atoms/filterRangeControl'
import { useCatalogFiltersContext } from '../../hooks/useCatalogFiltersContext'
import CatalogFilterField from '../molecules/catalogFilterField'
import type { Produto } from '../../types/produto'
import {
  formatCategoriaProduto,
  normalizeCategoriaProduto,
} from '../../utils/categoriaProduto'

const QUANTIDADE_VENDIDA_MAXIMA = 20

type CatalogFiltersBarProps = {
  produtos: Produto[]
}

function CatalogFiltersBar({ produtos }: CatalogFiltersBarProps) {
  const { filters, setFilters } = useCatalogFiltersContext()
  const categorySelectId = 'catalog-category-filter'
  const ratingInputId = 'catalog-min-rating'
  const quantityInputId = 'catalog-min-quantity'

  const categoriaOptions: CategoryOption[] = useMemo(() => {
    const categoriasMap = new Map<string, string>()

    produtos.forEach((produto) => {
      const categoriaNormalizada = normalizeCategoriaProduto(produto.categoriaProduto)

      if (!categoriasMap.has(categoriaNormalizada)) {
        categoriasMap.set(
          categoriaNormalizada,
          formatCategoriaProduto(produto.categoriaProduto),
        )
      }
    })

    return Array.from(categoriasMap.entries())
      .sort(([, labelA], [, labelB]) => labelA.localeCompare(labelB, 'pt-BR'))
      .map(([value, label]) => ({ value, label }))
  }, [produtos])

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CatalogFilterField label="Categoria" htmlFor={categorySelectId}>
          <CatalogCategorySelect
            id={categorySelectId}
            options={categoriaOptions}
            value={filters.categoriaSelecionada}
            onChange={(nextValue) => {
              setFilters((prev) => ({
                ...prev,
                categoriaSelecionada: nextValue,
              }))
            }}
          />
        </CatalogFilterField>

        <CatalogFilterField label="Media minima da avaliacao" htmlFor={ratingInputId}>
          <FilterRangeControl
            min={0}
            max={5}
            step={0.1}
            precision={1}
            inputId={ratingInputId}
            value={filters.mediaAvaliacaoMinima}
            onChange={(nextValue) => {
              setFilters((prev) => ({
                ...prev,
                mediaAvaliacaoMinima: nextValue,
              }))
            }}
          />
        </CatalogFilterField>

        <CatalogFilterField label="Quantidade vendida minima" htmlFor={quantityInputId}>
          <FilterRangeControl
            min={0}
            max={QUANTIDADE_VENDIDA_MAXIMA}
            step={1}
            precision={0}
            inputId={quantityInputId}
            marks={{ 0: '0', [QUANTIDADE_VENDIDA_MAXIMA]: '20' }}
            value={filters.quantidadeVendidaMinima}
            onChange={(nextValue) => {
              setFilters((prev) => ({
                ...prev,
                quantidadeVendidaMinima: nextValue,
              }))
            }}
          />
        </CatalogFilterField>
      </div>
    </section>
  )
}

export default CatalogFiltersBar
