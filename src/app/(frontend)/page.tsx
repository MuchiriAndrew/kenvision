import type { Metadata } from 'next'
import Link from 'next/link'
import { CourseCard } from '@/components/CourseCard'
import { JsonLd } from '@/components/JsonLd'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getCourses } from '@/lib/cms'
import { isLmsEnabled } from '@/lib/features'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Professional Training & Technical Solutions in East Africa',
  description: 'Build practical capability with Kenvision Techniks. Explore professional training, security systems, information management and technical solutions across East and Southern Africa.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Kenvision Techniks | Training & Technical Solutions', description: 'Professional training and technical solutions that build capability.', url: '/' },
}

const areas = [
  { title: 'Security Systems', desc: 'CCTV, access control, alarms, electric fencing and fire detection.', image: 'https://images.unsplash.com/photo-1589935447067-5531094415d1?auto=format&fit=crop&w=900&q=85' },
  { title: 'Automotive Technology', desc: 'ECU programming, engine diagnostics, auto electrics and car security.', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85' },
  { title: 'Facilities & Property', desc: 'Facilities management, property management, FIMM and ArchiCAD.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85' },
  { title: 'Electrical & Power', desc: 'Generators, UPS, synchronization and basic electricity skills.', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85' },
  { title: 'ICT & Technical', desc: 'Fibre optic installation, mobile phone repair and maintenance.', image: 'https://images.unsplash.com/photo-1594915440248-1e419eba6611?auto=format&fit=crop&w=900&q=85' },
  { title: 'Professional & Management', desc: 'Supervisory skills, public speaking, secretarial and document control.', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85' },
]

const solutions = [
  ['01', 'Security Management', 'CCTV, access control, intruder alarms, electric fencing, fire detection and integrated control rooms.'],
  ['02', 'Information Management', 'Document management, records systems and information governance frameworks.'],
  ['03', 'GIS & Geospatial', 'Mapping, spatial analysis and geospatial technology for government and utilities.'],
  ['04', 'Technology Solutions', 'ICT infrastructure, fibre networks, smart building automation and integration.'],
  ['05', 'Organisational Development', 'Structured training programmes and capability building for teams and departments.'],
  ['06', 'Consulting', 'Strategic advice on security infrastructure, information systems and institutional technology.'],
]

const reasons = [
  ['01', 'Practical', 'Training focused on skills that can be applied directly in professional environments.'],
  ['02', 'Technical', 'Specialist disciplines across security, automotive, electrical and ICT.'],
  ['03', 'Flexible', 'In-person and online participation to suit different working arrangements.'],
  ['04', 'Professional', 'Structured training for individuals and organisations in an accountable environment.'],
]

export default async function HomePage() {
  const allCourses = await getCourses()
  const featuredIDs = ['advanced-supervisory-skills', 'practical-electric-fencing-2026', 'cctv-operator-control-room', 'car-engine-diagnostics', 'fibre-optic-installation', 'executive-public-speaking']
  const featuredCourses = featuredIDs.map((id) => allCourses.find((course) => course.id === id)).filter((course) => course !== undefined).slice(0, 6)

  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Kenvision Techniks Ltd', url: 'https://kenvisiontechniks.com', email: 'info@kenvisiontechniks.com', telephone: '+254725579251', address: { '@type': 'PostalAddress', streetAddress: 'Q7–Q9 Feliz Building, Kahawa Sukari Avenue', addressLocality: 'Nairobi', addressCountry: 'KE' }, areaServed: ['Kenya', 'Uganda', 'South Sudan', 'Malawi', 'Namibia'] }} />
    <section className="hero hero--home">
      <div className="container hero__grid">
        <div className="hero__copy">
          <ScrollReveal direction="left" delay={80}><div className="eyebrow eyebrow--copper"><span />Kenvision Techniks</div></ScrollReveal>
          <ScrollReveal direction="left" delay={160}><h1>Technology, expertise and training that build capability.</h1></ScrollReveal>
          <ScrollReveal direction="left" delay={240}><p className="hero__lede">Professional training and technical solutions designed to strengthen people, organisations and practical skills across East and Southern Africa.</p></ScrollReveal>
          <ScrollReveal direction="left" delay={320}><div className="hero__actions"><Link href="/training" className="btn-copper">Explore Training <span>→</span></Link><Link href="/solutions" className="btn-ghost-white">Explore Our Solutions</Link></div></ScrollReveal>
          <ScrollReveal direction="left" delay={400}><div className="hero-stats"><div><strong>Since 2004</strong><span>Founded in Nairobi</span></div><div><strong>5 Countries</strong><span>East & Southern Africa</span></div><div><strong>{allCourses.length} Programmes</strong><span>Across 6 training areas</span></div></div></ScrollReveal>
        </div>
        <ScrollReveal direction="right" delay={180} className="hero__visual"><div className="hero-photo hero-photo--large"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=88" alt="Technology professionals collaborating in a training environment" fetchPriority="high" /></div><div className="hero-photo hero-photo--small"><img src="https://images.unsplash.com/photo-1562910859-be83f1df7b56?auto=format&fit=crop&w=1200&q=88" alt="Technical training session" /></div></ScrollReveal>
      </div>
    </section>

    <section className="section section--sand"><div className="container split-grid">
      <ScrollReveal><div className="eyebrow"><span />01 — Training & Capacity Building</div><h2>Build skills that create impact.</h2><p className="section-lede">Explore practical professional training across technical, security, automotive, facilities, electrical, ICT and professional development disciplines.</p><div className="inline-actions"><Link href="/training" className="btn-primary">Explore All Training <span>→</span></Link><Link href={isLmsEnabled ? '/register' : '/contact?type=Course%20enrollment'} className="btn-secondary">{isLmsEnabled ? 'Register as a Student' : 'Ask about training'}</Link></div></ScrollReveal>
      <ScrollReveal className="stat-grid" delay={120}>{[[String(allCourses.length), 'Training programmes', 'Across 6 disciplines'], ['Hands-on', 'Practical learning', 'Skills for real work'], ['Flexible', 'Delivery options', 'In-person & online'], ['Nairobi', 'Talent Centre', 'Training since 2014']].map(([stat, label, sub]) => <div className="stat-card" key={label}><strong>{stat}</strong><b>{label}</b><span>{sub}</span></div>)}</ScrollReveal>
    </div></section>

    <section className="section section--white"><div className="container"><ScrollReveal><div className="eyebrow"><span />Training Areas</div></ScrollReveal><div className="section-heading-row"><ScrollReveal delay={80}><h2>Explore training by discipline.</h2></ScrollReveal><Link href="/training" className="text-link">View full catalogue <span>→</span></Link></div>
      <div className="area-grid">{areas.map((area, index) => <ScrollReveal key={area.title} delay={index * 60}><Link href={`/training?category=${encodeURIComponent(area.title)}`} className="area-card"><div className="area-card__image"><img src={area.image} alt={area.title} loading="lazy" /></div><div className="area-card__body"><h3>{area.title}</h3><p>{area.desc}</p></div></Link></ScrollReveal>)}</div>
    </div></section>

    <section className="section section--sand"><div className="container"><ScrollReveal><div className="eyebrow"><span />Featured Training</div></ScrollReveal><div className="section-heading-row"><ScrollReveal delay={80}><div><h2>Programmes to explore.</h2><p className="section-subtext">Explore practical workshops and professional training opportunities.</p></div></ScrollReveal><Link href="/training" className="text-link">View all <span>→</span></Link></div><div className="course-grid">{featuredCourses.map((course) => <ScrollReveal key={course.id}><CourseCard course={course} featured /></ScrollReveal>)}</div></div></section>

    <section className="section section--deep"><div className="container split-grid split-grid--cta"><ScrollReveal><div className="eyebrow eyebrow--muted"><span />Organisational Training</div><h2>Train your team. Build organisational capability.</h2><p className="section-lede section-lede--light">Kenvision supports organisations looking to develop practical technical and professional capabilities through structured training.</p><div className="inline-actions"><Link href="/contact?type=Corporate%20training" className="btn-copper">Request Corporate Training <span>→</span></Link><Link href="/contact" className="btn-ghost-white">Contact Training Division</Link></div></ScrollReveal><ScrollReveal className="benefits-grid" direction="right" delay={120}>{[['Customised Delivery', 'Training shaped around your team’s roles and environment.'], ['In-Person or Online', 'Flexible delivery to suit your organisation’s location and schedule.'], ['Small Group Sessions', 'Caps of 5–18 participants for engagement and accountability.'], ['Professional Context', 'Training that understands Kenyan and East African institutional needs.']].map(([title, text]) => <div key={title} className="benefit-card"><h3>{title}</h3><p>{text}</p></div>)}</ScrollReveal></div></section>

    <section className="section section--white"><div className="container"><ScrollReveal><div className="eyebrow"><span />Why Kenvision</div><h2 className="why-heading">Practical training. Professional application.</h2></ScrollReveal><div className="reasons-grid">{reasons.map(([num, title, text], index) => <ScrollReveal key={num} delay={index * 70}><article className="reason-card"><span className="copper-num">{num}</span><h3>{title}</h3><p>{text}</p></article></ScrollReveal>)}</div></div></section>

    <section className="section section--charcoal"><div className="container"><ScrollReveal><div className="eyebrow eyebrow--muted"><span />Beyond Training</div></ScrollReveal><div className="section-heading-row"><ScrollReveal delay={80}><h2>Integrated expertise across disciplines.</h2></ScrollReveal><Link href="/solutions" className="text-link text-link--light">View all solutions <span>→</span></Link></div><div className="solutions-grid">{solutions.map(([num, title, text], index) => <ScrollReveal key={num} delay={index * 55}><article className="solution-card"><div><span className="copper-num">{num}</span><h3>{title}</h3></div><p>{text}</p></article></ScrollReveal>)}</div></div></section>

    <section className="final-cta"><ScrollReveal className="final-cta__inner"><div className="final-cta__rule" /><h2>Start your next learning journey with Kenvision.</h2><p>{isLmsEnabled ? 'Explore upcoming training programmes or register as a student today.' : 'Explore our programmes and speak with the training team about your next step.'}</p><div className="inline-actions inline-actions--center"><Link href={isLmsEnabled ? '/register' : '/contact?type=Course%20enrollment'} className="btn-copper">{isLmsEnabled ? 'Register as a Student' : 'Talk to the training team'} <span>→</span></Link><Link href="/training" className="btn-ghost-white">View Training Catalogue</Link></div></ScrollReveal></section>
  </>
}
