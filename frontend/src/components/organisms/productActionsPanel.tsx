import { Button, Popconfirm } from 'antd'

type ProductActionsPanelProps = {
  onAtualizarProduto: () => void
  onRemoverProduto: () => void | Promise<void>
  isRemovendoProduto: boolean
}

function ProductActionsPanel({
  onAtualizarProduto,
  onRemoverProduto,
  isRemovendoProduto,
}: ProductActionsPanelProps) {
  return (
    <section
      aria-label="Acoes do produto"
      className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button type="primary" onClick={onAtualizarProduto} className="w-full sm:w-auto">
          Atualizar produto
        </Button>

        <Popconfirm
          title="Remover produto"
          description="Tem certeza que deseja remover este produto?"
          okText="Remover"
          cancelText="Cancelar"
          okButtonProps={{
            danger: true,
            loading: isRemovendoProduto,
          }}
          onConfirm={onRemoverProduto}
        >
          <Button danger loading={isRemovendoProduto} className="w-full sm:w-auto">
            Remover produto
          </Button>
        </Popconfirm>
      </div>
    </section>
  )
}

export default ProductActionsPanel
