import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isLmsEnabled } from '@/lib/features'

export async function POST(request: Request) {
  if (!isLmsEnabled) return NextResponse.json({ message: 'Not found.' }, { status: 404 })
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: await headers() })
  if (!auth.user) return NextResponse.json({ message: 'Please sign in to request enrolment.' }, { status: 401 })
  const body = await request.json().catch(() => null) as { slug?: string } | null
  if (!body?.slug || typeof body.slug !== 'string') return NextResponse.json({ message: 'A course is required.' }, { status: 400 })
  const courses = await payload.find({ collection: 'courses', where: { and: [{ slug: { equals: body.slug } }, { _status: { equals: 'published' } }] }, limit: 1, overrideAccess: true })
  const course = courses.docs[0]
  if (!course) return NextResponse.json({ message: 'That training programme could not be found.' }, { status: 404 })
  const existing = await payload.find({ collection: 'enrollments', where: { and: [{ student: { equals: auth.user.id } }, { course: { equals: course.id } }, { status: { not_equals: 'cancelled' } }] }, limit: 1, user: auth.user })
  if (existing.docs[0]) return NextResponse.json({ message: 'Your enrolment request is already on file.', status: existing.docs[0].status })
  const enrollment = await payload.create({ collection: 'enrollments', data: { course: course.id, student: auth.user.id, status: 'pending' }, user: auth.user })
  return NextResponse.json({ message: 'Your enrolment request has been sent. Our training team will follow up with the next steps.', status: enrollment.status }, { status: 201 })
}
