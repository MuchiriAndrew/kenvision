import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { RichTextView } from '@/components/RichTextView'
import { getPublishedPage } from '@/lib/cms'
import { entryMetadata } from '@/lib/seo'
import type { Media, Page } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }
type PageBlock = NonNullable<Page['layout']>[number]

function media(value: number | Media | null | undefined) {
  return value && typeof value === 'object' ? value : null
}

function safeHref(value: string | null | undefined) {
  if (!value) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

function Block({ block }: { block: PageBlock }) {
  if (block.blockType === 'richText') return (
    <section className="section section--white"><div className="container cms-richtext prose">
      {block.heading && <h2>{block.heading}</h2>}
      <RichTextView value={block.content} />
    </div></section>
  )
  if (block.blockType === 'imageText') {
    const image = media(block.image)
    return <section className="section section--sand"><div className="container cms-image-text">
      <div className="prose"><h2>{block.heading}</h2><RichTextView value={block.content} /></div>
      {image?.url && <figure><img src={image.url} alt={image.alt || ''} loading="lazy" /></figure>}
    </div></section>
  }
  if (block.blockType === 'cards') return (
    <section className="section section--white"><div className="container">
      {block.heading && <h2 className="cms-section-title">{block.heading}</h2>}
      <div className="cms-card-grid">{block.items?.map((item, index) => {
        const image = media(item.image)
        const href = safeHref(item.link)
        const content = <>
          {image?.url && <img src={image.url} alt={image.alt || ''} loading="lazy" />}
          <div><h3>{item.title}</h3>{item.text && <p>{item.text}</p>}{href && <span className="text-link">Learn more →</span>}</div>
        </>
        return href
          ? <Link className="cms-card" href={href} key={item.id || index}>{content}</Link>
          : <article className="cms-card" key={item.id || index}>{content}</article>
      })}</div>
    </div></section>
  )
  const href = safeHref(block.url)
  return <section className="cms-cta"><div className="container cms-cta__inner">
    <h2>{block.heading}</h2>{block.text && <p>{block.text}</p>}
    {href && <Link href={href} className="btn-copper">{block.label || 'Get in touch'} <span>→</span></Link>}
  </div></section>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) return { title: 'Page not found', robots: { index: false } }
  return entryMetadata(page, { title: page.title, description: page.summary || page.hero?.subheading || page.title }, `/${slug}`)
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const page = await getPublishedPage(slug)
  if (!page) notFound()
  const hero = page.hero
  const heroImage = media(hero?.image)
  return <>
    <PageHero
      eyebrow={hero?.eyebrow || 'Kenvision Techniks'}
      title={hero?.heading || page.title}
      description={hero?.subheading || page.summary || ''}
      image={heroImage?.url || undefined}
    />
    {page.layout?.map((block, index) => <Block block={block} key={block.id || index} />)}
  </>
}
