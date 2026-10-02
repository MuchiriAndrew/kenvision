import type { Access, PayloadRequest, Where } from 'payload'

export const isAdmin = (user: unknown): boolean =>
  (user as { role?: string } | null)?.role === 'admin'

export const isStaff = (user: unknown): boolean => {
  const role = (user as { role?: string } | null)?.role
  return role === 'admin' || role === 'instructor'
}

export const staffOnly: Access = ({ req }) => isStaff(req.user)
export const adminOnly: Access = ({ req }) => isAdmin(req.user)
export const publicCreate: Access = () => true

export const publishedOrStaff: Access = ({ req }) =>
  isStaff(req.user) ? true : { _status: { equals: 'published' } }

async function activeEnrolledModuleIDs(req: PayloadRequest): Promise<(string | number)[]> {
  if (!req.user) return []
  const enrollments = await req.payload.find({
    collection: 'enrollments',
    where: {
      and: [
        { student: { equals: req.user.id } },
        { status: { in: ['active', 'completed'] } },
      ],
    },
    depth: 0,
    limit: 1000,
    overrideAccess: true,
  })
  const courseIDs = enrollments.docs.map((enrollment) => {
    const course = enrollment.course
    return typeof course === 'object' && course !== null ? course.id : course
  })
  if (!courseIDs.length) return []
  const modules = await req.payload.find({
    collection: 'course-modules',
    where: {
      and: [
        { course: { in: courseIDs } },
        { _status: { equals: 'published' } },
      ],
    },
    depth: 0,
    limit: 1000,
    overrideAccess: true,
  })
  return modules.docs.map((module) => module.id)
}

export const enrolledModulesOnly: Access = async ({ req }) => {
  if (isStaff(req.user)) return true
  const moduleIDs = await activeEnrolledModuleIDs(req)
  return moduleIDs.length ? { id: { in: moduleIDs } } : false
}

export const enrolledLessonsOnly: Access = async ({ req }) => {
  if (isStaff(req.user)) return true
  const moduleIDs = await activeEnrolledModuleIDs(req)
  if (!moduleIDs.length) return false
  const where: Where = {
    and: [
      { module: { in: moduleIDs } },
      { _status: { equals: 'published' } },
    ],
  }
  return where
}
