type FilterFieldLabelProps = {
  text: string
  htmlFor?: string
}

function FilterFieldLabel({ text, htmlFor }: FilterFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm text-slate-300">
      {text}
    </label>
  )
}

export default FilterFieldLabel
