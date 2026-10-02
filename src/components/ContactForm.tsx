'use client'

import { useState } from 'react'

export function ContactForm({ inquiryType = 'General', courseTitle }: { inquiryType?: string; courseTitle?: string }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    try {
      const response = await fetch('/api/contact-inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), email: form.get('email'), phone: form.get('phone'), organization: form.get('organization'), inquiryType: form.get('inquiryType'), message: form.get('message') }) })
      if (!response.ok) throw new Error('Please check your details and try again.')
      formElement.reset(); setMessage('Thanks for reaching out. Our team will be in touch shortly.'); setError(false)
    } catch (e) { setMessage(e instanceof Error ? e.message : 'We could not send your message. Please try again.'); setError(true) }
    finally { setBusy(false) }
  }
  return <form className="form-stack" onSubmit={submit}>
    {message && <p role="status" className={`form-message${error ? ' form-message--error' : ''}`}>{message}</p>}
    <div className="form-field"><label htmlFor="name">Full name</label><input id="name" name="name" required autoComplete="name" /></div>
    <div className="form-layout form-layout--fields"><div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" required autoComplete="email" /></div><div className="form-field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" autoComplete="tel" /></div></div>
    <div className="form-field"><label htmlFor="organization">Organisation</label><input id="organization" name="organization" autoComplete="organization" /></div>
    <div className="form-field"><label htmlFor="inquiryType">How can we help?</label><select id="inquiryType" name="inquiryType" defaultValue={inquiryType}><option>General</option><option>Security systems</option><option>Corporate training</option><option>Course enrollment</option><option>Other</option></select></div>
    <div className="form-field"><label htmlFor="message">Message</label><textarea id="message" name="message" required minLength={10} defaultValue={courseTitle ? `I'm interested in ${courseTitle}. Please share the next available dates and registration details.` : ''} /></div>
    <button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send enquiry'} <span>→</span></button>
  </form>
}
