import type { CollectionConfig } from 'payload'
import { adminOnly, isAdmin, publicCreate } from '../access'

export const ContactInquiries: CollectionConfig = {
  slug: 'contact-inquiries',
  admin: { group: 'People', useAsTitle: 'name', defaultColumns: ['name', 'email', 'inquiryType', 'status', 'createdAt'] },
  access: { create: publicCreate, read: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organization', type: 'text' },
    { name: 'inquiryType', type: 'select', options: ['General', 'Security systems', 'Corporate training', 'Course enrollment', 'Other'], defaultValue: 'General' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'status', type: 'select', options: ['new', 'in-progress', 'resolved'], defaultValue: 'new', access: { update: ({ req }) => isAdmin(req.user) } },
  ],
}
