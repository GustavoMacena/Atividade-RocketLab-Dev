import { useMemo, useState } from 'react'
import { Button, Switch, message } from 'antd'
import { Link } from 'react-router-dom'

import { useCatalogFiltersContext } from '../../hooks/useCatalogFiltersContext'
import {
  createProduto,
  type CreateProdutoPayload,
} from '../../services/produtos'
import type { Produto } from '../../types/produto'
import type { ProdutoCreateFormValues } from '../../types/produtoCreateFormValues'
import {
  formatCategoriaProduto,
  normalizeCategoriaProduto,
} from '../../utils/categoriaProduto'
import CatalogSearchInput from '../atoms/catalogSearchInput'
import Container from '../atoms/container'
import ProductCreateModal, {
  type ProductCreateCategoryOption,
} from './productCreateModal'

type HeaderProps = {
  isFiltersOpen: boolean
  isDarkMode: boolean
  categoriasProdutoExistentes: string[]
  onToggleFilters: () => void
  onToggleTheme: (checked: boolean) => void
  onProdutoCriado: (produto: Produto) => void
}

function Header({
  isFiltersOpen,
  isDarkMode,
  categoriasProdutoExistentes,
  onToggleFilters,
  onToggleTheme,
  onProdutoCriado,
}: HeaderProps) {
  const { filters, setFilters } = useCatalogFiltersContext()
  const [isModalCriarAberto, setIsModalCriarAberto] = useState(false)
  const [isCriandoProduto, setIsCriandoProduto] = useState(false)
  const searchInputId = 'catalog-search-input'

  const categoriaOptions = useMemo<ProductCreateCategoryOption[]>(() => {
    const optionsMap = new Map<string, ProductCreateCategoryOption>()

    categoriasProdutoExistentes.forEach((categoriaProduto) => {
      const categoriaNormalizada = normalizeCategoriaProduto(categoriaProduto)

      if (!categoriaNormalizada || optionsMap.has(categoriaNormalizada)) {
        return
      }

      optionsMap.set(categoriaNormalizada, {
        value: categoriaProduto,
        label: formatCategoriaProduto(categoriaProduto),
      })
    })

    return Array.from(optionsMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label, 'pt-BR'),
    )
  }, [categoriasProdutoExistentes])

  function abrirModalCriarProduto() {
    if (categoriaOptions.length === 0) {
      message.warning('Nao ha categorias disponiveis para criar o produto.')
      return
    }

    setIsModalCriarAberto(true)
  }

  function fecharModalCriarProduto() {
    setIsModalCriarAberto(false)
  }

  async function criarProduto(valores: ProdutoCreateFormValues) {
    try {
      const payload: CreateProdutoPayload = {
        idProduto: valores.idProduto.trim(),
        nomeProduto: valores.nomeProduto.trim(),
        categoriaProduto: valores.categoriaProduto,
        pesoProdutoGramas: valores.pesoProdutoGramas,
        comprimentoCentimetros: valores.comprimentoCentimetros,
        alturaCentimetros: valores.alturaCentimetros,
        larguraCentimetros: valores.larguraCentimetros,
      }

      setIsCriandoProduto(true)

      const produtoCriado = await createProduto(payload)

      onProdutoCriado(produtoCriado)
      setIsModalCriarAberto(false)
      message.success('Produto criado com sucesso.')
    } catch (error) {
      const mensagemErro =
        error instanceof Error && error.message
          ? error.message
          : 'Falha ao criar o produto.'

      message.error(mensagemErro)
    } finally {
      setIsCriandoProduto(false)
    }
  }

  return (
    <header
      className={[
        'border-b backdrop-blur',
        isDarkMode
          ? 'border-slate-800 bg-slate-900/80'
          : 'border-slate-200 bg-white/85',
      ].join(' ')}
    >
      <Container className="py-4">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(12rem,auto)_1fr_auto] lg:items-center">
          <Link
            to="/"
            className={[
              'text-sm font-semibold tracking-tight sm:text-base',
              isDarkMode ? 'text-slate-100' : 'text-slate-900',
            ].join(' ')}
          >
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

          <div className="flex w-full items-center justify-between gap-3 justify-self-start lg:w-auto lg:justify-self-end">
            <Switch
              checked={isDarkMode}
              checkedChildren="Dark"
              unCheckedChildren="Light"
              aria-label="Alternar tema escuro e claro"
              onChange={onToggleTheme}
            />

            <Button type="primary" onClick={abrirModalCriarProduto}>
              Criar produto
            </Button>

            <Button
              type={isFiltersOpen ? 'primary' : 'default'}
              onClick={onToggleFilters}
              aria-expanded={isFiltersOpen}
              aria-controls="catalog-filters-panel"
            >
              Filtros
            </Button>
          </div>
        </div>
      </Container>

      <ProductCreateModal
        isOpen={isModalCriarAberto}
        isSubmitting={isCriandoProduto}
        categoriaOptions={categoriaOptions}
        onCancel={fecharModalCriarProduto}
        onSubmit={criarProduto}
      />
    </header>
  )
}

export default Header