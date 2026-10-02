import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/cms'
export const dynamic = 'force-dynamic'

export default async function robots():Promise<MetadataRoute.Robots>{
  const settings=await getSiteSettings()
  const origin=(process.env.NEXT_PUBLIC_SITE_URL||'https://kenvisiontechniks.com').replace(/\/$/,'')
  if(settings?.noIndexSite)return {rules:{userAgent:'*',disallow:'/'}}
  return {rules:{userAgent:'*',allow:'/',disallow:['/admin/','/api/','/dashboard','/login','/register','/learn/']},sitemap:`${origin}/sitemap.xml`}
}
