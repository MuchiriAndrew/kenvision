import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const LessonProgress: CollectionConfig = {
  slug: 'lesson-progress',
  admin: { group: 'Learning', useAsTitle: 'id', defaultColumns: ['student', 'lesson', 'completed', 'updatedAt'] },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => isStaff(req.user) ? true : { student: { equals: req.user?.id } },
    update: ({ req }) => isStaff(req.user) ? true : { student: { equals: req.user?.id } },
    delete: ({ req }) => isAdmin(req.user),
  },
  hooks: {
    beforeChange: [async ({ data, originalDoc, req }) => {
      if (isStaff(req.user)) return data
      if (!req.user) throw new Error('Sign in is required to save learning progress.')
      data.student = req.user.id
      if (originalDoc && (String(data.lesson ?? originalDoc.lesson) !== String(originalDoc.lesson) || String(data.enrollment ?? originalDoc.enrollment) !== String(originalDoc.enrollment))) {
        throw new Error('A progress record cannot be moved to another lesson or enrolment.')
      }
      const enrollmentId = data.enrollment ?? originalDoc?.enrollment
      if (!enrollmentId) throw new Error('An enrolment is required.')
      const enrollment = await req.payload.findByID({ collection: 'enrollments', id: typeof enrollmentId === 'object' ? enrollmentId.id : enrollmentId, user: req.user, overrideAccess: false })
      const studentId = typeof enrollment.student === 'object' ? enrollment.student.id : enrollment.student
      if (String(studentId) !== String(req.user.id) || enrollment.status !== 'active') throw new Error('An active enrolment is required to update progress.')
      const lessonId = data.lesson ?? originalDoc?.lesson
      if (!originalDoc && lessonId) {
        const duplicate = await req.payload.find({ collection: 'lesson-progress', where: { and: [{ enrollment: { equals: typeof enrollmentId === 'object' ? enrollmentId.id : enrollmentId } }, { lesson: { equals: typeof lessonId === 'object' ? lessonId.id : lessonId } }] }, limit: 1, overrideAccess: true })
        if (duplicate.docs.length) throw new Error('Progress for this lesson already exists.')
      }
      if (data.completed) data.completedAt = new Date().toISOString()
      else if (originalDoc) data.completedAt = originalDoc.completedAt
      return data
    }],
    afterChange: [async ({ doc, req }) => {
      const enrollmentId = typeof doc.enrollment === 'object' ? doc.enrollment.id : doc.enrollment
      const enrollment = await req.payload.findByID({ collection: 'enrollments', id: enrollmentId, depth: 1, overrideAccess: true })
      const courseId = typeof enrollment.course === 'object' ? enrollment.course.id : enrollment.course
      const [modules, progress] = await Promise.all([
        req.payload.find({ collection: 'course-modules', where: { course: { equals: courseId } }, limit: 500, overrideAccess: true }),
        req.payload.find({ collection: 'lesson-progress', where: { enrollment: { equals: enrollmentId }, completed: { equals: true } }, limit: 1000, overrideAccess: true }),
      ])
      const moduleIDs = modules.docs.map((module) => module.id)
      const lessons = moduleIDs.length ? await req.payload.find({ collection: 'lessons', where: { module: { in: moduleIDs } }, limit: 1000, overrideAccess: true }) : { docs: [] }
      const completedIDs = new Set(progress.docs.map((item) => String(typeof item.lesson === 'object' ? item.lesson.id : item.lesson)))
      const percent = lessons.docs.length ? Math.round(completedIDs.size / lessons.docs.length * 100) : 0
      await req.payload.update({ collection: 'enrollments', id: enrollmentId, data: { progressPercent: percent, ...(percent === 100 ? { status: 'completed', completedAt: new Date().toISOString() } : {}) }, overrideAccess: true })
    }],
  },
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'enrollment', type: 'relationship', relationTo: 'enrollments', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true, index: true },
    { name: 'completed', type: 'checkbox', defaultValue: false },
    { name: 'completedAt', type: 'date' },
    { name: 'lastPositionSeconds', type: 'number', min: 0 },
  ],
  timestamps: true,
}
