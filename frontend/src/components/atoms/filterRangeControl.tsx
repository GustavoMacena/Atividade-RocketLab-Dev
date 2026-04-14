import { InputNumber, Slider } from 'antd'

type FilterRangeControlProps = {
  min: number
  max: number
  step: number
  value: number
  inputId?: string
  precision?: number
  marks?: Record<number, string>
  onChange: (value: number) => void
}

function FilterRangeControl({
  min,
  max,
  step,
  value,
  inputId,
  precision,
  marks,
  onChange,
}: FilterRangeControlProps) {
  function clampAndNormalize(nextValue: number): number {
    const clampedValue = Math.min(Math.max(nextValue, min), max)

    if (precision === undefined) {
      return clampedValue
    }

    return Number(clampedValue.toFixed(precision))
  }

  function parseNumericInput(rawValue: string | undefined): number {
    const source = (rawValue ?? '').replace(',', '.')

    if (precision === 0) {
      const integerOnly = source.replace(/\D/g, '')
      if (!integerOnly) {
        return min
      }

      return Number(integerOnly)
    }

    const sanitized = source.replace(/[^\d.]/g, '')
    const [integerPart = '', ...decimalParts] = sanitized.split('.')
    const mergedDecimal = decimalParts.join('')

    if (!integerPart && !mergedDecimal) {
      return min
    }

    if (precision && precision > 0 && mergedDecimal) {
      return Number(`${integerPart}.${mergedDecimal.slice(0, precision)}`)
    }

    return Number(integerPart || sanitized)
  }

  function handleSliderChange(nextValue: number | number[]) {
    if (typeof nextValue !== 'number') {
      return
    }

    onChange(clampAndNormalize(nextValue))
  }

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Slider
        min={min}
        max={max}
        step={step}
        marks={marks}
        value={value}
        onChange={handleSliderChange}
        className="w-full flex-1"
      />
      <InputNumber
        id={inputId}
        min={min}
        max={max}
        step={step}
        precision={precision}
        parser={parseNumericInput}
        inputMode={precision === 0 ? 'numeric' : 'decimal'}
        value={value}
        className="w-full sm:w-24"
        onChange={(nextValue) => {
          const normalizedValue = nextValue ?? min
          onChange(clampAndNormalize(normalizedValue))
        }}
      />
    </div>
  )
}

export default FilterRangeControl
