import { useState, type ReactNode } from 'react'

import {
  DEFAULT_CATALOG_FILTERS,
} from '../types/catalogFilters'
import { CatalogFiltersContext } from './catalogFiltersContextValue'

type CatalogFiltersProviderProps = {
  children: ReactNode
}

export function CatalogFiltersProvider({ children }: CatalogFiltersProviderProps) {
  const [filters, setFilters] = useState(DEFAULT_CATALOG_FILTERS)

  return (
    <CatalogFiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </CatalogFiltersContext.Provider>
  )
}
