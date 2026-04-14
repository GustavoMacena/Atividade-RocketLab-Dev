import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

function Container({ children, className = '' }: ContainerProps) {
  const baseClassName = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'
  const containerClassName = className
    ? baseClassName + ' ' + className
    : baseClassName

  return <div className={containerClassName}>{children}</div>
}

export default Container