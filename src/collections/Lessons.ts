import type { CollectionConfig } from 'payload'
import { enrolledLessonsOnly, isAdmin, isStaff } from '../access'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: { group: 'Learning', useAsTitle: 'title', defaultColumns: ['title', 'module', 'lessonType', 'sortOrder'] },
  access: { read: enrolledLessonsOnly, create: ({ req }) => isStaff(req.user), update: ({ req }) => isStaff(req.user), delete: ({ req }) => isAdmin(req.user) },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'module', type: 'relationship', relationTo: 'course-modules', required: true, index: true },
    { name: 'lessonType', type: 'select', defaultValue: 'text', options: ['text', 'video', 'resource', 'live-session'] },
    { name: 'content', type: 'richText' },
    { name: 'videoUrl', type: 'text', admin: { description: 'Use an approved streaming provider URL; keep video files out of the CMS database.' } },
    { name: 'resource', type: 'upload', relationTo: 'media' },
    { name: 'durationMinutes', type: 'number', min: 0 },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'freePreview', type: 'checkbox', defaultValue: false },
  ],
  versions: { drafts: true },
}
