import type { Metadata } from 'next'

type CmsMeta = {
  title?: string | null
  description?: string | null
  image?: { url?: string | null } | number | null
}

export function entryMetadata(
  entry: { meta?: CmsMeta | null },
  fallback: { title: string; description: string; image?: string | null },
  canonical: string,
  type: 'website' | 'article' = 'website',
): Metadata {
  const title = entry.meta?.title?.trim() || fallback.title
  const description = entry.meta?.description?.trim() || fallback.description
  const cmsImage = entry.meta?.image
  const image = typeof cmsImage === 'object' && cmsImage ? cmsImage.url : fallback.image
  return {
    title: entry.meta?.title ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: { type, title, description, url: canonical, images: image ? [image] : undefined },
  }
}
