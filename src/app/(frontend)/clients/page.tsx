import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
export const metadata: Metadata = { title: 'Our Clients', description: 'Kenvision Techniks supports organisations across public service, education, security, infrastructure and enterprise.', alternates: { canonical: '/clients' } }
const countries = [
  { name:'Kenya', highlight:true, clients:['Multiple banking institutions','Schools and universities','Private estates','Hospitality properties','Government facilities'] },
  { name:'Uganda', highlight:false, clients:['Parliament of Uganda','Bank of Uganda','Commercial properties','Educational institutions'] },
  { name:'South Sudan', highlight:false, clients:['Corporate offices','NGO compounds','Hospitality'] },
  { name:'Malawi', highlight:true, clients:['Reserve Bank of Malawi','US Embassy Lilongwe','Commercial banks'] },
  { name:'Namibia', highlight:false, clients:['Commercial and industrial clients'] },
  { name:'UK & USA', highlight:false, clients:['International project support','Remote system commissioning'] },
]
const partners = [
  { num:'01', name:'Hikvision', role:'CCTV & Video Surveillance', desc:'Global CCTV leader. We source, install, and configure Hikvision IP cameras, NVRs, and VMS platforms.' },
  { num:'02', name:'Beam Auto', role:'Automotive Diagnostics', desc:'ECU programming tools and diagnostic software for key programming and remapping training.' },
  { num:'03', name:'ComAp', role:'Generator Controls', desc:'AMF/ATS controller integration and remote generator monitoring for mission-critical power.' },
]

export default function ClientsPage() {
  return <>
    <PageHero eyebrow="Client Portfolio" title={<>Trusted by institutions<br />that can’t afford to fail.</>} description="100+ institutional accounts across 5 countries. Parliaments, central banks, embassies, schools, hospitality. Security infrastructure that earns trust through performance." image="https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=520&q=85" secondaryImage="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=340&q=85">
      <div className="client-stat-row"><div><strong>100+</strong><span>Institutional clients</span></div><div><strong>5</strong><span>Countries</span></div><div><strong>20+</strong><span>Years active</span></div></div>
    </PageHero>
    <section className="section section--sand clients-country">
      <div className="container">
        <div className="eyebrow"><span />Where We Work</div>
        <h2>East and Southern Africa, and beyond.</h2>
        <div className="solutions-grid client-country-grid">
          {countries.map((country, i) => <article key={country.name} className={`client-country-card${country.highlight ? ' client-country-card--highlight' : ''}`}>
            <div className="client-country-card__heading"><h3>{country.name}</h3><span className="copper-num">0{i + 1}</span></div>
            <ul>{country.clients.map((client) => <li key={client}>{client}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>
    <section className="section section--white client-partners">
      <div className="container">
        <div className="eyebrow"><span />Technology Partners</div>
        <h2>We work with the brands institutions trust.</h2>
        <div className="client-partners__grid">{partners.map((partner) => <article className="client-partner card" key={partner.name}>
          <span className="copper-num">{partner.num}</span><h3>{partner.name}</h3><div>{partner.role}</div><p>{partner.desc}</p>
        </article>)}</div>
      </div>
    </section>
    <section className="final-cta clients-cta"><div className="final-cta__inner"><h2>Ready to become a client?</h2><p>Security system or training enquiry — we&apos;re in Nairobi and available.</p><Link href="/contact" className="btn-copper">Get in touch →</Link></div></section>
  </>
}
