import { Link } from 'react-router-dom'

import type { Produto } from '../../types/produto'
import type { ProdutoMetrica } from '../../types/produtoMetrica'
import ProductCardDetails from '../molecules/productCardDetails'
import ProductCardHeader from '../molecules/productCardHeader'

type ProductCardProps = {
  produto: Produto
  categoriaImagemUrl?: string
  metricaProduto?: ProdutoMetrica
}

function ProductCard({ produto, categoriaImagemUrl, metricaProduto }: ProductCardProps) {
  return (
    <li>
      <Link
        to={`/produtos/${produto.idProduto}`}
        state={{ nomeProduto: produto.nomeProduto }}
        aria-label={`Abrir detalhes do produto ${produto.nomeProduto}`}
        className="block rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/25 transition hover:border-cyan-500/60 hover:shadow-cyan-950/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <ProductCardHeader
          nomeProduto={produto.nomeProduto}
          categoriaProduto={produto.categoriaProduto}
          categoriaImagemUrl={categoriaImagemUrl}
        />
        <ProductCardDetails produto={produto} metricaProduto={metricaProduto} />
      </Link>
    </li>
  )
}

export default ProductCard
