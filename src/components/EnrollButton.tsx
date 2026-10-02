'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function EnrollButton({ slug }: { slug: string }) {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  async function enroll() {
    setBusy(true); setStatus('')
    try {
      const response = await fetch('/api/enroll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) })
      const body = await response.json()
      if (response.status === 401) { router.push(`/login?next=${encodeURIComponent(`/training/${slug}`)}`); return }
      if (!response.ok) throw new Error(body.message || 'Unable to request enrolment.')
      setStatus(body.message)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to request enrolment.') }
    finally { setBusy(false) }
  }
  return <div className="enroll-control"><button type="button" onClick={enroll} disabled={busy} className="btn-primary aside-button">{busy ? 'Sending request…' : 'Request enrolment'} <span>→</span></button>{status && <p role="status" className="form-message">{status}</p>}<p className="aside-help">Already have an account? <Link href="/login">Sign in</Link></p></div>
}
