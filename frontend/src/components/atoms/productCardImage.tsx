import { useState } from 'react'

const FALLBACK_IMAGE_URL = 'https://placehold.co/640x420?text=Sem+Imagem'

type ProductCardImageProps = {
  imageUrl?: string
  imageAlt: string
  className?: string
  hasBorder?: boolean
}

function ProductCardImage({
  imageUrl,
  imageAlt,
  className,
  hasBorder = true,
}: ProductCardImageProps) {
  const [hasError, setHasError] = useState(false)
  const source = imageUrl && !hasError ? imageUrl : FALLBACK_IMAGE_URL
  const baseClassName = 'w-full rounded-lg'
  const borderClassName = hasBorder ? 'border border-slate-700' : 'border-0'
  const defaultImageModelClassName = 'aspect-[4/3] object-contain p-1 sm:p-2'
  const imageClassName = className
    ? `${baseClassName} ${borderClassName} ${className}`
    : `${baseClassName} ${borderClassName} ${defaultImageModelClassName}`

  return (
    <img
      src={source}
      alt={imageAlt}
      loading="lazy"
      className={imageClassName}
      style={{ backgroundColor: 'var(--image-surface)' }}
      onError={() => setHasError(true)}
    />
  )
}

export default ProductCardImage
