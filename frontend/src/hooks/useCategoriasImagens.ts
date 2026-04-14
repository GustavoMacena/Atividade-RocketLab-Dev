import { useEffect, useState } from 'react'

import { listCategoriasImagens } from '../services/categoriasImagens'
import { normalizeCategoriaProduto } from '../utils/categoriaProduto'

type CategoriaImagemPorCategoria = Record<string, string>

type UseCategoriasImagensResult = {
  categoriaImagemPorCategoria: CategoriaImagemPorCategoria
  categoriasDisponiveis: string[]
}

export function useCategoriasImagens(): UseCategoriasImagensResult {
  const [categoriaImagemPorCategoria, setCategoriaImagemPorCategoria] =
    useState<CategoriaImagemPorCategoria>({})
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<string[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadCategoriasImagens() {
      try {
        const categoriasImagens = await listCategoriasImagens(controller.signal)

        const map: CategoriaImagemPorCategoria = {}
        categoriasImagens.forEach((item) => {
          map[normalizeCategoriaProduto(item.categoria)] = item.link
        })

        setCategoriaImagemPorCategoria(map)
        setCategoriasDisponiveis(
          Object.keys(map).sort((a, b) => a.localeCompare(b, 'pt-BR')),
        )
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setCategoriaImagemPorCategoria({})
        setCategoriasDisponiveis([])
      }
    }

    loadCategoriasImagens()

    return () => {
      controller.abort()
    }
  }, [])

  return {
    categoriaImagemPorCategoria,
    categoriasDisponiveis,
  }
}
