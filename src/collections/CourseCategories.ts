import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'

export const CourseCategories: CollectionConfig = {
  slug: 'course-categories',
  admin: { group: 'Training Catalogue', useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  versions: { drafts: true },
}
