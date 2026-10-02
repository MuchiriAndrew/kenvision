'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  as?: ElementType
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

export function ScrollReveal({ children, as: Tag = 'div', delay = 0, direction = 'up', className = '' }: Props) {
  const target = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('motion-ready')
    if (!target.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' })
    observer.observe(target.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={target}
      className={`reveal reveal--${direction} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
