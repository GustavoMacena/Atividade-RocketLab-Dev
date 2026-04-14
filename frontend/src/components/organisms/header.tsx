import { Button } from 'antd'
import { Link } from 'react-router-dom'

import { useCatalogFiltersContext } from '../../hooks/useCatalogFiltersContext'
import CatalogSearchInput from '../atoms/catalogSearchInput'
import Container from '../atoms/container'

type HeaderProps = {
  isFiltersOpen: boolean
  onToggleFilters: () => void
}

function Header({ isFiltersOpen, onToggleFilters }: HeaderProps) {
  const { filters, setFilters } = useCatalogFiltersContext()
  const searchInputId = 'catalog-search-input'

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <Container className="py-4">
        <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <Link to="/" className="text-base font-semibold tracking-tight text-slate-100">
            Gerencia E-Commerce
          </Link>

          <div className="w-full">
            <label htmlFor={searchInputId} className="sr-only">
              Pesquisar produtos
            </label>
            <CatalogSearchInput
              id={searchInputId}
              value={filters.termoPesquisa}
              onChange={(nextValue) => {
                setFilters((prev) => ({
                  ...prev,
                  termoPesquisa: nextValue,
                }))
              }}
            />
          </div>

          <Button
            type={isFiltersOpen ? 'primary' : 'default'}
            onClick={onToggleFilters}
            aria-expanded={isFiltersOpen}
            aria-controls="catalog-filters-panel"
            className="justify-self-start lg:justify-self-end"
          >
            Filtros
          </Button>
        </div>
      </Container>
    </header>
  )
}

export default Header