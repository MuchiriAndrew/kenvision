import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { getCmsCollection } from '@/lib/cms'
import { entryMetadata } from '@/lib/seo'
type Props={params:Promise<{slug:string}>}
async function load(slug:string){return (await getCmsCollection('solutions')).find((item)=>item.slug===slug)}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const doc=await load(slug);return doc?entryMetadata(doc,{title:String(doc.title),description:String(doc.summary)},`/solutions/${slug}`):{title:'Solution not found'}}
export default async function SolutionPage({params}:Props){const {slug}=await params;const doc=await load(slug);if(!doc)notFound();const features=Array.isArray(doc.features)?doc.features as {feature:string}[]:[];return <><PageHero eyebrow="Kenvision Solutions" title={String(doc.title)} description={String(doc.summary)} image={typeof doc.image==='object'&&doc.image&&'url'in doc.image?String(doc.image.url):undefined}><Link href="/contact" className="btn-copper">Discuss this solution <span>→</span></Link></PageHero><section className="section section--white"><div className="container detail-grid"><article className="prose"><h2>Designed around your operation.</h2><p>{String(doc.summary)}</p><p>Our team works with your organisation to understand requirements, map a practical solution and support implementation over time.</p>{features.length>0&&<><h2>What we can support</h2><ul>{features.map((f)=><li key={f.feature}>{f.feature}</li>)}</ul></>}</article><aside className="content-card"><h3>Talk with a specialist</h3><p>Tell us about your requirements and we’ll connect you with the right team.</p><Link className="btn-primary aside-button" href="/contact">Contact Kenvision →</Link></aside></div></section></>}
