import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD for this one-off command.')
}
if (password.length < 14) {
  throw new Error('ADMIN_PASSWORD must be at least 14 characters long.')
}

const payload = await getPayload({ config })

try {
  const result = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  const administrator = result.docs[0]

  if (!administrator || administrator.role !== 'admin') {
    throw new Error(`No administrator account exists for ${email}.`)
  }

  await payload.update({
    collection: 'users',
    id: administrator.id,
    data: { password },
    overrideAccess: true,
  })

  console.log(`Password updated for ${email}.`)
} finally {
  await payload.destroy()
}
