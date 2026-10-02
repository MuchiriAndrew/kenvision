import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { isLmsEnabled } from '@/lib/features'

type Inquiry = {
  id: number | string
  name?: string | null
  email?: string | null
  inquiryType?: string | null
  status?: string | null
  createdAt?: string | null
}

const number = (value: number) => new Intl.NumberFormat('en').format(value)
const date = (value?: string | null) => value
  ? new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(value))
  : '—'

export const KenvisionDashboard = async ({ initPageResult }: AdminViewServerProps) => {
  const { req } = initPageResult
  const [courses, students, inquiriesCount, insights, pages, recent] = await Promise.all([
    req.payload.count({ collection: 'courses', req }),
    isLmsEnabled ? req.payload.count({ collection: 'users', where: { role: { equals: 'student' } }, req }) : Promise.resolve({ totalDocs: 0 }),
    req.payload.count({ collection: 'contact-inquiries', where: { status: { equals: 'new' } }, req }),
    req.payload.count({ collection: 'insights', req }),
    isLmsEnabled ? Promise.resolve({ totalDocs: 0 }) : req.payload.count({ collection: 'pages', where: { _status: { equals: 'published' } }, req }),
    req.payload.find({ collection: 'contact-inquiries', limit: 5, sort: '-createdAt', depth: 0, req }),
  ])

  const firstName = req.user?.fullName?.trim().split(/\s+/)[0] || 'there'
  const metrics = [
    { label: 'Courses', count: courses.totalDocs, href: '/admin/collections/courses' },
    ...(isLmsEnabled ? [{ label: 'Learners', count: students.totalDocs, href: '/admin/collections/users?where[role][equals]=student' }] : []),
    { label: 'New enquiries', count: inquiriesCount.totalDocs, href: '/admin/collections/contact-inquiries?where[status][equals]=new', attention: inquiriesCount.totalDocs > 0 },
    { label: 'Insights', count: insights.totalDocs, href: '/admin/collections/insights' },
    ...(!isLmsEnabled ? [{ label: 'Published pages', count: pages.totalDocs, href: '/admin/collections/pages' }] : []),
  ]

  return (
    <main className="kv-dashboard">
      <header className="kv-dashboard__header">
        <div>
          <p className="kv-dashboard__eyebrow"><span /> KENVISION TECHNIKS</p>
          <h1>Welcome back, {firstName}</h1>
          <p className="kv-dashboard__intro">{isLmsEnabled ? 'A quick overview of your website and learning platform.' : 'A quick overview of your website content and enquiries.'}</p>
        </div>
        <Link className="kv-dashboard__site-link" href="/">Visit website <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="kv-dashboard__metrics" aria-label="Workspace overview">
        {metrics.map((metric) => (
          <Link className={`kv-dashboard__metric${metric.attention ? ' kv-dashboard__metric--attention' : ''}`} href={metric.href} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{number(metric.count)}</strong>
            <span className="kv-dashboard__metric-action">View <b aria-hidden="true">→</b></span>
          </Link>
        ))}
      </section>

      <div className="kv-dashboard__content">
        <section className="kv-dashboard__section">
          <div className="kv-dashboard__section-heading">
            <div><h2>Recent enquiries</h2><p>The latest messages from your contact form.</p></div>
            <Link href="/admin/collections/contact-inquiries">View all <span aria-hidden="true">→</span></Link>
          </div>
          {recent.docs.length ? (
            <div className="kv-dashboard__table-wrap">
              <table className="kv-dashboard__table">
                <thead><tr><th>Name</th><th>Enquiry type</th><th>Status</th><th>Received</th></tr></thead>
                <tbody>
                  {(recent.docs as Inquiry[]).map((item) => (
                    <tr key={item.id}>
                      <td><Link href={`/admin/collections/contact-inquiries/${item.id}`}><strong>{item.name || 'New contact'}</strong><small>{item.email}</small></Link></td>
                      <td>{item.inquiryType || 'General'}</td>
                      <td><span className={`kv-dashboard__status${item.status === 'new' ? ' kv-dashboard__status--new' : ''}`}><i />{item.status || 'new'}</span></td>
                      <td>{date(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="kv-dashboard__empty">No enquiries yet. New messages will appear here.</p>
          )}
        </section>

        <section className="kv-dashboard__section kv-dashboard__actions">
          <div className="kv-dashboard__section-heading">
            <div><h2>Quick actions</h2><p>Jump straight into common tasks.</p></div>
          </div>
          <Link href="/admin/collections/courses/create"><span className="kv-dashboard__plus" aria-hidden="true">＋</span><span><strong>Create a course</strong><small>Add a new training programme</small></span><span className="kv-dashboard__arrow" aria-hidden="true">→</span></Link>
          <Link href="/admin/collections/insights/create"><span className="kv-dashboard__plus" aria-hidden="true">＋</span><span><strong>Write an insight</strong><small>Publish a story or update</small></span><span className="kv-dashboard__arrow" aria-hidden="true">→</span></Link>
          <Link href="/admin/globals/site-settings"><span className="kv-dashboard__plus" aria-hidden="true">↗</span><span><strong>Update site settings</strong><small>Contact details and metadata</small></span><span className="kv-dashboard__arrow" aria-hidden="true">→</span></Link>
        </section>
      </div>
    </main>
  )
}
