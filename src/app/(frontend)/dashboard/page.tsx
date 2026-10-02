import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { StudentPortal, type PortalData, type PortalCourse } from '@/components/StudentPortal'
import { getCourses } from '@/lib/cms'
import { studentPortalDemo } from '@/data/studentPortalDemo'
import { isLmsEnabled } from '@/lib/features'
import type { Certificate, Course, Enrollment, LessonProgress, Media } from '@/payload-types'
import './portal.css'

export const metadata: Metadata = {
  title: 'My learning dashboard',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

function related<T extends { id: number }>(value: number | T | null | undefined): T | null {
  return value && typeof value === 'object' ? value : null
}

function imageUrl(value: number | Media | null | undefined): string | null {
  const media = related(value)
  return media?.sizes?.card?.url || media?.url || null
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>
}) {
  if (!isLmsEnabled) notFound()
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: await headers() })
  if (!auth.user) redirect('/login?next=%2Fdashboard')
  const student = auth.user
  if (
    process.env.NODE_ENV === 'development' &&
    student.role === 'admin' &&
    (await searchParams).demo === '1'
  ) {
    return <StudentPortal data={studentPortalDemo(await getCourses())} />
  }

  const [enrollmentResult, certificateResult, progressResult, catalogue] = await Promise.all([
    payload.find({
      collection: 'enrollments',
      where: { student: { equals: student.id } },
      depth: 2,
      limit: 100,
      sort: '-enrolledAt',
      user: student,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'certificates',
      where: { student: { equals: student.id } },
      depth: 2,
      limit: 100,
      sort: '-issuedAt',
      user: student,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'lesson-progress',
      where: { student: { equals: student.id } },
      depth: 2,
      limit: 100,
      sort: '-updatedAt',
      user: student,
      overrideAccess: false,
    }),
    getCourses(),
  ])

  const catalogueBySlug = new Map(catalogue.map((course) => [course.id, course]))
  const courses: PortalCourse[] = enrollmentResult.docs.map((entry: Enrollment) => {
    const course = related(entry.course as number | Course)
    const fallback = course?.slug ? catalogueBySlug.get(course.slug) : undefined
    const category = related(course?.category)
    return {
      id: entry.id,
      slug: course?.slug || '',
      title: course?.title || 'Training programme',
      category: category?.title || fallback?.category || 'Training',
      image: imageUrl(course?.coverImage) || fallback?.image || null,
      status: entry.status || 'pending',
      progress: Math.min(100, Math.max(0, Number(entry.progressPercent || 0))),
      enrolledAt: entry.enrolledAt || entry.createdAt,
      completedAt: entry.completedAt || null,
      updatedAt: entry.updatedAt,
      upcomingDate: course?.upcomingDate || null,
      deliveryMode: course?.deliveryModes?.join(' · ') || null,
    }
  })
  const enrolledSlugs = new Set(courses.map((course) => course.slug))
  const recommendationPriority = [
    'ecu-programming-remapping-a',
    'biometric-access-control-time-attendance',
    'emergency-generator-repair',
    'car-engine-diagnostics',
  ]
  const recommendations = catalogue
    .filter((course) => !enrolledSlugs.has(course.id))
    .sort((a, b) => {
      const aIndex = recommendationPriority.indexOf(a.id)
      const bIndex = recommendationPriority.indexOf(b.id)
      if (aIndex !== -1 || bIndex !== -1)
        return (aIndex === -1 ? 1000 : aIndex) - (bIndex === -1 ? 1000 : bIndex)
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    })
    .slice(0, 4)
    .map((course) => ({
      slug: course.id,
      title: course.title,
      category: course.category,
      image: course.image || null,
      price: course.price,
    }))

  const certificates = certificateResult.docs.map((certificate: Certificate) => {
    const course = related(certificate.course as number | Course)
    return {
      id: certificate.id,
      number: certificate.certificateNumber,
      title: course?.title || 'Training programme',
      issuedAt: certificate.issuedAt,
      fileUrl: imageUrl(certificate.file),
    }
  })

  const lessonActivity = progressResult.docs.map((progress: LessonProgress) => {
    const lesson = related(progress.lesson)
    return {
      id: `lesson-${progress.id}`,
      kind: progress.completed ? 'Completed lesson' : 'Lesson activity',
      title: lesson?.title || 'Learning activity',
      date: progress.completedAt || progress.updatedAt,
    }
  })
  const enrollmentActivity = courses.map((course) => ({
    id: `enrollment-${course.id}`,
    kind: 'Enrolled in training',
    title: course.title,
    date: course.enrolledAt,
  }))
  const certificateActivity = certificates.map((certificate) => ({
    id: `certificate-${certificate.id}`,
    kind: 'Certificate issued',
    title: certificate.title,
    date: certificate.issuedAt,
  }))
  const activity = [...lessonActivity, ...enrollmentActivity, ...certificateActivity]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 5)

  const data: PortalData = {
    asOf: new Date().toISOString(),
    student: {
      id: student.id,
      name: student.fullName || student.email,
      email: student.email,
      phone: student.phone || '',
      country: student.country || '',
      jobTitle: student.jobTitle || '',
      role: student.role,
    },
    courses,
    certificates,
    recommendations,
    activity,
    completedLessons: progressResult.docs.filter((item) => item.completed).length,
  }

  return <StudentPortal data={data} />
}
