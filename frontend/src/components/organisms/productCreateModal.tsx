import { Form, Modal } from 'antd'

import type { ProdutoCreateFormValues } from '../../types/produtoCreateFormValues'
import ProductCreateFormFields from '../molecules/productCreateFormFields'

export type ProductCreateCategoryOption = {
  value: string
  label: string
}

type ProductCreateModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  categoriaOptions: ProductCreateCategoryOption[]
  onCancel: () => void
  onSubmit: (values: ProdutoCreateFormValues) => void | Promise<void>
}

function ProductCreateModal({
  isOpen,
  isSubmitting,
  categoriaOptions,
  onCancel,
  onSubmit,
}: ProductCreateModalProps) {
  const [form] = Form.useForm<ProdutoCreateFormValues>()

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'errorFields' in error) {
        return
      }
    }
  }

  return (
    <Modal
      title="Criar produto"
      open={isOpen}
      width="min(640px, calc(100vw - 1.5rem))"
      okText="Criar"
      cancelText="Cancelar"
      destroyOnClose
      confirmLoading={isSubmitting}
      okButtonProps={{ disabled: categoriaOptions.length === 0 }}
      onCancel={onCancel}
      afterOpenChange={(aberto) => {
        if (aberto) {
          form.resetFields()
          if (categoriaOptions.length > 0) {
            form.setFieldValue('categoriaProduto', categoriaOptions[0].value)
          }
        }
      }}
      onOk={() => {
        void handleSubmit()
      }}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <ProductCreateFormFields categoriaOptions={categoriaOptions} />
      </Form>
    </Modal>
  )
}

export default ProductCreateModal
