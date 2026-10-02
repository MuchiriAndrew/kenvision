'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function AuthForm({ mode, courseSlug, returnTo = '/dashboard' }: { mode: 'login' | 'register'; courseSlug?: string; returnTo?: string }) {
  const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    const data = Object.fromEntries(form.entries())
    try {
      const response = mode === 'login'
        ? await fetch('/api/users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.email, password: data.password }) })
        : await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName: data.fullName, email: data.email, password: data.password, role: 'student' }) })
      if (!response.ok) { const body = await response.json().catch(() => null); throw new Error(body?.errors?.[0]?.message || body?.errors?.[0]?.data?.errors?.[0]?.message || 'We could not complete your request. Check your details and try again.') }
      if (mode === 'register') {
        const login = await fetch('/api/users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.email, password: data.password }) })
        if (!login.ok) throw new Error('Your account was created. Please sign in to continue.')
        if (courseSlug) await fetch('/api/enroll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: courseSlug }) })
      }
      router.replace(returnTo); router.refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') }
    finally { setBusy(false) }
  }
  return <form className="auth-form form-stack" onSubmit={submit}>
    <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
    <p>{mode === 'login' ? 'Sign in to continue your learning journey.' : 'Join the Kenvision Talent Centre and access your learning.'}</p>
    {error && <div role="alert" className="form-message form-message--error">{error}</div>}
    {mode === 'register' && <div className="form-field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" required autoComplete="name" /></div>}
    <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
    <div className="form-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" required minLength={10} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></div>
    <button disabled={busy} className="btn-primary">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></button>
    <p>{mode === 'login' ? 'New to Kenvision?' : 'Already have an account?'} <Link href={mode === 'login' ? '/register' : '/login'} className="text-link">{mode === 'login' ? 'Create an account' : 'Sign in'}</Link></p>
  </form>
}
