import type { Access } from 'payload'

export const isAdmin = (user: unknown): boolean =>
  (user as { role?: string } | null)?.role === 'admin'

export const isStaff = (user: unknown): boolean => {
  const role = (user as { role?: string } | null)?.role
  return role === 'admin' || role === 'instructor'
}

export const staffOnly: Access = ({ req }) => isStaff(req.user)
export const adminOnly: Access = ({ req }) => isAdmin(req.user)
export const publicCreate: Access = () => true

export const publishedOrStaff: Access = ({ req }) =>
  isStaff(req.user) ? true : { _status: { equals: 'published' } }
