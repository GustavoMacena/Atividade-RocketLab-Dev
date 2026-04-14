import { useEffect, useMemo, useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import { Navigate, Route, Routes } from 'react-router-dom'

import Container from './components/atoms/container'
import CatalogFiltersBar from './components/organisms/catalogFiltersBar'
import Header from './components/organisms/header'
import { CatalogFiltersProvider } from './contexts/catalogFiltersContext'
import { useProdutos } from './hooks/useProdutos'
import CatalogoPage from './pages/catalogo'
import ProdutoDetalhePage from './pages/produtoDetalhe'

const { darkAlgorithm, defaultAlgorithm } = theme

type ThemeMode = 'dark' | 'light'

const THEME_MODE_STORAGE_KEY = 'app-theme-mode'

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedThemeMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY)

  if (storedThemeMode === 'dark' || storedThemeMode === 'light') {
    return storedThemeMode
  }

  return 'dark'
}

type CatalogoLayoutProps = {
  isDarkMode: boolean
  onToggleTheme: (checked: boolean) => void
}

function CatalogoLayout({ isDarkMode, onToggleTheme }: CatalogoLayoutProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const { produtos, isLoading, errorMessage, upsertProdutoLocal } = useProdutos()

  const categoriasProdutoExistentes = useMemo(() => {
    const categorias = Array.from(
      new Set(produtos.map((produto) => produto.categoriaProduto)),
    )
    categorias.sort((a, b) => a.localeCompare(b, 'pt-BR'))
    return categorias
  }, [produtos])

  return (
    <>
      <Header
        isFiltersOpen={isFiltersOpen}
        isDarkMode={isDarkMode}
        categoriasProdutoExistentes={categoriasProdutoExistentes}
        onToggleFilters={() => {
          setIsFiltersOpen((prev) => !prev)
        }}
        onToggleTheme={onToggleTheme}
        onProdutoCriado={upsertProdutoLocal}
      />

      <div
        id="catalog-filters-panel"
        className={[
          'overflow-hidden border-b backdrop-blur transition-all duration-300 ease-out',
          isDarkMode
            ? 'border-slate-800 bg-slate-900/80'
            : 'border-slate-200 bg-white/85',
          isFiltersOpen
            ? 'max-h-[48rem] translate-y-0 opacity-100 sm:max-h-[36rem]'
            : 'max-h-0 -translate-y-2 opacity-0',
        ].join(' ')}
      >
        <Container className="py-4">
          <CatalogFiltersBar produtos={produtos} />
        </Container>
      </div>

      <main>
        <CatalogoPage
          produtos={produtos}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </main>
    </>
  )
}

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialThemeMode())
  const isDarkMode = themeMode === 'dark'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode)
    window.document.documentElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: isDarkMode ? '#60a5fa' : '#2563eb',
          colorBgBase: isDarkMode ? '#0f1115' : '#f8fafc',
          colorBgContainer: isDarkMode ? '#171b22' : '#ffffff',
          colorTextBase: isDarkMode ? '#e5e7eb' : '#0f172a',
          colorBorder: isDarkMode ? '#303745' : '#cbd5e1',
          borderRadius: 12,
        },
      }}
    >
      <CatalogFiltersProvider>
        <div
          className={[
            'min-h-screen overflow-x-hidden transition-colors duration-300',
            isDarkMode
              ? 'app-theme-dark bg-slate-950 text-slate-100'
              : 'app-theme-light bg-slate-50 text-slate-900',
          ].join(' ')}
        >
          <Routes>
            <Route
              path="/"
              element={
                <CatalogoLayout
                  isDarkMode={isDarkMode}
                  onToggleTheme={(checked) => {
                    setThemeMode(checked ? 'dark' : 'light')
                  }}
                />
              }
            />
            <Route path="/produtos/:idProduto" element={<ProdutoDetalhePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CatalogFiltersProvider>
    </ConfigProvider>
  )
}

export default App