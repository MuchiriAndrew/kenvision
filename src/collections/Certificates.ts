import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: { group: 'Learning', useAsTitle: 'certificateNumber', defaultColumns: ['certificateNumber', 'student', 'course', 'issuedAt'] },
  access: {
    create: ({ req }) => isStaff(req.user),
    read: ({ req }) => isStaff(req.user) ? true : { student: { equals: req.user?.id } },
    update: ({ req }) => isAdmin(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    { name: 'certificateNumber', type: 'text', required: true, unique: true, index: true },
    { name: 'student', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'enrollment', type: 'relationship', relationTo: 'enrollments', required: true },
    { name: 'issuedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'file', type: 'upload', relationTo: 'media' },
  ],
}
