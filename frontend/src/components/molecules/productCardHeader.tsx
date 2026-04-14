import ProductCardImage from '../atoms/productCardImage'
import ProductCategoryBadge from '../atoms/productCategoryBadge'
import { formatCategoriaProduto } from '../../utils/categoriaProduto'

type ProductCardHeaderProps = {
  nomeProduto: string
  categoriaProduto: string
  categoriaImagemUrl?: string
}

function ProductCardHeader({
  nomeProduto,
  categoriaProduto,
  categoriaImagemUrl,
}: ProductCardHeaderProps) {
  const categoriaLabel = formatCategoriaProduto(categoriaProduto)

  return (
    <>
      <ProductCardImage
        imageUrl={categoriaImagemUrl}
        imageAlt={`Categoria ${categoriaLabel}`}
      />
      <div className="mt-4">
        <ProductCategoryBadge label={categoriaLabel} />
        <h2 className="mt-1 text-base font-semibold text-slate-100">{nomeProduto}</h2>
      </div>
    </>
  )
}

export default ProductCardHeader
