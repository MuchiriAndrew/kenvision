import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { JsonLd } from '@/components/JsonLd'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Professional Training Courses in Kenya',
  description: 'Browse 40 practical professional training programmes in security, automotive, facilities, electrical, ICT and management disciplines.',
  alternates: { canonical: '/training' },
}

const trainingReasons = [
  ['01', 'Practical', 'Focus on learning that can be applied directly in professional environments. Skills over theory.'],
  ['02', 'Professional', 'Training delivered within a structured, professional setting by experienced practitioners.'],
  ['03', 'Flexible', 'Support for both in-person and online participation to accommodate different working arrangements.'],
]

const organisationalSupport = [
  ['Workshop delivery', 'Tailored training delivered at your premises or at the Kenvision training centre.'],
  ['Team capacity building', 'Structured programmes designed to build capability across your organisation.'],
  ['Flexible scheduling', 'Training scheduled around your team’s availability and operational requirements.'],
]

export default function TrainingPage() {
  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Kenvision Training Catalogue', description: 'Practical professional training programmes in Kenya and East Africa.', url: 'https://kenvisiontechniks.com/training' }} />
    <PageHero eyebrow="Training & Capacity Building" title={<>Build skills that<br />create impact.</>} description="Practical professional training designed to strengthen skills, capability and organisational performance across East Africa." tone="charcoal" variant="training" image="https://images.unsplash.com/photo-1562910859-be83f1df7b56?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=560&q=85" secondaryImage="https://images.unsplash.com/photo-1768633647910-7e6fb53e5b0f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=240&q=85"><Link className="btn-primary" href="/talent">Explore Training →</Link><Link className="btn-ghost-white" href="/contact">Enquire About Training</Link></PageHero>
    <section className="section section--sand training-intro"><div className="container"><div className="training-intro__copy">
      <div className="eyebrow"><span />Kenvision Training Division</div><h2>Professional learning built around practical capability.</h2><p>Kenvision&apos;s Training Division provides professional workshops and training opportunities for individuals and organisations. Training can be delivered through in-person classroom and workshop sessions, or through online participation — built around what your situation requires.</p>
    </div></div></section>
    <section className="section section--white"><div className="container">
      <div className="eyebrow"><span />Flexible Delivery</div><h2 className="training-section-title">Train in the way that works for you.</h2>
      <div className="delivery-grid">
        {[
          { number:'01', title:'In-Person', text:'Classroom and workshop-based learning in a professional training environment. Direct interaction with facilitators and fellow participants.', accent:'green', icon:<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21l4-4 4 4M12 17v-4M8 10l4-4 4 4"/></> },
          { number:'02', title:'Online', text:'Participate remotely through structured online training delivery. Access the same professional content from wherever you are based.', accent:'copper', icon:<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
        ].map((item) => <article className={`delivery-card delivery-card--${item.accent}`} key={item.title}>
          <div className="delivery-card__meta"><span className="copper-num">{item.number}</span><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{item.icon}</svg></div>
          <h3>{item.title}</h3><p>{item.text}</p><Link href="/talent" className="text-link">View Training →</Link>
        </article>)}
      </div>
    </div></section>
    <section className="section section--sand"><div className="container">
      <div className="training-programmes-head"><div><div className="eyebrow"><span />Upcoming Training</div><h2>Explore upcoming workshops.</h2><p>Discover upcoming professional training opportunities and find a programme that fits your needs.</p></div><Link href="/talent" className="btn-secondary">View all programmes →</Link></div>
      <div className="training-schedule-note"><span aria-hidden="true" />Programme dates and details will be updated when the Kenvision training schedule is confirmed.</div>
      <div className="training-preview-grid">{[0,1,2].map((index)=><article className="training-preview" key={index}><span className="training-preview__badge">Placeholder — editable</span><h3>Training Programme Title</h3><div className="training-preview__meta"><span>▣ &nbsp;Date TBC</span><span>◉ &nbsp;Delivery mode</span></div><p>Short description of the professional training programme. Content to be updated once the Kenvision course schedule is confirmed.</p><Link href="/talent">View Programme →</Link></article>)}</div>
    </div></section>
    <section className="section training-organisations"><img className="training-organisations__texture" src="https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600&q=80" alt="" /><div className="container training-organisations__grid"><div><div className="eyebrow eyebrow--copper"><span />For Organisations</div><h2>Training designed around your organisation.</h2><p>Whether you are looking to upskill a team, run an internal workshop, or build broader organisational capacity — speak with the Kenvision Training Division about your requirements.</p><div className="inline-actions"><Link href="/contact?type=Corporate%20training" className="btn-copper">Enquire About Training →</Link><Link href="/contact" className="training-organisations__link">Talk to the Training Division →</Link></div></div><div className="training-organisations__list">{organisationalSupport.map(([title, desc]) => <article key={title}><span aria-hidden="true"/><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div></div></section>
    <section className="section section--sand"><div className="container"><div className="training-reasons-heading"><div className="eyebrow"><span />Why Train With Kenvision</div><h2>Practical learning. Professional application.</h2></div><div className="training-reasons-grid">{trainingReasons.map(([number, title, desc]) => <article className="training-reason-card" key={number}><span className="copper-num">{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>
    <section className="training-final"><div className="training-final__rule"/><div className="container"><h2>Ready to build your capabilities?</h2><p>Explore upcoming training opportunities or speak with the Kenvision Training Division about your requirements.</p><div className="inline-actions inline-actions--center"><Link href="/talent" className="btn-primary">Explore Training →</Link><Link href="/contact" className="btn-ghost-white">Contact Training Division</Link></div><div className="training-final__contact"><div><span>Training enquiries</span><a href="mailto:ken_trainers@kenvisiontechniks.com">ken_trainers@kenvisiontechniks.com</a></div><div><span>Phone</span><a href="tel:+254731983371">+254 731 983 371</a></div></div></div></section>
  </>
}
