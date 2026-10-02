import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LessonCompleteButton } from '@/components/LessonCompleteButton'
import { DemoLessonButton } from '@/components/DemoLessonButton'
import { RichTextView } from '@/components/RichTextView'
import { getCourse, getCourses } from '@/lib/cms'
import { studentPortalDemo } from '@/data/studentPortalDemo'
import { isLmsEnabled } from '@/lib/features'
import type { CourseModule, Lesson, Media } from '@/payload-types'
import './learning.css'

export const metadata: Metadata = {
  title: 'Learning room',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lesson?: string; demo?: string }>
}
type RoomLesson = {
  id: string
  title: string
  moduleId: string
  moduleTitle: string
  content: Lesson['content']
  videoUrl: string | null
  resourceUrl: string | null
  resourceName: string | null
  completed: boolean
}
type RoomModule = { id: string; title: string; lessons: RoomLesson[] }
type RoomProps = {
  slug: string
  title: string
  summary: string
  image: string | null
  modules: RoomModule[]
  selected: RoomLesson | null
  progress: number
  enrollmentId: number | null
  progressId: number | null
  demo: boolean
}

function videoEmbed(value: string) {
  try {
    const url = new URL(value)
    if (url.hostname === 'youtu.be')
      return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      const id = url.searchParams.get('v')
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (['vimeo.com', 'www.vimeo.com'].includes(url.hostname)) {
      const id = url.pathname.split('/').filter(Boolean).at(-1)
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    /* unsupported video URL */
  }
  return null
}

function safeExternalUrl(value: string | null | undefined) {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null } catch { return null }
}

const demoModuleTitles: Record<string, string[]> = {
  'cctv-operator-control-room': [
    'Introduction',
    'CCTV Components',
    'Camera Systems',
    'Control Room Operations',
    'Monitoring & Incident Management',
    'Assessment',
  ],
  'fibre-optic-installation': [
    'Introduction to Fibre Optics',
    'Types of Fibre Cable',
    'Tools & Equipment',
    'Splicing & Termination',
    'Testing & Fault Finding',
    'Assessment',
  ],
}
const defaultDemoModules = [
  'Introduction',
  'Core Concepts',
  'Practical Application',
  'Advanced Techniques',
  'Case Studies',
  'Assessment',
]
const demoImages: Record<string, string> = {
  'cctv-operator-control-room':
    'https://images.unsplash.com/photo-1589935447067-5531094415d1?auto=format&fit=crop&w=1200&q=85',
  'fibre-optic-installation':
    'https://images.unsplash.com/photo-1594915440248-1e419eba6611?auto=format&fit=crop&w=1200&q=85',
}

export default async function LearnPage({ params, searchParams }: Props) {
  if (!isLmsEnabled) notFound()
  const { slug } = await params
  const query = await searchParams
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: await headers() })
  if (!auth.user) redirect(`/login?next=${encodeURIComponent(`/learn/${slug}`)}`)

  const demo =
    process.env.NODE_ENV === 'development' && auth.user.role === 'admin' && query.demo === '1'
  if (demo) {
    const course = await getCourse(slug)
    if (!course) notFound()
    const sample = studentPortalDemo(await getCourses())
    const enrolled = sample.courses.find((item) => item.slug === slug)
    const titles = demoModuleTitles[slug] || defaultDemoModules
    const completedCount = Math.floor(((enrolled?.progress || 0) / 100) * titles.length)
    const modules: RoomModule[] = titles.map((title, index) => {
      const id = `demo-${index}`
      const lesson: RoomLesson = {
        id,
        title,
        moduleId: id,
        moduleTitle: title,
        content: null,
        videoUrl: null,
        resourceUrl: null,
        resourceName: null,
        completed: index < completedCount,
      }
      return { id, title, lessons: [lesson] }
    })
    const lessons = modules.flatMap((module) => module.lessons)
    const defaultIndex =
      slug === 'cctv-operator-control-room' ? 4 : slug === 'fibre-optic-installation' ? 2 : 0
    const selected = lessons.find((lesson) => lesson.id === query.lesson) || lessons[defaultIndex]
    return (
      <LearningRoom
        slug={slug}
        title={course.title}
        summary={course.summary || 'Practical professional training from Kenvision Techniks.'}
        image={
          demoImages[slug] ||
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=85'
        }
        modules={modules}
        selected={selected}
        progress={enrolled?.progress || 0}
        enrollmentId={null}
        progressId={null}
        demo
      />
    )
  }

  const courses = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    user: auth.user,
    overrideAccess: false,
  })
  const course = courses.docs[0]
  if (!course) notFound()
  const found = await payload.find({
    collection: 'enrollments',
    where: {
      and: [
        { student: { equals: auth.user.id } },
        { course: { equals: course.id } },
        { status: { equals: 'active' } },
      ],
    },
    depth: 0,
    limit: 1,
    user: auth.user,
    overrideAccess: false,
  })
  const enrollment = found.docs[0]
  if (!enrollment) redirect('/dashboard')
  const modulesResult = await payload.find({
    collection: 'course-modules',
    where: { course: { equals: course.id } },
    depth: 1,
    sort: 'sortOrder',
    limit: 100,
    user: auth.user,
    overrideAccess: false,
  })
  const moduleIds = modulesResult.docs.map((module) => module.id)
  const [lessonsResult, progressResult] = await Promise.all([
    moduleIds.length
      ? payload.find({
          collection: 'lessons',
          where: { module: { in: moduleIds } },
          depth: 1,
          sort: 'sortOrder',
          limit: 500,
          user: auth.user,
          overrideAccess: false,
        })
      : Promise.resolve({ docs: [] as Lesson[] }),
    payload.find({
      collection: 'lesson-progress',
      where: { enrollment: { equals: enrollment.id } },
      depth: 0,
      limit: 500,
      user: auth.user,
      overrideAccess: false,
    }),
  ])
  const progressByLesson = new Map(
    progressResult.docs.map((item) => [
      String(typeof item.lesson === 'object' ? item.lesson.id : item.lesson),
      item,
    ]),
  )
  const modules: RoomModule[] = modulesResult.docs.map((module: CourseModule) => {
    const lessons: RoomLesson[] = lessonsResult.docs
      .filter(
        (lesson) =>
          String(typeof lesson.module === 'object' ? lesson.module.id : lesson.module) ===
          String(module.id),
      )
      .map((lesson) => {
        const saved = progressByLesson.get(String(lesson.id))
        const media =
          lesson.resource && typeof lesson.resource === 'object' ? (lesson.resource as Media) : null
        return {
          id: String(lesson.id),
          title: lesson.title,
          moduleId: String(module.id),
          moduleTitle: module.title,
          content: lesson.content,
          videoUrl: lesson.videoUrl || null,
          resourceUrl: media?.url || null,
          resourceName: media?.filename || null,
          completed: Boolean(saved?.completed),
        }
      })
    return { id: String(module.id), title: module.title, lessons }
  })
  const allLessons = modules.flatMap((module) => module.lessons)
  const selected = allLessons.find((lesson) => lesson.id === query.lesson) || allLessons[0] || null
  const selectedProgress = selected ? progressByLesson.get(selected.id) : null
  const image =
    course.coverImage && typeof course.coverImage === 'object'
      ? course.coverImage.sizes?.wide?.url || course.coverImage.url || null
      : null
  return (
    <LearningRoom
      slug={slug}
      title={course.title}
      summary={course.summary}
      image={image}
      modules={modules}
      selected={selected}
      progress={Number(enrollment.progressPercent || 0)}
      enrollmentId={enrollment.id}
      progressId={selectedProgress?.id || null}
      demo={false}
    />
  )
}

function LearningRoom({
  slug,
  title,
  summary,
  image,
  modules,
  selected,
  progress,
  enrollmentId,
  progressId,
  demo,
}: RoomProps) {
  const allLessons = modules.flatMap((module) => module.lessons)
  const selectedIndex = selected ? allLessons.findIndex((lesson) => lesson.id === selected.id) : -1
  const completedCount = allLessons.filter((lesson) => lesson.completed).length
  const dashboardHref = demo ? '/dashboard?demo=1' : '/dashboard'
  const lessonHref = (lesson: RoomLesson) =>
    `/learn/${slug}?${demo ? 'demo=1&' : ''}lesson=${encodeURIComponent(lesson.id)}`
  const embed = selected?.videoUrl ? videoEmbed(selected.videoUrl) : null
  const externalVideo = !embed ? safeExternalUrl(selected?.videoUrl) : null
  const visual = image || demoImages[slug] || null
  return (
    <div className={`lr-shell${demo ? ' lr-shell--demo' : ''}`}>
      <header className="lr-topbar">
        <Link href={dashboardHref} className="lr-back">
          ← <span>Dashboard</span>
        </Link>
        <span className="lr-topbar__title">{title}</span>
        <div className="lr-topbar__progress">
          <span>Progress</span>
          <strong>{progress}%</strong>
          <div className="lr-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>
      {demo && (
        <div className="lr-demo">
          <strong>Demo lesson</strong>
          <span>Sample learning content from the Figma design; progress here is not saved.</span>
        </div>
      )}
      <div className="lr-layout">
        <aside className="lr-sidebar">
          <div className="lr-sidebar__head">
            <span>COURSE MODULES</span>
            <small>
              {completedCount} of {allLessons.length} lessons completed
            </small>
          </div>
          <div className="lr-sidebar__list">
            {modules.map((module, moduleIndex) => (
              <div className="lr-module" key={module.id}>
                {!demo && <strong>{String(moduleIndex + 1).padStart(2, '0')} &nbsp; {module.title}</strong>}
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={lessonHref(lesson)}
                    className={`lr-lesson-link${selected?.id === lesson.id ? ' is-active' : ''}`}
                    aria-current={selected?.id === lesson.id ? 'page' : undefined}
                  >
                    <span className={`lr-lesson-link__marker${lesson.completed ? ' is-done' : ''}`}>
                      {lesson.completed ? '✓' : demo ? String(moduleIndex + 1).padStart(2, '0') : '•'}
                    </span>
                    <span>{lesson.title}</span>
                  </Link>
                ))}
              </div>
            ))}
            {!modules.length && (
              <p className="lr-sidebar__empty">Your training team will add modules soon.</p>
            )}
          </div>
        </aside>
        <main className="lr-main">
          <div className="lr-main__inner">
            <details className="lr-mobile-modules">
              <summary>
                Course modules <span>{allLessons.length} lessons</span>
              </summary>
              <nav>
                {modules.map((module) => (
                  <div key={module.id}>
                    <strong>{module.title}</strong>
                    {module.lessons.map((lesson) => (
                      <Link
                        href={lessonHref(lesson)}
                        className={selected?.id === lesson.id ? 'is-active' : ''}
                        key={lesson.id}
                      >
                        {lesson.title}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </details>
            {selected ? (
              <>
                <div className="lr-heading">
                  <span>{selected.moduleTitle}</span>
                  <h1>{selected.title}</h1>
                  <p>{summary}</p>
                </div>
                {embed ? (
                  <div className="lr-media">
                    <iframe
                      src={embed}
                      title={selected.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ) : visual ? (
                  <figure className="lr-visual">
                    <img src={visual} alt="" />
                    <figcaption>{demo ? 'Training preview' : 'Course overview'}</figcaption>
                  </figure>
                ) : null}
                {externalVideo && (
                  <p className="lr-resource">
                    <a href={externalVideo} target="_blank" rel="noreferrer">
                      Open lesson video ↗
                    </a>
                  </p>
                )}
                <article className="lr-content">
                  <h2>{selected.title}</h2>
                  {demo ? (
                    <>
                      <p>
                        This preview shows the learning space for {title}. Each module will hold
                        lessons, resources and practical activities prepared by the Kenvision
                        Techniks training team.
                      </p>
                      <p>
                        Use the module list to explore the course layout. Progress in this demo is
                        illustrative and is not saved to your account.
                      </p>
                    </>
                  ) : selected.content ? (
                    <RichTextView value={selected.content} />
                  ) : (
                    <p>
                      Your instructor will add the lesson content here. Check back soon for updated
                      material.
                    </p>
                  )}
                  {selected.resourceUrl && (
                    <p className="lr-resource">
                      <a href={selected.resourceUrl} target="_blank" rel="noreferrer">
                        Download lesson resource
                        {selected.resourceName ? `: ${selected.resourceName}` : ''} ↗
                      </a>
                    </p>
                  )}
                </article>
                <div className="lr-lesson-actions">
                  <div>
                    <span>LESSON PROGRESS</span>
                    <strong>{progress}% complete</strong>
                  </div>
                  <div className="lr-progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <div className="lr-lesson-actions__buttons">
                    {selectedIndex > 0 ? (
                      <Link
                        className="lr-secondary-button"
                        href={lessonHref(allLessons[selectedIndex - 1])}
                      >
                        ← Previous
                      </Link>
                    ) : (
                      <span />
                    )}
                    {demo ? (
                      <DemoLessonButton />
                    ) : enrollmentId ? (
                      <LessonCompleteButton
                        lessonId={selected.id}
                        enrollmentId={enrollmentId}
                        progressId={progressId || undefined}
                        completed={selected.completed}
                      />
                    ) : null}
                    {selectedIndex < allLessons.length - 1 && (
                      <Link
                        className="lr-secondary-button"
                        href={lessonHref(allLessons[selectedIndex + 1])}
                      >
                        Next lesson →
                      </Link>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="lr-empty">
                <h1>Learning materials are being prepared</h1>
                <p>
                  Your training team will publish modules and lessons here. Check back soon or
                  contact us for help.
                </p>
                <Link href="/contact">Contact support →</Link>
              </div>
            )}
          </div>
        </main>
        <aside className="lr-progress-aside">
          <span>COURSE PROGRESS</span>
          <strong>{progress}%</strong>
          <small>
            {completedCount} of {allLessons.length} lessons completed
          </small>
          <div className="lr-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="lr-progress-aside__modules">
            <span>MODULE STATUS</span>
            {modules.map((module, index) => (
              <div key={module.id}>
                <i
                  className={
                    module.lessons.length && module.lessons.every((lesson) => lesson.completed)
                      ? 'is-done'
                      : ''
                  }
                />
                <span>
                  {String(index + 1).padStart(2, '0')} {module.title}
                </span>
              </div>
            ))}
          </div>
          <Link href={dashboardHref} className="lr-secondary-button">
            ← Back to dashboard
          </Link>
        </aside>
      </div>
    </div>
  )
}
