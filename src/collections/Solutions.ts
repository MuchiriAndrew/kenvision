import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: { group: 'Website', useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status', 'updatedAt'] },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text', required: true }] },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  versions: { drafts: true },
}
