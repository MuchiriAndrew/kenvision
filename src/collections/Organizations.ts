import type { CollectionConfig } from 'payload'
import { isStaff, staffOnly } from '../access'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: { group: 'People', useAsTitle: 'name', defaultColumns: ['name', 'country', 'contactEmail'] },
  access: { read: staffOnly, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'name', type: 'text', required: true, index: true },
    { name: 'country', type: 'text' },
    { name: 'contactName', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    { name: 'notes', type: 'textarea', access: { read: ({ req }) => isStaff(req.user) } },
  ],
}
