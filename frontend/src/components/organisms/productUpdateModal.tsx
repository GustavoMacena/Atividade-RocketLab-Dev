import { Form, Modal } from 'antd'

import type { ProdutoUpdateFormValues } from '../../types/produtoUpdateFormValues'
import ProductUpdateFormFields from '../molecules/productUpdateFormFields'

type ProductUpdateModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  initialValues?: ProdutoUpdateFormValues
  onCancel: () => void
  onSubmit: (values: ProdutoUpdateFormValues) => void | Promise<void>
}

function ProductUpdateModal({
  isOpen,
  isSubmitting,
  initialValues,
  onCancel,
  onSubmit,
}: ProductUpdateModalProps) {
  const [form] = Form.useForm<ProdutoUpdateFormValues>()

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
      title="Atualizar produto"
      open={isOpen}
      width="min(640px, calc(100vw - 1.5rem))"
      okText="Salvar alteracoes"
      cancelText="Cancelar"
      destroyOnClose
      confirmLoading={isSubmitting}
      onCancel={onCancel}
      afterOpenChange={(aberto) => {
        if (aberto && initialValues) {
          form.setFieldsValue(initialValues)
        }
      }}
      onOk={() => {
        void handleSubmit()
      }}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={initialValues}
      >
        <ProductUpdateFormFields />
      </Form>
    </Modal>
  )
}

export default ProductUpdateModal
