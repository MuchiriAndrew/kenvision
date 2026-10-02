import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: { group: 'Learning', useAsTitle: 'id', defaultColumns: ['student', 'course', 'status', 'enrolledAt'] },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => isStaff(req.user) ? true : { student: { equals: req.user?.id } },
    update: ({ req }) => isStaff(req.user) ? true : { student: { equals: req.user?.id } },
    delete: ({ req }) => isAdmin(req.user),
  },
  hooks: {
    beforeChange: [({ data, originalDoc, req }) => {
      if (!isStaff(req.user)) {
        if (!req.user) throw new Error('Sign in is required to enrol.')
        data.student = req.user.id
        data.status = 'pending'
        data.progressPercent = originalDoc?.progressPercent ?? 0
        delete data.paymentReference
        delete data.completedAt
      }
      return data
    }],
  },
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true },
    { name: 'organization', type: 'relationship', relationTo: 'organizations' },
    { name: 'status', type: 'select', defaultValue: 'pending', options: ['pending', 'active', 'completed', 'cancelled'], index: true, access: { update: ({ req }) => isStaff(req.user) } },
    { name: 'enrolledAt', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'completedAt', type: 'date', access: { update: ({ req }) => isStaff(req.user) } },
    { name: 'progressPercent', type: 'number', min: 0, max: 100, defaultValue: 0, access: { update: ({ req }) => isStaff(req.user) } },
    { name: 'paymentReference', type: 'text', access: { read: ({ req }) => isStaff(req.user) } },
  ],
}
