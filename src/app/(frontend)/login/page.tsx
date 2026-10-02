import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'
import { isLmsEnabled } from '@/lib/features'
export const metadata: Metadata={title:'Sign in',robots:{index:false,follow:false}}
export default async function LoginPage({searchParams}:{searchParams:Promise<{next?:string}>}){if(!isLmsEnabled)notFound();const {next}=await searchParams;const returnTo=next?.startsWith('/')&&!next.startsWith('//')?next:'/dashboard';return <div className="auth-shell"><aside className="auth-aside"><Link href="/" className="wordmark wordmark--footer"><span className="wordmark__name">KENVISION</span><span className="wordmark__sub">TALENT CENTRE</span></Link><div><div className="eyebrow eyebrow--copper"><span/>Learn with purpose</div><h1>Build skills that move you forward.</h1><p>Access your courses, track your progress and keep your learning journey in one place.</p></div><Link href="/" className="footer-link">← Back to Kenvision Techniks</Link></aside><div className="auth-form-wrap"><AuthForm mode="login" returnTo={returnTo}/></div></div>}
