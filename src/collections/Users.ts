import type { CollectionConfig } from 'payload'
import { isLmsEnabled } from '../lib/features'

const isStaff = (user: unknown): boolean => {
  const role = (user as { role?: string } | null)?.role
  return role === 'admin' || role === 'instructor'
}

const isAdmin = (user: unknown): boolean =>
  (user as { role?: string } | null)?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'People',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role', 'createdAt'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14,
    maxLoginAttempts: 8,
    lockTime: 15 * 60 * 1000,
    useSessions: true,
  },
  access: {
    create: ({ req }) => isLmsEnabled || isStaff(req.user),
    read: ({ req }) => isStaff(req.user) ? true : { id: { equals: req.user?.id } },
    update: ({ req }) => isStaff(req.user) ? true : { id: { equals: req.user?.id } },
    delete: ({ req }) => isAdmin(req.user),
    admin: ({ req }) => isStaff(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, req }) => {
        if (!req.user && !originalDoc && !req.context?.bootstrapAdmin) data.role = 'student'
        return data
      },
    ],
  },
  fields: [
    { name: 'fullName', type: 'text', required: true, index: true },
    { name: 'phone', type: 'text' },
    { name: 'country', type: 'text', defaultValue: 'Kenya' },
    {
      name: 'role', type: 'select', required: true, defaultValue: 'student',
      options: [
        { label: 'Student', value: 'student' },
        { label: 'Instructor', value: 'instructor' },
        { label: 'Administrator', value: 'admin' },
      ],
      access: { update: ({ req }) => isAdmin(req.user) },
    },
    { name: 'organization', type: 'relationship', relationTo: 'organizations' },
    { name: 'jobTitle', type: 'text' },
    { name: 'marketingOptIn', type: 'checkbox', defaultValue: false },
  ],
}
