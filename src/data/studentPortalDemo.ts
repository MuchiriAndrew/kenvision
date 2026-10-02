import type { Course as CatalogueCourse } from './courses'
import type { PortalCourse, PortalData } from '@/components/StudentPortal'

export function studentPortalDemo(catalogue: CatalogueCourse[]): PortalData {
  const bySlug = new Map(catalogue.map((course) => [course.id, course]))
  const asOf = new Date().toISOString()
  const sampleCourse = (
    slug: string,
    id: number,
    status: PortalCourse['status'],
    progress: number,
    enrolledAt: string,
    completedAt: string | null = null,
    upcomingDate: string | null = null,
    deliveryMode: string | null = null,
  ): PortalCourse => {
    const course = bySlug.get(slug)
    return {
      id,
      slug,
      title: course?.title || slug,
      category: course?.category || 'Training',
      image: course?.image || null,
      status,
      progress,
      enrolledAt,
      completedAt,
      updatedAt: completedAt || enrolledAt,
      upcomingDate,
      deliveryMode,
    }
  }
  const courses = [
    sampleCourse(
      'cctv-operator-control-room',
      1001,
      'active',
      68,
      '2026-08-22T09:00:00Z',
      null,
      '2026-11-18T09:00:00Z',
      'In person',
    ),
    sampleCourse(
      'fibre-optic-installation',
      1002,
      'active',
      42,
      '2026-08-28T09:00:00Z',
      null,
      '2026-11-26T09:00:00Z',
      'Online',
    ),
    sampleCourse('advanced-supervisory-skills', 1003, 'active', 25, '2026-09-05T09:00:00Z'),
    sampleCourse(
      'cctv-architecture-design-installation',
      1004,
      'completed',
      100,
      '2026-05-02T09:00:00Z',
      '2026-08-14T09:00:00Z',
    ),
    sampleCourse(
      'car-engine-diagnostics',
      1005,
      'completed',
      100,
      '2026-04-12T09:00:00Z',
      '2026-07-22T09:00:00Z',
    ),
    sampleCourse(
      'basic-electricity-non-electricians',
      1006,
      'completed',
      100,
      '2026-03-01T09:00:00Z',
      '2026-06-03T09:00:00Z',
    ),
    sampleCourse(
      'fire-detection-suppression',
      1007,
      'completed',
      100,
      '2026-01-19T09:00:00Z',
      '2026-05-28T09:00:00Z',
    ),
    sampleCourse(
      'cctv-ip-networking',
      1008,
      'completed',
      100,
      '2026-02-09T09:00:00Z',
      '2026-04-24T09:00:00Z',
    ),
  ]
  const recommendations = [
    'ecu-programming-remapping-a',
    'biometric-access-control-time-attendance',
    'emergency-generator-repair',
    'auto-electrical-systems',
  ]
    .map((slug) => bySlug.get(slug))
    .filter((course): course is CatalogueCourse => Boolean(course))
    .map((course) => ({
      slug: course.id,
      title: course.title,
      category: course.category,
      image: course.image || null,
      price: course.price,
    }))
  return {
    demo: true,
    asOf,
    student: {
      id: 0,
      name: 'Samuel Muchiri',
      email: 'samuel@example.com',
      phone: '+254 7XX XXX XXX',
      country: 'Kenya',
      jobTitle: 'Technology & Design Professional',
      role: 'student',
    },
    courses,
    certificates: [
      {
        id: 2001,
        title:
          bySlug.get('cctv-architecture-design-installation')?.title ||
          'CCTV Architecture, Design & Management Skills Training',
        number: 'KT-CCTV-2026-00482',
        issuedAt: '2026-08-14T09:00:00Z',
        fileUrl: null,
      },
      {
        id: 2002,
        title:
          bySlug.get('car-engine-diagnostics')?.title || 'Car Engine Diagnostics Skills Training',
        number: 'KT-AUTO-2026-00317',
        issuedAt: '2026-07-22T09:00:00Z',
        fileUrl: null,
      },
      {
        id: 2003,
        title:
          bySlug.get('basic-electricity-non-electricians')?.title ||
          'Basic Electricity Skills for Non-Electricians',
        number: 'KT-ELEC-2026-00196',
        issuedAt: '2026-06-03T09:00:00Z',
        fileUrl: null,
      },
      {
        id: 2004,
        title:
          bySlug.get('fire-detection-suppression')?.title ||
          'Fire Detection & Suppression Systems Training',
        number: 'KT-FIRE-2026-00142',
        issuedAt: '2026-05-28T09:00:00Z',
        fileUrl: null,
      },
    ],
    recommendations,
    activity: [
      { id: 'demo-1', kind: 'Completed lesson', title: 'CCTV Control Room Operations', date: asOf },
      {
        id: 'demo-2',
        kind: 'Lesson activity',
        title: 'CCTV Training Course Notes',
        date: '2026-09-29T09:00:00Z',
      },
      {
        id: 'demo-3',
        kind: 'Enrolled in training',
        title: 'Fibre Optic Installation Training',
        date: '2026-09-12T09:00:00Z',
      },
      {
        id: 'demo-4',
        kind: 'Certificate issued',
        title: 'Basic Electricity Skills for Non-Electricians',
        date: '2026-09-08T09:00:00Z',
      },
    ],
    completedLessons: 0,
    learningHours: 42,
    payments: [
      {
        course: 'CCTV System Operator Training',
        date: '2026-09-10T09:00:00Z',
        amount: 30000,
        status: 'Paid',
      },
      {
        course: 'Fibre Optic Installation Training',
        date: '2026-09-05T09:00:00Z',
        amount: 51200,
        status: 'Paid',
      },
      {
        course: 'Advanced Supervisory Skills',
        date: '2026-08-28T09:00:00Z',
        amount: 150000,
        status: 'Paid',
      },
    ],
  }
}
