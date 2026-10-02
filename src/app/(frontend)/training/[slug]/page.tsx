import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { getCourse, getCourses } from '@/lib/cms'
import { formatPrice } from '@/data/courses'
import { EnrollButton } from '@/components/EnrollButton'
import { RichTextView } from '@/components/RichTextView'
import { isLmsEnabled } from '@/lib/features'
import { entryMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) return { title: 'Training Programme Not Found' }
  return entryMetadata(course, { title: course.title, description: course.summary || `${course.title} professional training at Kenvision Techniks in Nairobi, Kenya.`, image: course.image }, `/training/${slug}`)
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()
  const related = (await getCourses()).filter((item) => item.category === course.category && item.id !== slug).slice(0, 3)
  const enquiryHref = `/contact?type=Course%20enrollment&course=${encodeURIComponent(course.title)}`
  const nextDate = course.upcomingDate
    ? new Intl.DateTimeFormat('en-KE', { dateStyle: 'long' }).format(new Date(course.upcomingDate))
    : 'Confirm with our team'

  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: course.summary || course.title, provider: { '@type': 'Organization', name: 'Kenvision Techniks Ltd', sameAs: 'https://kenvisiontechniks.com' }, offers: { '@type': 'Offer', price: course.price, priceCurrency: 'KES', availability: 'https://schema.org/InStock', url: `https://kenvisiontechniks.com/training/${slug}` } }} />
    <section className="course-detail-hero"><div className="container">
      <nav className="course-breadcrumb" aria-label="Breadcrumb"><Link href="/talent">Training Catalogue</Link><span>›</span><span>{course.category}</span></nav>
      <div className="course-detail-hero__grid"><div><span className="course-category-badge">{course.category}</span><h1>{course.title}</h1><div className="inline-actions"><Link href={isLmsEnabled ? `/register?course=${slug}` : enquiryHref} className="btn-copper">{isLmsEnabled ? 'Enrol for this Training' : 'Enquire for this Training'} →</Link><Link href="/contact" className="btn-ghost-white">Ask About This Course</Link></div></div>
        <aside className="course-price-panel"><span>Course Fee</span><strong>{formatPrice(course.price)}</strong>{course.was && <del>{formatPrice(course.was)}</del>}<dl><div><dt>Duration</dt><dd>{course.duration || 'Enquire for details'}</dd></div><div><dt>Schedule</dt><dd>{course.upcomingDate ? nextDate : 'Enquire for dates'}</dd></div><div><dt>Venue</dt><dd>Enquire for location</dd></div></dl></aside>
      </div>
    </div></section>
    <section className="course-information"><div className="container course-information__grid"><article><div className="eyebrow"><span />About This Programme</div><h2>Course information</h2><div className="course-information__notice"><span aria-hidden="true">ℹ</span><div><h3>{course.description ? 'About this training' : 'Information available on enquiry'}</h3>{course.description ? <RichTextView value={course.description} /> : <p>Detailed course information — including schedule dates, session duration, venue, trainer profiles, and course content — is available on enquiry. Contact the Kenvision Training Division for a full information pack.</p>}<div className="inline-actions"><a href="mailto:ken_trainers@kenvisiontechniks.com" className="btn-secondary">Email Training Division</a><a href="tel:+254731983371" className="btn-secondary">+254 731 983 371</a></div></div></div>{course.tags.length > 0 && <div className="course-topic-areas"><h3>Topic areas</h3><div>{course.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>}</article>
      <aside className="course-information__sidebar"><div className="course-sidebar-card"><h3>Ready to enrol?</h3>{isLmsEnabled ? <EnrollButton slug={slug} /> : <Link href={enquiryHref} className="btn-primary">Enquire for this Training →</Link>}<Link href="/contact" className="btn-secondary">Ask a question</Link></div><div className="course-sidebar-card"><h3>Training Division</h3><a href="mailto:ken_trainers@kenvisiontechniks.com">ken_trainers@kenvisiontechniks.com</a><a href="tel:+254731983371">+254 731 983 371</a><a href="tel:+254725579251">+254 725 579 251</a></div><div className="course-sidebar-card"><h3>More in {course.category}</h3>{related.map((item) => <Link href={`/training/${item.id}`} key={item.id}>{item.title.length > 60 ? `${item.title.slice(0, 58)}…` : item.title}</Link>)}<Link href={`/talent?category=${encodeURIComponent(course.category)}`} className="course-sidebar-card__all">View all courses →</Link></div></aside>
    </div></section>
    <section className="course-terms-strip"><div className="container"><p>Workshop fees are per delegate. Cancellation 10+ working days before: refund less 20% admin fee. Within 10 working days: full fee payable. Courses subject to minimum numbers.</p><Link href="/terms">Full Terms →</Link></div></section>
  </>
}
