import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'

export const Insights: CollectionConfig = {
  slug: 'insights',
  admin: { group: 'Website', useAsTitle: 'title', defaultColumns: ['title', 'author', '_status', 'publishedAt'] },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'publishedAt', type: 'date', index: true },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text', required: true }] },
  ],
  versions: { drafts: { autosave: { interval: 1500 } } },
}
