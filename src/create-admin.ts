import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const email = process.env.INITIAL_ADMIN_EMAIL
const password = process.env.INITIAL_ADMIN_PASSWORD
const fullName = process.env.INITIAL_ADMIN_NAME || 'Kenvision Administrator'
if (!email || !password) throw new Error('Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD in .env before creating the first admin.')
if (password.length < 14) throw new Error('INITIAL_ADMIN_PASSWORD must be at least 14 characters long.')

const payload = await getPayload({ config })
try {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  if (existing.docs.length) throw new Error(`An account already exists for ${email}. No changes were made.`)
  await payload.create({ collection: 'users', data: { email, password, fullName, role: 'admin' }, overrideAccess: true, context: { bootstrapAdmin: true } })
  console.log(`Administrator account created for ${email}. Remove the INITIAL_ADMIN_* values from .env now.`)
} finally {
  await payload.destroy()
}
