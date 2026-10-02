import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { ContactForm } from '@/components/ContactForm'
export const metadata: Metadata = { title: 'Contact Us', description: 'Contact Kenvision Techniks in Nairobi for security systems, professional training and technology solutions.', alternates: { canonical: '/contact' } }
export default async function ContactPage({searchParams}:{searchParams:Promise<{type?:string;course?:string}>}) {
  const query = await searchParams
  const inquiryType = ['General','Security systems','Corporate training','Course enrollment','Other'].includes(query.type||'') ? query.type : 'Security systems'
  const courseTitle = query.course?.slice(0,160)
  return <>
    <PageHero eyebrow="Contact" title={<>Direct contact.<br />No bots.</>} description="Security system quote or training enquiry. We're based in Nairobi and respond directly." variant="contact" image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=520&q=85" secondaryImage="https://images.unsplash.com/photo-1562910859-be83f1df7b56?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&w=800&h=340&q=85" />
    <section className="section section--white contact-section"><div className="container contact-content">
      <div><h2>Send us a message</h2><ContactForm inquiryType={inquiryType} courseTitle={courseTitle}/></div>
      <aside className="contact-details"><h2>Find us</h2>
        <div><span>Address</span><p>Q7–Q9 Feliz Building<br/>Kahawa Sukari Avenue<br/>Off Thika Superhighway<br/>Nairobi, Kenya</p></div>
        <div><span>Phone</span><p><a href="tel:+254725579251">+254 725 579 251</a></p></div>
        <div><span>General enquiries</span><p><a href="mailto:info@kenvisiontechniks.com">info@kenvisiontechniks.com</a></p></div>
        <div><span>Training enquiries</span><p><a href="mailto:ken_trainers@kenvisiontechniks.com">ken_trainers@kenvisiontechniks.com</a><br/>@Ken_Trainers</p></div>
        <div><span>Office hours</span><p>Mon–Fri: 8:00am – 5:00pm<br/>Sat: 9:00am – 1:00pm</p></div>
      </aside>
    </div></section>
  </>
}
