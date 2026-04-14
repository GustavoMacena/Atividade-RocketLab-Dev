import { Form, Input, InputNumber } from 'antd'

function ProductUpdateFormFields() {
  return (
    <>
      <Form.Item
        name="nomeProduto"
        label="Nome do produto"
        rules={[
          { required: true, whitespace: true, message: 'Informe o nome do produto.' },
        ]}
      >
        <Input placeholder="Digite o nome do produto" maxLength={255} />
      </Form.Item>

      <Form.Item
        name="categoriaProduto"
        label="Categoria"
        rules={[
          { required: true, whitespace: true, message: 'Informe a categoria do produto.' },
        ]}
      >
        <Input placeholder="Digite a categoria" maxLength={100} />
      </Form.Item>

      <Form.Item name="pesoProdutoGramas" label="Peso (gramas)">
        <InputNumber
          min={0}
          step={1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 350"
        />
      </Form.Item>

      <Form.Item name="comprimentoCentimetros" label="Comprimento (cm)">
        <InputNumber
          min={0}
          step={0.1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 20"
        />
      </Form.Item>

      <Form.Item name="alturaCentimetros" label="Altura (cm)">
        <InputNumber
          min={0}
          step={0.1}
          precision={2}
          className="w-full"
          placeholder="Ex.: 10"
        />
      </Form.Item>

      <Form.Item name="larguraCentimetros" label="Largura (cm)">
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

export default ProductUpdateFormFields
