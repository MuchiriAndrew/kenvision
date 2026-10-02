import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff, publishedOrStaff } from '../access'

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: { group: 'Learning', useAsTitle: 'title', defaultColumns: ['title', 'course', 'passingScore'] },
  access: { read: publishedOrStaff, create: ({ req }) => isStaff(req.user), update: ({ req }) => isStaff(req.user), delete: ({ req }) => isAdmin(req.user) },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons' },
    { name: 'passingScore', type: 'number', min: 0, max: 100, defaultValue: 70 },
    { name: 'questions', type: 'array', fields: [
      { name: 'prompt', type: 'textarea', required: true },
      { name: 'options', type: 'array', minRows: 2, fields: [{ name: 'label', type: 'text', required: true }] },
      { name: 'correctOption', type: 'number', required: true, min: 0, access: { read: ({ req }) => isStaff(req.user) } },
      { name: 'explanation', type: 'textarea' },
    ] },
  ],
  versions: { drafts: true },
}
