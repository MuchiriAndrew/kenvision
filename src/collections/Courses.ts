import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: { group: 'Training Catalogue', useAsTitle: 'title', defaultColumns: ['title', 'category', 'price', '_status', 'updatedAt'] },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'category', type: 'relationship', relationTo: 'course-categories', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text', required: true }] },
    { name: 'price', type: 'number', min: 0, required: true },
    { name: 'previousPrice', type: 'number', min: 0 },
    { name: 'duration', type: 'text' },
    { name: 'deliveryModes', type: 'select', hasMany: true, options: ['In person', 'Online', 'Blended'] },
    { name: 'level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'] },
    { name: 'featured', type: 'checkbox', defaultValue: false, index: true },
    { name: 'upcomingDate', type: 'date' },
    { name: 'modules', type: 'join', collection: 'course-modules', on: 'course' },
    { name: 'requirements', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'outcomes', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
  ],
  versions: { drafts: { autosave: { interval: 1500 } } },
}
