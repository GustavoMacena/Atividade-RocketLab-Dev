import { useContext } from 'react'

import {
  CatalogFiltersContext,
  type CatalogFiltersContextValue,
} from '../contexts/catalogFiltersContextValue'

export function useCatalogFiltersContext(): CatalogFiltersContextValue {
  const context = useContext(CatalogFiltersContext)
  if (!context) {
    throw new Error('useCatalogFiltersContext deve ser usado dentro de CatalogFiltersProvider.')
  }

  return context
}
