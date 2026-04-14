import ProductDetailCardHeader from '../molecules/productDetailCardHeader'
import ProductDetailCardInfoList from '../molecules/productDetailCardInfoList'

type ProductDetailCardProps = {
  idProduto: string
  nomeProduto: string
  categoriaProduto: string
  categoriaProdutoLabel: string
  categoriaImagemUrl?: string
  imagemCategoriaStatus: string
  tamanhoProduto: string
  pesoProduto: string
  quantidadeVendida: string
  mediaAvaliacao: string
}

function ProductDetailCard({
  idProduto,
  nomeProduto,
  categoriaProduto,
  categoriaProdutoLabel,
  categoriaImagemUrl,
  imagemCategoriaStatus,
  tamanhoProduto,
  pesoProduto,
  quantidadeVendida,
  mediaAvaliacao,
}: ProductDetailCardProps) {
  return (
    <section
      aria-labelledby="produto-detalhe-title"
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/25 sm:p-6 lg:p-8"
    >
      <ProductDetailCardHeader
        nomeProduto={nomeProduto}
        categoriaProduto={categoriaProduto}
        categoriaImagemUrl={categoriaImagemUrl}
      />

      <ProductDetailCardInfoList
        idProduto={idProduto}
        categoriaProdutoLabel={categoriaProdutoLabel}
        imagemCategoriaStatus={imagemCategoriaStatus}
        tamanhoProduto={tamanhoProduto}
        pesoProduto={pesoProduto}
        quantidadeVendida={quantidadeVendida}
        mediaAvaliacao={mediaAvaliacao}
      />
    </section>
  )
}

export default ProductDetailCard
