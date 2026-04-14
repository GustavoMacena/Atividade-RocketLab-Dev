import ProductCardImage from '../atoms/productCardImage'
import ProductCategoryBadge from '../atoms/productCategoryBadge'
import { formatCategoriaProduto } from '../../utils/categoriaProduto'

type ProductDetailCardHeaderProps = {
  nomeProduto: string
  categoriaProduto: string
  categoriaImagemUrl?: string
}

const DETAIL_IMAGE_MODEL_CLASS_NAME =
  'h-64 object-contain p-2 sm:h-80 sm:p-3 lg:h-[30rem]'

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
          className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl"
        >
          {nomeProduto}
        </h1>
      </div>
    </div>
  )
}

export default ProductDetailCardHeader
