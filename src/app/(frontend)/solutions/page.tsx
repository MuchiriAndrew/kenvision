import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Security & Technical Solutions', description: 'Integrated security, information management, GIS, technology and operational solutions from Kenvision Techniks.', alternates: { canonical: '/solutions' } }
const services = [
  {title:'CCTV Systems',desc:'IP and analog surveillance, from a single camera to multi-site control rooms. HD/4K cameras, NVR/DVR storage, remote monitoring, and forensic-grade retrieval.',features:['HD/4K IP cameras','Forensic-grade storage','Remote monitoring','Control room setup']},
  {title:'Access Control & Time Attendance',desc:'Biometric, card-based, and mobile credential systems with integrated time-attendance reporting for payroll and compliance.',features:['Fingerprint & face recognition','RFID card systems','Time-attendance reporting','Visitor management']},
  {title:'Intruder Alarms & Electric Fencing',desc:'PIR, microwave, and glass-break detection with zoned control panels. Perimeter energisers from 2J to 12J with integrated monitoring.',features:['Zoned alarm panels','SMS & app alerts','Perimeter energisers','Guard response integration']},
  {title:'Fire Detection & Suppression',desc:'Addressable fire alarm panels, smoke and heat detectors, and suppression systems with full compliance documentation for fire authority sign-off.',features:['Addressable panels','Suppression systems','Compliance reports','Annual service contracts']},
  {title:'Information Management',desc:'Document management systems, records governance frameworks, and information architecture for organisations managing large volumes of structured data.',features:['Document management','Records governance','Digital archiving','Compliance frameworks']},
  {title:'GIS & Geospatial Solutions',desc:'Mapping, spatial data analysis, and geospatial technology deployments for government, utilities, and private sector clients across East Africa.',features:['GIS mapping','Spatial data analysis','Field data collection','Asset mapping']},
  {title:'Generator Control & Monitoring',desc:'AMF/ATS panels, ComAp controller integration, and remote monitoring for mission-critical power across large facilities and campuses.',features:['AMF/ATS panels','ComAp integration','Remote monitoring','Maintenance contracts']},
  {title:'Smart Building Automation',desc:'Integrated access, CCTV, lighting, and AV control under a single management platform for commercial and hospitality properties.',features:['KNX integration','Centralised control','AV systems','Energy management']},
]
const process = [
  ['Site Survey','We assess the site, threat profile, and existing infrastructure before touching a specification sheet.'],
  ['System Design','Topology, equipment schedule, cable routes, and a costed proposal — all in writing.'],
  ['Installation','Our own technicians install, not sub-contractors. Every cable run is documented.'],
  ['Commission & Train','We test every zone, hand over with documentation, and train your staff on the system.'],
]
export default function SolutionsPage() { return <>
  <PageHero eyebrow="Solutions" title={<>Integrated expertise.<br />Across eight disciplines.</>} description="We design, supply, install, and commission security, information, and technology systems for banks, government, education, hospitality, and estates across East and Southern Africa." image="https://images.unsplash.com/photo-1589935447067-5531094415d1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=520&q=85" secondaryImage="https://images.unsplash.com/photo-1549109926-9620d1b9bfa2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=340&q=85"><Link className="btn-copper" href="/contact">Get a system quote <span>→</span></Link><Link href="/clients" className="btn-ghost-white">View clients</Link></PageHero>
  <section className="section section--sand"><div className="container"><div className="solutions-grid solutions-grid--two">{services.map((service,i) => <article key={service.title} className="solution-card solution-card--detailed"><div className="solution-card__number"><span className="copper-num">{String(i+1).padStart(2,'0')}</span></div><h3>{service.title}</h3><p>{service.desc}</p><ul className="feature-list">{service.features.map((feature)=><li key={feature}>{feature}</li>)}</ul></article>)}</div></div></section>
  <section className="section section--white process-section"><div className="container"><div className="eyebrow"><span />Our process</div><h2>From survey to sign-off.</h2><div className="process-grid">{process.map(([title,desc],i)=><article className="process-card" key={title}><span className="copper-num">0{i+1}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>
  <section className="section section--sand quote-section"><div className="container"><h2>Need a system quoted?</h2><p>Tell us about your site. We survey, design, and put a detailed costed proposal in writing. No obligation.</p><Link href="/contact" className="btn-primary">Request a quote →</Link></div></section>
</> }
