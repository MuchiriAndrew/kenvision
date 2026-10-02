import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'
import { isLmsEnabled } from '@/lib/features'
export const metadata: Metadata={title:'Create a student account',robots:{index:false,follow:false}}
export default async function RegisterPage({searchParams}:{searchParams:Promise<{course?:string}>}){if(!isLmsEnabled)notFound();const {course}=await searchParams;return <div className="auth-shell"><aside className="auth-aside"><Link href="/" className="wordmark wordmark--footer"><span className="wordmark__name">KENVISION</span><span className="wordmark__sub">TALENT CENTRE</span></Link><div><div className="eyebrow eyebrow--copper"><span/>Your next step</div><h1>Make learning part of your journey.</h1><p>Create your learner profile to keep your training and progress together.</p></div><Link href="/" className="footer-link">← Back to Kenvision Techniks</Link></aside><div className="auth-form-wrap"><AuthForm mode="register" courseSlug={course}/></div></div>}
