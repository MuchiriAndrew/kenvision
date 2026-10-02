import type { Metadata } from 'next'
import Link from 'next/link'
import { Catalogue } from '@/components/Catalogue'
import { PageHero } from '@/components/PageHero'
import { JsonLd } from '@/components/JsonLd'
import { getCourses } from '@/lib/cms'
import { categories, type CourseCategory } from '@/data/courses'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Professional Training Courses in Kenya',
  description: 'Browse 40 practical professional training programmes in security, automotive, facilities, electrical, ICT and management disciplines.',
  alternates: { canonical: '/training' },
}

export default async function TrainingPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const courses = await getCourses()
  const selected = (await searchParams).category
  const initialCategory: CourseCategory | 'All' = categories.includes(selected as CourseCategory)
    ? selected as CourseCategory
    : 'All'
  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Kenvision Training Catalogue', description: 'Practical professional training programmes in Kenya and East Africa.', url: 'https://kenvisiontechniks.com/training' }} />
    <PageHero eyebrow="Training & Capacity Building" title="Build skills that create impact." description="Practical professional training built around the technical, security and management skills employers need across East Africa." tone="green" image="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85" />
    <section className="section section--sand"><div className="container">
      <div className="catalogue-intro"><div><div className="eyebrow"><span />The Course Catalogue</div><h2>Find your next skill.</h2><p className="section-lede">Explore upcoming training and specialist programmes from the Kenvision Techniks Talent Centre.</p></div><div className="catalogue-note"><strong>Practical by design</strong><span>Small groups · In-person and online · East African context</span></div></div>
      <Catalogue key={initialCategory} courses={courses} initialCategory={initialCategory} />
    </div></section>
    <section className="section section--white"><div className="container split-grid"><div><div className="eyebrow"><span />For Organisations</div><h2>Develop your team’s capability.</h2><p className="section-lede">We can adapt delivery to your teams, sites, operational context and training schedule.</p><Link href="/contact?type=Corporate%20training" className="btn-primary">Plan corporate training <span>→</span></Link></div><div className="stat-grid"><div className="stat-card"><strong>5–18</strong><b>Participants per group</b><span>Room for practical coaching</span></div><div className="stat-card"><strong>Hybrid</strong><b>Flexible delivery</b><span>In-person, online or blended</span></div></div></div></section>
  </>
}
