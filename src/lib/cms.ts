import { getPayload } from 'payload'
import config from '@payload-config'
import { courses as fallbackCourses, type Course, type CourseCategory } from '@/data/courses'
import type { Page } from '@/payload-types'

type CmsCourse = {
  id: string | number
  title?: string
  slug?: string
  category?: string | { title?: string }
  summary?: string
  price?: number
  previousPrice?: number
  tags?: { tag?: string }[]
  coverImage?: { url?: string }
  duration?: string
  featured?: boolean
  updatedAt?: string
  meta?: Course['meta']
  description?: unknown
  requirements?: { item?: string }[]
  outcomes?: { item?: string }[]
  deliveryModes?: string[]
  upcomingDate?: string | null
  level?: string | null
}

function normalizeCourse(course: CmsCourse, index: number): Course {
  const categoryName = typeof course.category === 'object' ? course.category?.title : course.category
  const category = (categoryName || 'Professional & Management') as CourseCategory
  return {
    id: course.slug || String(course.id),
    num: index + 1,
    title: course.title || 'Training programme',
    category,
    tags: course.tags?.map((tag) => tag.tag || '').filter(Boolean) || [],
    price: course.price || 0,
    was: course.previousPrice || undefined,
    image: course.coverImage?.url,
    summary: course.summary,
    duration: course.duration,
    featured: course.featured,
    updatedAt: course.updatedAt,
    meta: course.meta,
    description: course.description,
    requirements: course.requirements?.map((row) => row.item || '').filter(Boolean),
    outcomes: course.outcomes?.map((row) => row.item || '').filter(Boolean),
    deliveryModes: course.deliveryModes,
    upcomingDate: course.upcomingDate,
    level: course.level,
  }
}

export async function getCourses(): Promise<Course[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'courses',
      where: { _status: { equals: 'published' } },
      sort: 'title', limit: 100, depth: 2, overrideAccess: true,
    })
    if (result.docs.length) return result.docs.map((doc, index) => normalizeCourse(doc as CmsCourse, index))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.warn('Payload course query unavailable; using the exported catalogue.', error instanceof Error ? error.message : error)
  }
  return fallbackCourses
}

export async function getCourse(slug: string): Promise<Course | undefined> {
  const fromCMS = (await getCourses()).find((course) => course.id === slug)
  return fromCMS || fallbackCourses.find((course) => course.id === slug)
}

export async function getCmsCollection(collection: 'solutions' | 'insights' | 'pages', limit = 30) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({ collection, where: { _status: { equals: 'published' } }, sort: '-updatedAt', limit, depth: 2, overrideAccess: true })
    return result.docs as unknown as Array<Record<string, unknown>>
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.warn(`Payload ${collection} query unavailable.`, error instanceof Error ? error.message : error)
    return []
  }
}

export async function getPublishedPage(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

export async function getSiteSettings() {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings', depth: 1, overrideAccess: true })
  } catch {
    return null
  }
}
