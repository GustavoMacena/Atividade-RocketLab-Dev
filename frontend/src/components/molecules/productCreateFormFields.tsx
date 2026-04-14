import { Form, Input, InputNumber, Select } from 'antd'

import type { ProductCreateCategoryOption } from '../organisms/productCreateModal'

type ProductCreateFormFieldsProps = {
  categoriaOptions: ProductCreateCategoryOption[]
}

function ProductCreateFormFields({ categoriaOptions }: ProductCreateFormFieldsProps) {
  return (
    <>
      <Form.Item
        name="idProduto"
        label="ID do produto"
        rules={[
          { required: true, whitespace: true, message: 'Informe o ID do produto.' },
          { max: 32, message: 'Use no maximo 32 caracteres.' },
        ]}
      >
        <Input placeholder="Ex.: PROD_000001" maxLength={32} />
      </Form.Item>

      <Form.Item
        name="nomeProduto"
        label="Nome do produto"
        rules={[
          { required: true, whitespace: true, message: 'Informe o nome do produto.' },
          { max: 255, message: 'Use no maximo 255 caracteres.' },
        ]}
      >
        <Input placeholder="Digite o nome do produto" maxLength={255} />
      </Form.Item>

      <Form.Item
        name="categoriaProduto"
        label="Categoria"
        rules={[
          { required: true, message: 'Selecione uma categoria existente.' },
        ]}
      >
        <Select
          showSearch
          placeholder="Selecione a categoria"
          options={categoriaOptions}
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        name="pesoProdutoGramas"
        label="Peso (gramas)"
        rules={[{ required: true, message: 'Informe o peso do produto.' }]}
      >
        <InputNumber
          min={0}
          step={1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 350"
        />
      </Form.Item>

      <Form.Item
        name="comprimentoCentimetros"
        label="Comprimento (cm)"
        rules={[{ required: true, message: 'Informe o comprimento do produto.' }]}
      >
        <InputNumber
          min={0}
          step={0.1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 20"
        />
      </Form.Item>

      <Form.Item
        name="alturaCentimetros"
        label="Altura (cm)"
        rules={[{ required: true, message: 'Informe a altura do produto.' }]}
      >
        <InputNumber
          min={0}
          step={0.1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 10"
        />
      </Form.Item>

      <Form.Item
        name="larguraCentimetros"
        label="Largura (cm)"
        rules={[{ required: true, message: 'Informe a largura do produto.' }]}
      >
        <InputNumber
          min={0}
          step={0.1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 15"
        />
      </Form.Item>
    </>
  )
}

export default ProductCreateFormFields
