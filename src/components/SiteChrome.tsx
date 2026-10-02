'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteChrome({ children, lmsEnabled }: { children: ReactNode; lmsEnabled: boolean }) {
  const pathname = usePathname()
  const portal = ['/login', '/register', '/dashboard'].includes(pathname) || pathname.startsWith('/learn/')
  return <>{!portal && <SiteHeader lmsEnabled={lmsEnabled} />}{children}{!portal && <SiteFooter />}</>
}
