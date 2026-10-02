import Link from 'next/link'

const groups = [
  { title: 'Solutions', links: [['Security & Risk', '/solutions'], ['Information Management', '/solutions'], ['GIS & Geospatial', '/solutions'], ['Technology & Digital', '/solutions'], ['Training & Capacity', '/training']] },
  { title: 'Training', links: [['All Programmes', '/talent'], ['Physical Security', '/talent?category=Security%20Systems'], ['Automotive & ICT', '/talent?category=Automotive%20Technology'], ['Facilities & Admin', '/talent?category=Facilities%20%26%20Property'], ['Corporate Training', '/contact?type=Corporate%20training'], ['Training Enquiry', '/contact?type=Course%20enrollment']] },
  { title: 'Company', links: [['About Us', '/about'], ['Our Clients', '/clients'], ['Contact', '/contact'], ['Terms & Policies', '/terms']] },
]

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-brand">
        <Link href="/" className="wordmark wordmark--footer"><span className="wordmark__name">KENVISION</span><span className="wordmark__sub">TECHNIKS</span></Link>
        <p>Established expertise in security, information management, technology, and professional training. Serving organisations across East and Southern Africa since 2007.</p>
        <p className="footer-address">Q7–Q9 Feliz Building<br />Kahawa Sukari Avenue, Nairobi<br />Reg. No. C.140996 · Est. 2004</p>
      </div>
      {groups.map((group) => <div key={group.title}>
        <h2 className="footer-heading">{group.title}</h2>
        {group.links.map(([label, href]) => <Link key={label} href={href} className="footer-link">{label}</Link>)}
      </div>)}
    </div>
    <div className="container footer-bottom"><p>© {new Date().getFullYear()} Kenvision Techniks Ltd. All rights reserved.</p><p>+254 725 579 251 · info@kenvisiontechniks.com · @Ken_Trainers</p></div>
  </footer>
}
