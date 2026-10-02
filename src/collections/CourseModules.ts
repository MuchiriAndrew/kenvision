import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff, publishedOrStaff } from '../access'

export const CourseModules: CollectionConfig = {
  slug: 'course-modules',
  admin: { group: 'Learning', useAsTitle: 'title', defaultColumns: ['title', 'course', 'sortOrder'] },
  access: { read: publishedOrStaff, create: ({ req }) => isStaff(req.user), update: ({ req }) => isStaff(req.user), delete: ({ req }) => isAdmin(req.user) },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true },
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'lessons', type: 'join', collection: 'lessons', on: 'module' },
  ],
  versions: { drafts: true },
}
