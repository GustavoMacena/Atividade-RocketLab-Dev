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
        className="aspect-[4/3] object-cover"
        hasBorder={false}
      />
      <div className="mt-3 sm:mt-4">
        <ProductCategoryBadge label={categoriaLabel} />
        <h2 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-100 sm:text-base">
          {nomeProduto}
        </h2>
      </div>
    </>
  )
}

export default ProductCardHeader
