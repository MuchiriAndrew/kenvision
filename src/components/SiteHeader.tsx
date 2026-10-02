'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Training', href: '/training' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
  { label: 'Clients', href: '/clients' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader({ lmsEnabled }: { lmsEnabled: boolean }) {
  const pathname = usePathname()
  const visibleLinks = lmsEnabled ? links : links.filter((link) => link.href !== '/contact')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label="Kenvision Techniks home">
          <span className="wordmark__name">KENVISION</span>
          <span className="wordmark__sub">TECHNIKS</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {visibleLinks.map((link) => <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? 'active' : ''}`}>{link.label}</Link>)}
          <Link href={lmsEnabled ? '/login' : '/contact'} className="header-login">{lmsEnabled ? 'Student Login' : 'Talk to our team'}</Link>
        </nav>
        <button type="button" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-controls="mobile-primary-navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /></button>
      </div>
      {open && <nav id="mobile-primary-navigation" className="mobile-nav" aria-label="Mobile navigation">
        {visibleLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`mobile-nav__link ${pathname === link.href ? 'active' : ''}`}>{link.label}</Link>)}
        <Link href={lmsEnabled ? '/login' : '/contact'} onClick={() => setOpen(false)} className="btn-primary mobile-nav__cta">{lmsEnabled ? 'Student Login' : 'Talk to our team'} <span>→</span></Link>
      </nav>}
    </header>
  )
}
