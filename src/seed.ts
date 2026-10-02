import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'
import { courses } from './data/courses'

const summaries: Record<string, string> = {
  'Security Systems': 'Hands-on professional training for the design, installation, operation and maintenance of modern security systems.',
  'Automotive Technology': 'Practical automotive skills covering diagnostics, vehicle electronics, maintenance and modern workshop technology.',
  'Facilities & Property': 'Professional development for facilities, property and built-environment teams.',
  'Electrical & Power': 'Applied electrical and power systems training for technicians and operational teams.',
  'ICT & Technical': 'Technical ICT programmes designed to build practical, job-ready skills.',
  'Professional & Management': 'Professional development for stronger administration, management and organisational capability.',
}

const payload = await getPayload({ config })
try {
  const categoryIDs = new Map<string, string | number>()
  for (const title of [...new Set(courses.map((course) => course.category))]) {
    const slug = title.toLowerCase().replaceAll('&', 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const existing = await payload.find({ collection: 'course-categories', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
    const category = existing.docs[0] || await payload.create({ collection: 'course-categories', data: { title, slug, description: summaries[title], _status: 'published' } as any, overrideAccess: true })
    categoryIDs.set(title, category.id)
  }

  for (const course of courses) {
    const existing = await payload.find({ collection: 'courses', where: { slug: { equals: course.id } }, limit: 1, overrideAccess: true })
    const data = {
      title: course.title,
      slug: course.id,
      category: categoryIDs.get(course.category),
      summary: course.summary || `${course.title} is a practical programme in ${course.category.toLowerCase()}, delivered by Kenvision Techniks in Nairobi and across East Africa. Contact our training team for the next cohort, delivery options and entry requirements.`,
      price: course.price,
      previousPrice: course.was,
      duration: course.duration,
      featured: course.featured || false,
      tags: course.tags.map((tag) => ({ tag })),
      _status: 'published',
    }
    if (existing.docs[0]) await payload.update({ collection: 'courses', id: existing.docs[0].id, data: data as any, overrideAccess: true })
    else await payload.create({ collection: 'courses', data: data as any, overrideAccess: true })
  }
  console.log(`Seeded ${categoryIDs.size} course categories and ${courses.length} training programmes.`)
} finally {
  await payload.destroy()
}
