import { useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import { Navigate, Route, Routes } from 'react-router-dom'

import Container from './components/atoms/container'
import CatalogFiltersBar from './components/organisms/catalogFiltersBar'
import Header from './components/organisms/header'
import { CatalogFiltersProvider } from './contexts/catalogFiltersContext'
import CatalogoPage from './pages/catalogo'
import ProdutoDetalhePage from './pages/produtoDetalhe'

const { darkAlgorithm } = theme

function CatalogoLayout() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  return (
    <>
      <Header
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => {
          setIsFiltersOpen((prev) => !prev)
        }}
      />

      <div
        id="catalog-filters-panel"
        className={[
          'overflow-hidden border-b border-slate-800 bg-slate-900/80 backdrop-blur transition-all duration-300 ease-out',
          isFiltersOpen
            ? 'max-h-[36rem] translate-y-0 opacity-100'
            : 'max-h-0 -translate-y-2 opacity-0',
        ].join(' ')}
      >
        <Container className="py-4">
          <CatalogFiltersBar />
        </Container>
      </div>

      <main>
        <CatalogoPage />
      </main>
    </>
  )
}

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#38bdf8',
          colorBgBase: '#020617',
          colorBgContainer: '#0f172a',
          colorTextBase: '#e2e8f0',
          colorBorder: '#334155',
          borderRadius: 10,
        },
      }}
    >
      <CatalogFiltersProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Routes>
            <Route path="/" element={<CatalogoLayout />} />
            <Route path="/catalogo" element={<CatalogoLayout />} />
            <Route path="/produtos/:idProduto" element={<ProdutoDetalhePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </CatalogFiltersProvider>
    </ConfigProvider>
  )
}

export default App