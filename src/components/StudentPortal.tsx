'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

export type PortalCourse = {
  id: number
  slug: string
  title: string
  category: string
  image: string | null
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  progress: number
  enrolledAt: string
  completedAt: string | null
  updatedAt: string
  upcomingDate: string | null
  deliveryMode: string | null
}

type PortalCertificate = {
  id: number
  number: string
  title: string
  issuedAt: string
  fileUrl: string | null
}
type PortalRecommendation = {
  slug: string
  title: string
  category: string
  image: string | null
  price: number
}
type PortalActivity = { id: string; kind: string; title: string; date: string }
type PortalPayment = { course: string; date: string; amount: number; status: string }
export type PortalData = {
  demo?: boolean
  asOf: string
  student: {
    id: number
    name: string
    email: string
    phone: string
    country: string
    jobTitle: string
    role: 'student' | 'instructor' | 'admin'
  }
  courses: PortalCourse[]
  certificates: PortalCertificate[]
  recommendations: PortalRecommendation[]
  activity: PortalActivity[]
  completedLessons: number
  learningHours?: number
  payments?: PortalPayment[]
}

type Section = 'overview' | 'courses' | 'certificates' | 'payments' | 'profile' | 'support'
type IconName =
  | 'grid'
  | 'book'
  | 'library'
  | 'award'
  | 'card'
  | 'user'
  | 'help'
  | 'logout'
  | 'bell'
  | 'menu'
  | 'close'
  | 'arrow'
  | 'clock'
  | 'check'
  | 'calendar'
  | 'chevron'
  | 'edit'
  | 'play'
  | 'download'
  | 'layers'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    library: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m8 13-1 9 5-3 5 3-1-9" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 10h20M6 16h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.7 2.7 0 0 1 5.3.7c0 2-2.8 2.5-2.8 4.3M12 17.5h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21h4" />
      </>
    ),
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    edit: (
      <>
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z" />
      </>
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8 5 4-5 4Z" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const categoryImages: Record<string, string> = {
  'Security Systems':
    'https://images.unsplash.com/photo-1589935447067-5531094415d1?auto=format&fit=crop&w=900&q=85',
  'Automotive Technology':
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85',
  'Facilities & Property':
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85',
  'Electrical & Power':
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85',
  'ICT & Technical':
    'https://images.unsplash.com/photo-1594915440248-1e419eba6611?auto=format&fit=crop&w=900&q=85',
  'Professional & Management':
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85',
}
function artwork(course: { image: string | null; category: string }) {
  return course.image || categoryImages[course.category] || categoryImages['ICT & Technical']
}
function date(value: string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
function money(value: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(value)
}
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function SectionHeading({
  title,
  detail,
  action,
}: {
  title: string
  detail?: string
  action?: ReactNode
}) {
  return (
    <div className="sp-section-heading">
      <div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="sp-progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% complete`}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

function PaymentsTable({ payments }: { payments: PortalPayment[] }) {
  return (
    <div className="sp-payments-table">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={`${payment.course}-${payment.date}`}>
              <td data-label="Course">{payment.course}</td>
              <td data-label="Date">{date(payment.date)}</td>
              <td data-label="Amount">{money(payment.amount)}</td>
              <td data-label="Status">
                <span className="sp-paid">{payment.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CourseTile({ course, demo = false }: { course: PortalCourse; demo?: boolean }) {
  const canLearn = course.status === 'active' && Boolean(course.slug)
  return (
    <article className="sp-course-tile">
      <div className="sp-course-tile__image">
        <img src={artwork(course)} alt="" loading="lazy" />
        <span className={`sp-status sp-status--${course.status}`}>
          {course.status === 'active'
            ? 'In progress'
            : course.status === 'pending'
              ? 'Pending approval'
              : course.status === 'completed'
                ? 'Completed'
                : 'Cancelled'}
        </span>
      </div>
      <div className="sp-course-tile__body">
        <span className="sp-kicker">{course.category}</span>
        <h3>{course.title}</h3>
        <div className="sp-course-tile__progress-label">
          <span>Course progress</span>
          <strong>{course.progress}%</strong>
        </div>
        <ProgressBar value={course.progress} />
        <p className="sp-course-tile__meta">
          {course.status === 'completed' && course.completedAt
            ? `Completed ${date(course.completedAt)}`
            : `Enrolled ${date(course.enrolledAt)}`}
        </p>
        {canLearn ? (
          <Link
            href={`/learn/${course.slug}${demo ? '?demo=1' : ''}`}
            className="sp-button sp-button--primary"
          >
            Continue course <Icon name="arrow" size={16} />
          </Link>
        ) : (
          <Link
            href={course.slug ? `/training/${course.slug}` : '/training'}
            className="sp-button sp-button--outline"
          >
            View programme <Icon name="arrow" size={16} />
          </Link>
        )}
      </div>
    </article>
  )
}

const navigation: { section: Section; label: string; icon: IconName }[] = [
  { section: 'overview', label: 'Dashboard', icon: 'grid' },
  { section: 'courses', label: 'My Courses', icon: 'book' },
  { section: 'certificates', label: 'Certificates', icon: 'award' },
  { section: 'payments', label: 'Payments', icon: 'card' },
  { section: 'profile', label: 'Profile', icon: 'user' },
  { section: 'support', label: 'Support', icon: 'help' },
]

export function StudentPortal({ data }: { data: PortalData }) {
  const router = useRouter()
  const [section, setSection] = useState<Section>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<PortalCertificate | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profile, setProfile] = useState(data.student)
  const [profileMessage, setProfileMessage] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const dialogClose = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (selectedCertificate) dialogClose.current?.focus()
  }, [selectedCertificate])
  useEffect(() => {
    if (!drawerOpen && !selectedCertificate) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
        setSelectedCertificate(null)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [drawerOpen, selectedCertificate])

  function navigate(next: Section) {
    setSection(next)
    setDrawerOpen(false)
    setNotificationsOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSavingProfile(true)
    setProfileMessage('')
    try {
      const response = await fetch(`/api/users/${profile.id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile.name.trim(),
          phone: profile.phone.trim(),
          country: profile.country.trim(),
          jobTitle: profile.jobTitle.trim(),
        }),
      })
      if (!response.ok) throw new Error('We could not save your details. Please try again.')
      setEditingProfile(false)
      setProfileMessage('Your profile has been updated.')
      router.refresh()
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'We could not save your details.')
    } finally {
      setSavingProfile(false)
    }
  }

  const firstName = profile.name.split(/\s+/)[0] || 'there'
  const roleLabel =
    profile.role === 'admin'
      ? 'Administrator'
      : profile.role === 'instructor'
        ? 'Instructor'
        : 'Student'
  const activeCourses = data.courses.filter((course) => course.status === 'active')
  const completedCourses = data.courses.filter((course) => course.status === 'completed')
  const currentCourses = activeCourses.length
    ? activeCourses.slice(0, 3)
    : data.courses.filter((course) => course.status !== 'cancelled').slice(0, 3)
  const upcoming = data.courses
    .filter(
      (course) =>
        course.upcomingDate &&
        Date.parse(course.upcomingDate) >= Date.parse(data.asOf) &&
        course.status !== 'cancelled',
    )
    .sort((a, b) => Date.parse(a.upcomingDate!) - Date.parse(b.upcomingDate!))
    .slice(0, 3)
  const pending = data.courses.filter((course) => course.status === 'pending')
  const notices = [
    ...pending.map((course) => ({
      id: `pending-${course.id}`,
      title: 'Registration pending',
      detail: course.title,
    })),
    ...upcoming.map((course) => ({
      id: `upcoming-${course.id}`,
      title: 'Upcoming training',
      detail: `${course.title} · ${date(course.upcomingDate!)}`,
    })),
  ]
  const overallProgress = data.courses.filter(
    (course) => course.status === 'active' || course.status === 'completed',
  )
  const averageProgress = overallProgress.length
    ? Math.round(
        overallProgress.reduce((total, course) => total + course.progress, 0) /
          overallProgress.length,
      )
    : 0
  const progressByCategory = Object.entries(
    overallProgress.reduce<Record<string, { total: number; count: number }>>((acc, course) => {
      const item = acc[course.category] || { total: 0, count: 0 }
      item.total += course.progress
      item.count += 1
      acc[course.category] = item
      return acc
    }, {}),
  ).map(([label, value]) => ({ label, progress: Math.round(value.total / value.count) }))

  const sidebar = (
    <>
      <div className="sp-sidebar__brand">
        <Link href="/" aria-label="Kenvision Techniks home">
          <strong>KENVISION</strong>
          <span>TECHNIKS</span>
        </Link>
        <small>Training Portal</small>
      </div>
      <nav className="sp-sidebar__nav" aria-label="Student portal">
        <span className="sp-nav-caption">YOUR WORKSPACE</span>
        {navigation.slice(0, 2).map((item) => (
          <button
            key={item.section}
            type="button"
            className={`sp-nav-item${section === item.section ? ' is-active' : ''}`}
            onClick={() => navigate(item.section)}
            aria-current={section === item.section ? 'page' : undefined}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
        <Link className="sp-nav-item" href="/training" onClick={() => setDrawerOpen(false)}>
          <Icon name="library" />
          Browse Training
        </Link>
        <span className="sp-nav-caption sp-nav-caption--second">ACCOUNT</span>
        {navigation.slice(2).map((item) => (
          <button
            key={item.section}
            type="button"
            className={`sp-nav-item${section === item.section ? ' is-active' : ''}`}
            onClick={() => navigate(item.section)}
            aria-current={section === item.section ? 'page' : undefined}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sp-sidebar__bottom">
        <div className="sp-help">
          <strong>Need help?</strong>
          <span>Training support is here for you.</span>
          <a href="tel:+254725579251">+254 725 579 251</a>
        </div>
        <form action="/api/users/logout" method="post">
          <button className="sp-nav-item sp-logout" type="submit">
            <Icon name="logout" />
            Sign out
          </button>
        </form>
      </div>
    </>
  )

  return (
    <div className="sp-shell">
      <aside className="sp-sidebar">{sidebar}</aside>
      {drawerOpen && (
        <div className="sp-drawer">
          <button
            type="button"
            className="sp-drawer__shade"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="sp-drawer__panel">
            <button
              className="sp-drawer__close"
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <Icon name="close" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="sp-workspace">
        <header className="sp-topbar">
          <button
            className="sp-icon-button sp-menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="sp-topbar__title">
            <span className="sp-mobile-wordmark">
              KENVISION <em>TECHNIKS</em>
            </span>
            <span className="sp-desktop-title">
              {navigation.find((item) => item.section === section)?.label}
            </span>
          </div>
          <div className="sp-topbar__actions">
            <div className="sp-notification-wrap">
              <button
                className="sp-icon-button"
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Icon name="bell" />
                {notices.length > 0 && <span className="sp-notification-dot" />}
              </button>
              {notificationsOpen && (
                <div className="sp-notifications">
                  <div className="sp-notifications__title">
                    <strong>Notifications</strong>
                    <button
                      type="button"
                      aria-label="Close notifications"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                  {notices.length ? (
                    notices.map((notice) => (
                      <div className="sp-notice" key={notice.id}>
                        <strong>{notice.title}</strong>
                        <span>{notice.detail}</span>
                      </div>
                    ))
                  ) : (
                    <p className="sp-notifications__empty">
                      You’re all caught up. Training updates will appear here.
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              className="sp-icon-button sp-topbar__help"
              type="button"
              aria-label="Support"
              onClick={() => navigate('support')}
            >
              <Icon name="help" />
            </button>
            <span className="sp-topbar__divider" />
            <button
              className="sp-profile-chip"
              type="button"
              onClick={() => navigate('profile')}
              aria-label={`View profile for ${profile.name}`}
            >
              <span className="sp-avatar">{initials(profile.name)}</span>
              <span className="sp-profile-chip__name">
                <strong>{profile.name}</strong>
                <small>{roleLabel}</small>
              </span>
              <Icon name="chevron" size={14} />
            </button>
          </div>
        </header>
        {data.demo && (
          <div className="sp-demo-banner">
            <strong>Demo preview</strong>
            <span>
              Sample student data from the Figma design. Your live dashboard uses your Payload
              account.
            </span>
            <Link href="/dashboard">
              View live account <Icon name="arrow" size={14} />
            </Link>
          </div>
        )}
        <main className="sp-main" id="portal-main">
          {section === 'overview' && (
            <div className="sp-page">
              <div className="sp-intro">
                <div>
                  <span className="sp-page-label">STUDENT DASHBOARD</span>
                  <h1>Welcome back, {firstName}.</h1>
                  <p>Continue your professional development and manage your Kenvision training.</p>
                </div>
                <Link href="/training" className="sp-link sp-intro__link">
                  Explore training <Icon name="arrow" size={16} />
                </Link>
              </div>
              <div className="sp-stats">
                <div className="sp-stat">
                  <span className="sp-stat__icon">
                    <Icon name="book" />
                  </span>
                  <strong>{activeCourses.length}</strong>
                  <span>Active courses</span>
                  <small>In progress</small>
                </div>
                <div className="sp-stat">
                  <span className="sp-stat__icon">
                    <Icon name="check" />
                  </span>
                  <strong>{completedCourses.length}</strong>
                  <span>Completed</span>
                  <small>Courses completed</small>
                </div>
                <div className="sp-stat">
                  <span className="sp-stat__icon sp-stat__icon--copper">
                    <Icon name="award" />
                  </span>
                  <strong>{data.certificates.length}</strong>
                  <span>Certificates</span>
                  <small>Issued to you</small>
                </div>
                <div className="sp-stat">
                  <span className="sp-stat__icon">
                    <Icon name="layers" />
                  </span>
                  <strong>
                    {data.demo && data.learningHours != null
                      ? `${data.learningHours} hrs`
                      : data.completedLessons}
                  </strong>
                  <span>
                    {data.demo && data.learningHours != null
                      ? 'Learning hours'
                      : 'Lessons completed'}
                  </span>
                  <small>
                    {data.demo && data.learningHours != null ? 'Completed' : 'Across your courses'}
                  </small>
                </div>
              </div>
              <section className="sp-section">
                <SectionHeading
                  title="Continue Learning"
                  detail="Pick up where you left off."
                  action={
                    <button type="button" className="sp-link" onClick={() => navigate('courses')}>
                      View all courses <Icon name="arrow" size={16} />
                    </button>
                  }
                />
                {currentCourses.length ? (
                  <div className="sp-course-grid">
                    {currentCourses.map((course) => (
                      <CourseTile course={course} demo={data.demo} key={course.id} />
                    ))}
                  </div>
                ) : (
                  <div className="sp-empty sp-empty--wide">
                    <span className="sp-empty__icon">
                      <Icon name="book" size={26} />
                    </span>
                    <h3>Your learning starts here</h3>
                    <p>
                      Explore the training catalogue and register for a programme. Your courses will
                      appear here once you enrol.
                    </p>
                    <Link href="/training" className="sp-button sp-button--primary">
                      Browse training <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                )}
              </section>
              <section className="sp-section">
                <SectionHeading title="Quick Actions" />
                <div className="sp-actions">
                  <Link href="/training">
                    <Icon name="library" />
                    <span>Browse training</span>
                    <Icon name="arrow" size={15} />
                  </Link>
                  <button type="button" onClick={() => navigate('courses')}>
                    <Icon name="book" />
                    <span>My courses</span>
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" onClick={() => navigate('certificates')}>
                    <Icon name="award" />
                    <span>Certificates</span>
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" onClick={() => navigate('payments')}>
                    <Icon name="card" />
                    <span>Payments</span>
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" onClick={() => navigate('profile')}>
                    <Icon name="user" />
                    <span>My profile</span>
                    <Icon name="arrow" size={15} />
                  </button>
                  <button type="button" onClick={() => navigate('support')}>
                    <Icon name="help" />
                    <span>Get support</span>
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              </section>
              <div className="sp-split">
                <section className="sp-section">
                  <SectionHeading title="Upcoming Training" detail="Your scheduled programmes." />
                  <div className="sp-stack">
                    {upcoming.length ? (
                      upcoming.map((course) => (
                        <article className="sp-upcoming" key={course.id}>
                          <div>
                            <span className="sp-kicker">
                              {course.deliveryMode || 'Training programme'}
                            </span>
                            <h3>{course.title}</h3>
                            <p>
                              <Icon name="calendar" size={15} />
                              {date(course.upcomingDate!)}
                            </p>
                          </div>
                          <Link href={`/training/${course.slug}`} className="sp-link">
                            View details <Icon name="arrow" size={15} />
                          </Link>
                        </article>
                      ))
                    ) : (
                      <div className="sp-empty sp-empty--compact">
                        <Icon name="calendar" size={22} />
                        <h3>No dates scheduled yet</h3>
                        <p>When an enrolled programme has a training date, you’ll see it here.</p>
                      </div>
                    )}
                  </div>
                </section>
                <section className="sp-section">
                  <SectionHeading title="Recent Activity" />
                  <div className="sp-activity">
                    {data.activity.length ? (
                      data.activity.map((item) => (
                        <div className="sp-activity__item" key={item.id}>
                          <span className="sp-activity__icon">
                            <Icon
                              name={
                                item.kind === 'Certificate issued'
                                  ? 'award'
                                  : item.kind === 'Completed lesson'
                                    ? 'check'
                                    : item.kind === 'Enrolled in training'
                                      ? 'calendar'
                                      : 'play'
                              }
                              size={16}
                            />
                          </span>
                          <div>
                            <small>{date(item.date)}</small>
                            <strong>{item.kind}</strong>
                            <span>{item.title}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="sp-empty sp-empty--compact">
                        <Icon name="clock" size={22} />
                        <h3>No activity yet</h3>
                        <p>Your course and certificate updates will appear here.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              <section className="sp-section">
                <SectionHeading
                  title="Explore More Training"
                  detail="Continue building practical skills with Kenvision Techniks."
                  action={
                    <Link href="/training" className="sp-link">
                      Full catalogue <Icon name="arrow" size={16} />
                    </Link>
                  }
                />
                <div className="sp-recommendations">
                  {data.recommendations.map((course) => (
                    <Link
                      className="sp-recommendation"
                      href={`/training/${course.slug}`}
                      key={course.slug}
                    >
                      <img src={artwork(course)} alt="" loading="lazy" />
                      <div>
                        <span className="sp-kicker">{course.category}</span>
                        <h3>{course.title}</h3>
                        <span className="sp-recommendation__foot">
                          <strong>{money(course.price)}</strong>
                          <Icon name="arrow" size={16} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              <div className="sp-split sp-split--last">
                <section className="sp-section">
                  <SectionHeading
                    title="My Certificates"
                    action={
                      <button
                        type="button"
                        className="sp-link"
                        onClick={() => navigate('certificates')}
                      >
                        View all <Icon name="arrow" size={16} />
                      </button>
                    }
                  />
                  <div className="sp-stack">
                    {data.certificates.length ? (
                      data.certificates.slice(0, 3).map((certificate) => (
                        <button
                          className="sp-certificate-row"
                          type="button"
                          onClick={() => setSelectedCertificate(certificate)}
                          key={certificate.id}
                        >
                          <span className="sp-certificate-row__icon">
                            <Icon name="award" />
                          </span>
                          <span>
                            <strong>{certificate.title}</strong>
                            <small>Issued {date(certificate.issuedAt)}</small>
                          </span>
                          <Icon name="arrow" size={16} />
                        </button>
                      ))
                    ) : (
                      <div className="sp-empty sp-empty--compact">
                        <Icon name="award" size={22} />
                        <h3>No certificates issued</h3>
                        <p>Completed training certificates will appear here.</p>
                      </div>
                    )}
                  </div>
                </section>
                <section className="sp-section">
                  <SectionHeading title="My Learning Progress" />
                  <div className="sp-progress-panel">
                    <div className="sp-progress-panel__overall">
                      <span>
                        <strong>Overall progress</strong>
                        <small>Across active and completed courses</small>
                      </span>
                      <b>{averageProgress}%</b>
                    </div>
                    <ProgressBar value={averageProgress} />
                    {progressByCategory.length ? (
                      <div className="sp-progress-panel__categories">
                        {progressByCategory.map((item) => (
                          <div key={item.label}>
                            <div>
                              <span>{item.label}</span>
                              <strong>{item.progress}%</strong>
                            </div>
                            <ProgressBar value={item.progress} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="sp-progress-panel__hint">
                        Your progress will appear when you begin a course.
                      </p>
                    )}
                  </div>
                </section>
              </div>
              {data.payments?.length ? (
                <section className="sp-section">
                  <SectionHeading
                    title="Recent Payments"
                    detail="Sample payment records from the design brief."
                    action={
                      <button
                        type="button"
                        className="sp-link"
                        onClick={() => navigate('payments')}
                      >
                        View history <Icon name="arrow" size={16} />
                      </button>
                    }
                  />
                  <PaymentsTable payments={data.payments} />
                </section>
              ) : null}
            </div>
          )}
          {section === 'courses' && (
            <div className="sp-page">
              <PageIntro
                label="YOUR LEARNING"
                title="My Courses"
                detail="All your enrolled programmes in one place."
              />
              <div className="sp-course-grid">
                {data.courses
                  .filter((course) => course.status !== 'cancelled')
                  .map((course) => (
                    <CourseTile course={course} demo={data.demo} key={course.id} />
                  ))}
              </div>
              {!data.courses.length && (
                <div className="sp-empty sp-empty--wide">
                  <span className="sp-empty__icon">
                    <Icon name="book" size={26} />
                  </span>
                  <h3>No courses yet</h3>
                  <p>Find a programme that fits your goals and register to begin.</p>
                  <Link href="/training" className="sp-button sp-button--primary">
                    Browse training <Icon name="arrow" size={16} />
                  </Link>
                </div>
              )}
            </div>
          )}
          {section === 'certificates' && (
            <div className="sp-page">
              <PageIntro
                label="YOUR ACHIEVEMENTS"
                title="Certificates"
                detail="A record of the training you’ve completed."
              />
              {data.certificates.length ? (
                <div className="sp-certificate-grid">
                  {data.certificates.map((certificate) => (
                    <article className="sp-certificate-card" key={certificate.id}>
                      <span className="sp-certificate-card__seal">
                        <Icon name="award" size={30} />
                      </span>
                      <span className="sp-kicker">CERTIFICATE OF COMPLETION</span>
                      <h2>{certificate.title}</h2>
                      <p>Issued {date(certificate.issuedAt)}</p>
                      <span className="sp-certificate-card__number">{certificate.number}</span>
                      <button
                        className="sp-button sp-button--outline"
                        type="button"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        View certificate <Icon name="arrow" size={16} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="sp-empty sp-empty--wide">
                  <span className="sp-empty__icon">
                    <Icon name="award" size={26} />
                  </span>
                  <h3>Your achievements will appear here</h3>
                  <p>
                    Certificates issued after course completion will be available in this space.
                  </p>
                  <button
                    type="button"
                    className="sp-button sp-button--primary"
                    onClick={() => navigate('courses')}
                  >
                    View my courses <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
          {section === 'payments' && (
            <div className="sp-page">
              <PageIntro
                label="ACCOUNT"
                title="Payments"
                detail="Keep track of training payments and receipts."
              />
              {data.payments?.length ? (
                <PaymentsTable payments={data.payments} />
              ) : (
                <div className="sp-empty sp-empty--wide">
                  <span className="sp-empty__icon">
                    <Icon name="card" size={26} />
                  </span>
                  <h3>Payment history isn’t available yet</h3>
                  <p>
                    The portal does not have a payment ledger or receipts connected. For a payment
                    question, contact the training team directly.
                  </p>
                  <button
                    type="button"
                    className="sp-button sp-button--primary"
                    onClick={() => navigate('support')}
                  >
                    Contact support <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
          {section === 'profile' && (
            <div className="sp-page">
              <PageIntro
                label="YOUR ACCOUNT"
                title="My Profile"
                detail="Your details for training and communication."
              />
              <div className="sp-profile-panel">
                <div className="sp-profile-panel__header">
                  <span className="sp-avatar sp-avatar--large">{initials(profile.name)}</span>
                  <div>
                    <h2>{profile.name}</h2>
                    <p>{roleLabel} account</p>
                  </div>
                  {!data.demo && !editingProfile && (
                    <button
                      type="button"
                      className="sp-button sp-button--outline"
                      onClick={() => {
                        setEditingProfile(true)
                        setProfileMessage('')
                      }}
                    >
                      <Icon name="edit" size={16} />
                      Edit profile
                    </button>
                  )}
                </div>
                {editingProfile ? (
                  <form className="sp-profile-form" onSubmit={saveProfile}>
                    <label>
                      Full name
                      <input
                        required
                        value={profile.name}
                        onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                      />
                    </label>
                    <label>
                      Email
                      <input value={profile.email} disabled />
                    </label>
                    <label>
                      Phone
                      <input
                        value={profile.phone}
                        onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                      />
                    </label>
                    <label>
                      Country
                      <input
                        value={profile.country}
                        onChange={(event) =>
                          setProfile({ ...profile, country: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Job title
                      <input
                        value={profile.jobTitle}
                        onChange={(event) =>
                          setProfile({ ...profile, jobTitle: event.target.value })
                        }
                      />
                    </label>
                    <div className="sp-profile-form__actions">
                      <button
                        className="sp-button sp-button--primary"
                        type="submit"
                        disabled={savingProfile}
                      >
                        {savingProfile ? 'Saving…' : 'Save changes'}
                      </button>
                      <button
                        className="sp-button sp-button--outline"
                        type="button"
                        onClick={() => {
                          setEditingProfile(false)
                          setProfile(data.student)
                          setProfileMessage('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <dl className="sp-profile-details">
                    <div>
                      <dt>Email</dt>
                      <dd>{profile.email}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{profile.phone || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt>Country</dt>
                      <dd>{profile.country || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt>Job title</dt>
                      <dd>{profile.jobTitle || 'Not provided'}</dd>
                    </div>
                  </dl>
                )}
                {profileMessage && (
                  <p className="sp-profile-message" role="status">
                    {profileMessage}
                  </p>
                )}
              </div>
            </div>
          )}
          {section === 'support' && (
            <div className="sp-page">
              <PageIntro
                label="TRAINING SUPPORT"
                title="How can we help?"
                detail="Questions about a course, enrolment, or certificate? Reach the Kenvision training team."
              />
              <div className="sp-support-grid">
                <a href="tel:+254725579251" className="sp-support-card">
                  <span>
                    <Icon name="help" size={22} />
                  </span>
                  <h2>Call training support</h2>
                  <p>Speak with the team about your training.</p>
                  <strong>
                    +254 725 579 251 <Icon name="arrow" size={16} />
                  </strong>
                </a>
                <Link href="/contact" className="sp-support-card">
                  <span>
                    <Icon name="edit" size={22} />
                  </span>
                  <h2>Send a message</h2>
                  <p>Use our contact form and we’ll get back to you.</p>
                  <strong>
                    Contact Kenvision <Icon name="arrow" size={16} />
                  </strong>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
      <nav className="sp-bottom-nav" aria-label="Quick navigation">
        {navigation
          .filter((item) =>
            ['overview', 'courses', 'certificates', 'profile'].includes(item.section),
          )
          .map((item) => (
            <button
              type="button"
              key={item.section}
              className={section === item.section ? 'is-active' : ''}
              aria-current={section === item.section ? 'page' : undefined}
              onClick={() => navigate(item.section)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.section === 'overview' ? 'Home' : item.label.replace('My ', '')}</span>
            </button>
          ))}
      </nav>
      {selectedCertificate && (
        <div
          className="sp-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCertificate(null)
          }}
        >
          <div
            className="sp-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sp-certificate-title"
          >
            <button
              ref={dialogClose}
              type="button"
              className="sp-modal__close"
              aria-label="Close certificate"
              onClick={() => setSelectedCertificate(null)}
            >
              <Icon name="close" />
            </button>
            <span className="sp-certificate-card__seal">
              <Icon name="award" size={34} />
            </span>
            <span className="sp-kicker">KENVISION TECHNIKS · CERTIFICATE</span>
            <h2 id="sp-certificate-title">{selectedCertificate.title}</h2>
            <dl>
              <div>
                <dt>Certificate number</dt>
                <dd>{selectedCertificate.number}</dd>
              </div>
              <div>
                <dt>Issued to</dt>
                <dd>{profile.name}</dd>
              </div>
              <div>
                <dt>Issue date</dt>
                <dd>{date(selectedCertificate.issuedAt)}</dd>
              </div>
            </dl>
            {selectedCertificate.fileUrl ? (
              <a
                className="sp-button sp-button--primary"
                href={selectedCertificate.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="download" size={16} />
                Open certificate file
              </a>
            ) : (
              <p className="sp-modal__hint">
                The certificate record is available. A downloadable file has not been attached yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function PageIntro({ label, title, detail }: { label: string; title: string; detail: string }) {
  return (
    <div className="sp-intro sp-intro--subpage">
      <div>
        <span className="sp-page-label">{label}</span>
        <h1>{title}</h1>
        <p>{detail}</p>
      </div>
    </div>
  )
}
