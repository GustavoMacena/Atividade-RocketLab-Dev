import { useState } from 'react'

const FALLBACK_IMAGE_URL = 'https://placehold.co/640x420?text=Sem+Imagem'

type ProductCardImageProps = {
  imageUrl?: string
  imageAlt: string
  className?: string
}

function ProductCardImage({ imageUrl, imageAlt, className }: ProductCardImageProps) {
  const [hasError, setHasError] = useState(false)
  const source = imageUrl && !hasError ? imageUrl : FALLBACK_IMAGE_URL
  const baseClassName = 'w-full rounded-lg border border-slate-700'
  const defaultImageModelClassName = 'h-50 object-cover'
  const imageClassName = className
    ? `${baseClassName} ${className}`
    : `${baseClassName} ${defaultImageModelClassName}`

  return (
    <img
      src={source}
      alt={imageAlt}
      loading="lazy"
      className={imageClassName}
      onError={() => setHasError(true)}
    />
  )
}

export default ProductCardImage
