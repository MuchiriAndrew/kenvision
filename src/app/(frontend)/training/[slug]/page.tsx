import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { getCourse } from '@/lib/cms'
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
  const enquiryHref = `/contact?type=Course%20enrollment&course=${encodeURIComponent(course.title)}`
  const nextDate = course.upcomingDate
    ? new Intl.DateTimeFormat('en-KE', { dateStyle: 'long' }).format(new Date(course.upcomingDate))
    : 'Confirm with our team'

  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: course.summary || course.title, provider: { '@type': 'Organization', name: 'Kenvision Techniks Ltd', sameAs: 'https://kenvisiontechniks.com' }, offers: { '@type': 'Offer', price: course.price, priceCurrency: 'KES', availability: 'https://schema.org/InStock', url: `https://kenvisiontechniks.com/training/${slug}` } }} />
    <PageHero eyebrow={course.category} title={course.title} description={course.summary || 'A practical professional programme from the Kenvision Techniks Talent Centre, designed to build skills you can apply directly at work.'} image={course.image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85'}>
      <Link href={isLmsEnabled ? `/register?course=${slug}` : enquiryHref} className="btn-copper">{isLmsEnabled ? 'Register for this programme' : 'Enquire about this programme'} <span>→</span></Link><Link href="/contact" className="btn-ghost-white">Ask a question</Link>
    </PageHero>
    <section className="section section--white"><div className="container detail-grid">
      <article className="detail-content"><div className="eyebrow"><span />Programme overview</div><h2>Learn skills you can put to work.</h2><p className="section-lede">This programme combines expert instruction with practical application. Contact the training team for the next available dates and delivery options.</p>{Boolean(course.description) && <div className="prose course-description"><RichTextView value={course.description}/></div>}<div className="detail-panel"><h3>What you’ll gain</h3><ul>{(course.outcomes?.length ? course.outcomes : ['Practical, job-relevant technical knowledge', 'Guided instruction from experienced practitioners', 'A professional learning environment with small groups', 'A certificate of completion after meeting course requirements']).map((item) => <li key={item}>{item}</li>)}</ul></div>{Boolean(course.requirements?.length) && <div className="detail-panel"><h3>Before you join</h3><ul>{course.requirements?.map((item) => <li key={item}>{item}</li>)}</ul></div>}<div className="detail-panel"><h3>Course information</h3><p>Training dates are confirmed with each cohort. {isLmsEnabled ? 'Choose a registration option' : 'Send us an enquiry'} and the Talent Centre will follow up with the schedule, prerequisites and payment instructions.</p></div></article>
      <aside className="course-aside"><div className="eyebrow"><span />Course details</div><div className="price-large">{formatPrice(course.price)}</div>{course.was && <del className="price-was">{formatPrice(course.was)}</del>}<dl><div><dt>Training area</dt><dd>{course.category}</dd></div>{course.duration && <div><dt>Duration</dt><dd>{course.duration}</dd></div>}{course.level && <div><dt>Level</dt><dd>{course.level}</dd></div>}<div><dt>Delivery</dt><dd>{course.deliveryModes?.length ? course.deliveryModes.join(' · ') : 'Confirm with our team'}</dd></div><div><dt>Upcoming dates</dt><dd>{nextDate}</dd></div></dl>{isLmsEnabled ? <><EnrollButton slug={slug}/><Link href={enquiryHref} className="btn-secondary aside-button">Ask about this course</Link></> : <Link href={enquiryHref} className="btn-primary aside-button">Enquire about this course <span>→</span></Link>}<p className="aside-help">Questions? <a href="mailto:ken_trainers@kenvisiontechniks.com">Email the training team</a></p></aside>
    </div></section>
    <section className="section section--sand"><div className="container"><div className="section-heading-row"><div><div className="eyebrow"><span />Your next step</div><h2>Ready to take the next step?</h2></div><Link href={isLmsEnabled ? `/register?course=${slug}` : enquiryHref} className="btn-primary">{isLmsEnabled ? 'Create your student account' : 'Contact the training team'} <span>→</span></Link></div><p className="section-lede">{isLmsEnabled ? 'Create a student account to track your training history and access your learning materials as they become available.' : 'Tell us which programme interests you. We’ll confirm dates, delivery options and how to register.'}</p></div></section>
  </>
}
