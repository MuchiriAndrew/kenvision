import type { Metadata } from 'next'
import Link from 'next/link'
import { Catalogue } from '@/components/Catalogue'
import { CourseCard } from '@/components/CourseCard'
import { PageHero } from '@/components/PageHero'
import { getCourses } from '@/lib/cms'
import { categories, type CourseCategory } from '@/data/courses'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Training Catalogue', description: 'Browse practical professional training programmes at Kenvision Techniks Talent Centre.', alternates: { canonical: '/talent' } }

export default async function TalentPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const courses = await getCourses()
  const selected = (await searchParams).category
  const initialCategory: CourseCategory | 'All' = categories.includes(selected as CourseCategory) ? selected as CourseCategory : 'All'
  const featuredIds = ['advanced-supervisory-skills', 'practical-electric-fencing-2026', 'cctv-operator-control-room']
  const featured = featuredIds.map((id) => courses.find((course) => course.id === id)).filter((course) => course !== undefined)

  return <>
    <PageHero eyebrow="Training & Capacity Building" title="Practical training for real-world skills." description="Explore Kenvision Techniks' professional training programmes across security systems, automotive technology, facilities management, electrical systems, ICT and professional development." variant="catalogue" image="https://images.unsplash.com/photo-1562910859-be83f1df7b56?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=520&q=85" secondaryImage="https://images.unsplash.com/photo-1768633647910-7e6fb53e5b0f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=220&q=85"><a href="#catalogue" className="btn-primary">Explore Courses →</a><Link href="/contact" className="btn-ghost-white">Enquire About Training</Link></PageHero>
    <section className="section section--white talent-featured"><div className="container"><div className="eyebrow"><span />Selected Programmes</div><h2>Explore our training programmes.</h2><div className="talent-featured__grid">{featured[0] && <CourseCard course={featured[0]} />}{featured.length > 1 && <div>{featured.slice(1).map((course) => <CourseCard key={course.id} course={course} />)}</div>}</div></div></section>
    <section id="catalogue" className="section section--sand talent-catalogue"><div className="container"><div className="eyebrow"><span />Training Catalogue</div><h2>Browse professional training programmes.</h2><p className="talent-catalogue__intro">{courses.length} programmes across {categories.length} training areas.</p><Catalogue courses={courses} initialCategory={initialCategory} /></div></section>
    <section className="section section--deep talent-corporate"><div className="container split-grid"><div><div className="eyebrow eyebrow--muted"><span />Organisational Training</div><h2>Training designed around your organisation.</h2><p className="section-lede section-lede--light">Looking to train a team or organisation? Talk to the Kenvision Training Division about your requirements.</p><Link href="/contact?type=Corporate%20training" className="btn-copper">Request Training →</Link></div><div className="home-enrol__contacts"><a href="mailto:ken_trainers@kenvisiontechniks.com"><span>ken_trainers@kenvisiontechniks.com</span><small>Email</small></a><a href="tel:+254731983371"><span>+254 731 983 371</span><small>Training enquiries</small></a><a href="tel:+254725579251"><span>+254 725 579 251</span><small>General information</small></a><p className="talent-corporate__address">Building Feliz Stalls Q7, 8 &amp; 9<br/>Breaking News St, Kahawa Sukari Ave<br/>Kahawa Sukari, Nairobi</p></div></div></section>
    <section className="section section--white talent-terms"><div className="container"><div className="eyebrow"><span />Training Information</div><h2>Key information for delegates</h2><div className="talent-terms__grid">{['Workshop fees are quoted per individual delegate.','Registration is finalised 5 working days before the course.','Courses typically run 8:30am – 4:00pm.','Travel and accommodation are not included in the course fee.','Kenvision Techniks may change programme details without prior notice.','Cancellation 10+ working days before: refund less 20% admin fee.','Cancellation within 10 working days: no refund — full fee payable.','Delegate substitution allowed with 3 working days’ notice.','Courses are subject to minimum delegate numbers. If Kenvision cancels, fees are refunded in full.'].map((term) => <p key={term}>{term}</p>)}</div><Link href="/terms" className="text-link">Read full Terms &amp; Policies →</Link></div></section>
  </>
}
