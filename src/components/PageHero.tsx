import type { ReactNode } from 'react'

export function PageHero({ eyebrow, title, description, children, tone = 'charcoal', image }: { eyebrow: string; title: string; description: string; children?: ReactNode; tone?: 'charcoal' | 'green'; image?: string }) {
  return <section className={`page-hero page-hero--${tone}`}>
    <div className="container page-hero__grid">
      <div className="page-hero__copy">
        <div className="eyebrow eyebrow--copper"><span />{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children && <div className="hero__actions">{children}</div>}
      </div>
      {image && <div className="page-hero__image"><img src={image} alt="" fetchPriority="high" /></div>}
    </div>
  </section>
}
