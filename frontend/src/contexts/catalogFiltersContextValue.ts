import { createContext, type Dispatch, type SetStateAction } from 'react'

import type { CatalogFilters } from '../types/catalogFilters'

export type CatalogFiltersContextValue = {
  filters: CatalogFilters
  setFilters: Dispatch<SetStateAction<CatalogFilters>>
}

export const CatalogFiltersContext =
  createContext<CatalogFiltersContextValue | undefined>(undefined)
