import type { ReactNode } from 'react'

export function PageHero({ eyebrow, title, description, children, tone = 'charcoal', image, secondaryImage, variant = 'standard' }: { eyebrow: string; title: ReactNode; description: string; children?: ReactNode; tone?: 'charcoal' | 'green'; image?: string; secondaryImage?: string; variant?: 'standard' | 'training' | 'catalogue' | 'contact' }) {
  return <section className={`page-hero page-hero--${tone}${image ? ' page-hero--split' : ''}${variant === 'training' ? ' page-hero--training' : ''}${variant === 'catalogue' ? ' page-hero--catalogue' : ''}${variant === 'contact' ? ' page-hero--contact' : ''}`}>
    <div className="container page-hero__grid">
      <div className="page-hero__copy">
        <div className="eyebrow eyebrow--copper"><span />{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children && <div className="hero__actions">{children}</div>}
        {variant === 'training' && <div className="page-hero__delivery"><span>In-Person</span><i aria-hidden="true">•</i><span>Online</span></div>}
      </div>
      {image && <div className="page-hero__image"><div className="page-hero__photo"><img src={image} alt="" fetchPriority="high" /></div>{secondaryImage && <div className="page-hero__photo page-hero__photo--secondary"><img src={secondaryImage} alt="" /></div>}</div>}
    </div>
  </section>
}
