import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, type CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CourseCategories } from './collections/CourseCategories'
import { Courses } from './collections/Courses'
import { Pages } from './collections/Pages'
import { Solutions } from './collections/Solutions'
import { Insights } from './collections/Insights'
import { Organizations } from './collections/Organizations'
import { CourseModules } from './collections/CourseModules'
import { Lessons } from './collections/Lessons'
import { Enrollments } from './collections/Enrollments'
import { LessonProgress } from './collections/LessonProgress'
import { Quizzes } from './collections/Quizzes'
import { QuizAttempts } from './collections/QuizAttempts'
import { Certificates } from './collections/Certificates'
import { ContactInquiries } from './collections/ContactInquiries'
import { SiteSettings } from './globals/SiteSettings'
import { isLmsEnabled } from './lib/features'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const websiteCourses: CollectionConfig = isLmsEnabled
  ? Courses
  : {
      ...Courses,
      fields: Courses.fields.filter((field) => !('name' in field && field.name === 'modules')),
    }

function lmsCollection(collection: CollectionConfig): CollectionConfig {
  if (isLmsEnabled) return collection
  const deny = () => false
  return {
    ...collection,
    admin: { ...collection.admin, hidden: true },
    access: { ...collection.access, create: deny, read: deny, update: deny, delete: deny },
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      views: {
        dashboard: {
          Component: '/components/admin/KenvisionDashboard#KenvisionDashboard',
        },
      },
    },
    meta: {
      titleSuffix: ' — Kenvision CMS',
      description: 'Manage Kenvision Techniks website content and training programmes.',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    CourseCategories,
    websiteCourses,
    Solutions,
    Insights,
    Organizations,
    lmsCollection(CourseModules),
    lmsCollection(Lessons),
    lmsCollection(Enrollments),
    lmsCollection(LessonProgress),
    lmsCollection(Quizzes),
    lmsCollection(QuizAttempts),
    lmsCollection(Certificates),
    ContactInquiries,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'courses', 'solutions', 'insights'],
      globals: ['site-settings'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => doc?.title ? `${doc.title} | Kenvision Techniks` : 'Kenvision Techniks',
      generateDescription: ({ doc }) => doc?.summary || doc?.excerpt || 'Professional training and technical solutions across East and Southern Africa.',
      generateURL: ({ doc, collectionSlug }) => {
        const slug = String(doc?.slug || '')
        const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kenvisiontechniks.com').replace(/\/$/, '')
        if (collectionSlug === 'courses') return `${origin}/training/${slug}`
        if (collectionSlug === 'insights') return `${origin}/insights/${slug}`
        if (collectionSlug === 'solutions') return `${origin}/solutions/${slug}`
        return `${origin}/${slug}`
      },
    }),
    redirectsPlugin({
      collections: ['pages', 'courses', 'solutions', 'insights'],
      overrides: { admin: { group: 'Website' } },
    }),
  ],
  cors: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
})
