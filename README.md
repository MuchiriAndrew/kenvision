# Kenvision Techniks

A custom Next.js website and Payload CMS for Kenvision Techniks. The public website and editorial admin are the launch product; the learner portal and LMS are retained as an optional addon in the same application.

## Stack

- Next.js App Router + React
- Payload CMS 3 with the Next.js admin panel
- PostgreSQL via Payload's Postgres adapter
- Payload SEO and redirects plugins
- TypeScript, Lexical rich text and Sharp media processing

## Local setup

Requirements: Node.js 20.9+, pnpm 9+, and PostgreSQL 15+ (or Docker Desktop).

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env`; set `PAYLOAD_SECRET` to a unique random value and configure `DATABASE_URL` for your PostgreSQL instance.
3. If using the included database service, run `docker compose up -d postgres`.
4. Apply the initial schema: `pnpm payload migrate`.
5. Import the 40 exported training programmes: `pnpm seed`.
6. Start the app: `pnpm dev` and open `http://localhost:3000`.

`ENABLE_LMS=false` is the default. With the flag off, student login, registration, dashboard and learning routes return 404; enrolment requests return 404; public course CTAs lead to a prefilled enquiry; and LMS collections are hidden in Payload and deny API access. The course catalogue and contact enquiries remain live. When enabled, students can create accounts and request enrolment; approved students can read lessons for their own active or completed courses. Lesson progress is checked against the course on each write. Private PDF uploads remain disabled while LMS mode is on because uploaded media is publicly served. Turning on the flag does not make this a completed paid LMS; review `GAP_ANALYSIS.md` for remaining content, payments, cohorts, assessments and email work. The flag preserves the LMS schema and existing data.

To create the initial administrator, set `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` (14+ characters) and optionally `INITIAL_ADMIN_NAME` in `.env`, run `pnpm create-admin`, then remove those bootstrap values. Self-service learner registration is available only when `ENABLE_LMS=true`; otherwise public user creation is denied.

## Main URLs

- `/` — public home
- `/training` and `/training/[slug]` — searchable training catalogue and programme pages
- `/solutions`, `/about`, `/clients`, `/insights`, `/contact`, `/terms` — public company content
- `/register`, `/login`, `/dashboard`, `/learn/[slug]` — learner portal, only with `ENABLE_LMS=true`
- `/admin` — Payload editorial administration; LMS sections appear only with `ENABLE_LMS=true`
- `/api/*` — Payload REST API and the enrolment endpoint
- `/sitemap.xml`, `/robots.txt` — search engine discovery and crawl policy

## Payload content model

Editorial collections: Pages (block-based), Course Categories, Courses, Solutions, Insights, Media, Organizations and Contact Inquiries. LMS collections: Course Modules, Lessons, Enrollments, Lesson Progress, Quizzes, Quiz Attempts and Certificates. Users is the authenticated account collection. Site Settings stores brand contact details, default metadata, social preview image, verification token and a site-wide no-index switch.

The LMS data model remains installed. With `ENABLE_LMS=false`, its collections deny access and are hidden from the admin. With the flag on, learners can use the implemented account, enrolment request, dashboard and learning-room paths; the complete course journey still requires authored content and the follow-up work listed in `GAP_ANALYSIS.md`.

## SEO and publishing

Use the SEO fields on Pages, Courses, Solutions and Insights for per-entry titles, descriptions and social cards. Site Settings controls default metadata and a site-wide no-index switch. Published content is exposed in the sitemap; private learner routes and admin/API paths are excluded from crawling. Payload's redirects collection is available for editorial URL changes. Published Pages render at new top-level slugs (for example, `/company-profile`); existing main routes such as `/about` remain code-managed and take precedence.

Set `NEXT_PUBLIC_SITE_URL` to the production origin before deployment. Add a database URL and strong `PAYLOAD_SECRET` in the deployment environment. Configure object storage/CDN and an email adapter before production if media volume or contact-notification requirements call for them.

## Production deployment

The mkbuilds deployment uses `docker-compose.prod.yml`, with a private PostgreSQL service and the Next standalone image. Create `/opt/kenvision/.env.production` on the host with a unique `POSTGRES_PASSWORD` and `PAYLOAD_SECRET`; do not commit production values. `ENABLE_LMS` defaults to `false` and can be set in `.env.production` to control the app and maintenance container consistently. Start the app with:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build postgres app
```

Apply schema migrations and seed the catalogue once per fresh database:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml --profile maintenance run --rm initialize
```

Create the first CMS administrator by overriding the maintenance command with `pnpm create-admin` and passing `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` and `INITIAL_ADMIN_NAME` as one-off environment values. To rotate its password, use the `set-admin-password` script with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Keep both commands one-off; do not add credentials to `.env.production` or GitHub variables. Nginx and the proxy manager handle public HTTPS; the application container itself is bound to host loopback.

GitHub Actions deploys pushes to `main` after the workflow is pushed to GitHub. Configure repository secret `DEPLOY_SSH_KEY` and repository variables `DEPLOY_KNOWN_HOSTS`, `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_PATH` and `PRODUCTION_URL`. The action syncs source without environment files, applies pending Payload migrations, rebuilds/restarts the app and checks the public URL. It does not reseed courses on each deploy, so editor changes are preserved.

## Useful commands

- `pnpm dev` — local development
- `pnpm build` — optimized production build
- `pnpm start` — serve the production build
- `pnpm payload generate:types` — regenerate Payload TypeScript types after schema edits
- `pnpm payload generate:importmap` — regenerate Payload admin component mappings
- `pnpm payload migrate:create <name>` / `pnpm payload migrate` — manage schema migrations
- `pnpm seed` — idempotently upsert the exported course catalogue
