import ProductSpecRow from '../atoms/productSpecRow'

type ProductDetailCardInfoListProps = {
  idProduto: string
  categoriaProdutoLabel: string
  imagemCategoriaStatus: string
  tamanhoProduto: string
  pesoProduto: string
  quantidadeVendida: string
  mediaAvaliacao: string
}

function ProductDetailCardInfoList({
  idProduto,
  categoriaProdutoLabel,
  imagemCategoriaStatus,
  tamanhoProduto,
  pesoProduto,
  quantidadeVendida,
  mediaAvaliacao,
}: ProductDetailCardInfoListProps) {
  return (
    <dl className="mt-6 space-y-3 text-sm text-slate-300">
      <ProductSpecRow label="ID do produto" value={idProduto} truncateValue />
      <ProductSpecRow label="Categoria" value={categoriaProdutoLabel} />
      <ProductSpecRow label="Imagem da categoria" value={imagemCategoriaStatus} />
      <ProductSpecRow label="Tamanho" value={tamanhoProduto} />
      <ProductSpecRow label="Peso" value={pesoProduto} />
      <ProductSpecRow label="Qtd. vendida" value={quantidadeVendida} />
      <ProductSpecRow label="Media de avaliacoes" value={mediaAvaliacao} />
    </dl>
  )
}

export default ProductDetailCardInfoList
