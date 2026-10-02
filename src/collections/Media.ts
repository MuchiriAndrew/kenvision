import type { CollectionConfig } from 'payload'
import { isStaff } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Website', useAsTitle: 'filename', defaultColumns: ['filename', 'alt', 'updatedAt'] },
  access: {
    read: () => true,
    create: ({ req }) => isStaff(req.user),
    update: ({ req }) => isStaff(req.user),
    delete: ({ req }) => isStaff(req.user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 720, height: 480, position: 'centre' },
      { name: 'wide', width: 1440, height: 900, position: 'centre' },
      { name: 'social', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'card',
  },
}
