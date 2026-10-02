import type { Metadata } from 'next'
import React from 'react'
import { SiteChrome } from '@/components/SiteChrome'
import { getSiteSettings } from '@/lib/cms'
import { isLmsEnabled } from '@/lib/features'
import './styles.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings() as null | { siteName?: string; defaultMetaTitle?: string; defaultMetaDescription?: string; noIndexSite?: boolean; defaultSocialImage?: { url?: string } }
  const name = settings?.siteName || 'Kenvision Techniks'
  const socialImage = settings?.defaultSocialImage?.url
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kenvisiontechniks.com'),
    title: { default: settings?.defaultMetaTitle || `${name} | Training & Technical Solutions`, template: `%s | ${name}` },
    description: settings?.defaultMetaDescription || 'Professional training and technical solutions that strengthen people and organisations across East and Southern Africa.',
    applicationName: name,
    openGraph: { type: 'website', siteName: name, locale: 'en_KE', images: socialImage ? [socialImage] : undefined },
    twitter: { card: 'summary_large_image', images: socialImage ? [socialImage] : undefined },
    robots: settings?.noIndexSite ? { index: false, follow: false, nocache: true } : { index: true, follow: true },
  }
}

export default function FrontendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell"><SiteChrome lmsEnabled={isLmsEnabled}><main>{children}</main></SiteChrome></div>
      </body>
    </html>
  )
}
