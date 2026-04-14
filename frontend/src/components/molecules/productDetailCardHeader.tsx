import ProductCardImage from '../atoms/productCardImage'
import ProductCategoryBadge from '../atoms/productCategoryBadge'
import { formatCategoriaProduto } from '../../utils/categoriaProduto'

type ProductDetailCardHeaderProps = {
  nomeProduto: string
  categoriaProduto: string
  categoriaImagemUrl?: string
}

const DETAIL_IMAGE_MODEL_CLASS_NAME =
  'h-64 sm:h-72 lg:h-100 object-cover'

function ProductDetailCardHeader({
  nomeProduto,
  categoriaProduto,
  categoriaImagemUrl,
}: ProductDetailCardHeaderProps) {
  const categoriaLabel = formatCategoriaProduto(categoriaProduto)

  return (
    <div>
      <ProductCardImage
        imageUrl={categoriaImagemUrl}
        imageAlt={`Categoria ${categoriaLabel}`}
        className={DETAIL_IMAGE_MODEL_CLASS_NAME}
      />

      <div className="mt-5">
        <ProductCategoryBadge label={categoriaLabel} />
        <h1
          id="produto-detalhe-title"
          className="mt-2 text-3xl font-semibold tracking-tight text-slate-100"
        >
          {nomeProduto}
        </h1>
      </div>
    </div>
  )
}

export default ProductDetailCardHeader
