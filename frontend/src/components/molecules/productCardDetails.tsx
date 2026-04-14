import type { Produto } from '../../types/produto'
import type { ProdutoMetrica } from '../../types/produtoMetrica'
import { formatMaskedProductId } from '../../utils/formatters'
import ProductSpecRow from '../atoms/productSpecRow'

type ProductCardDetailsProps = {
  produto: Produto
  metricaProduto?: ProdutoMetrica
}

function ProductCardDetails({ produto, metricaProduto }: ProductCardDetailsProps) {
  const mediaAvaliacao =
    metricaProduto?.mediaAvaliacao !== null &&
    metricaProduto?.mediaAvaliacao !== undefined
      ? metricaProduto.mediaAvaliacao.toFixed(1)
      : '-'

  const quantidadeVendida = (metricaProduto?.quantidadeVendida ?? 0).toLocaleString(
    'pt-BR',
  )

  return (
    <dl className="mt-4 space-y-2 text-sm text-slate-300">
      <ProductSpecRow label="ID" value={formatMaskedProductId(produto.idProduto)} />
      <ProductSpecRow label="Média de avaliações" value={mediaAvaliacao} />
      <ProductSpecRow label="Quantidade vendida" value={quantidadeVendida} />
    </dl>
  )
}

export default ProductCardDetails
