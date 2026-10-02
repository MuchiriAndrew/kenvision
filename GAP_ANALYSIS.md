# Kenvision website launch and LMS addon — gap analysis

Updated 30 September 2026. The approved launch scope is **website + editorial CMS only**. The LMS is a future addon and is disabled by default with `ENABLE_LMS=false`; the LMS items below are addon prerequisites, not website launch requirements.

## Deployment state

- Live at [https://kenvision.mkbuilds.live](https://kenvision.mkbuilds.live) with a Let's Encrypt certificate and forced HTTPS.
- Next.js runs as a standalone production container; Payload and PostgreSQL share the application network. Database and uploaded media use persistent Docker volumes.
- Payload's initial migration has run and the catalogue contains 40 published programmes across 6 categories.
- LMS routes and enrolment endpoint return 404 while disabled. The Payload LMS collections remain in the schema but are hidden and deny API access.
- A first Payload administrator exists as `admin@kenvision.mkbuilds.live`. This is a temporary login address, not a monitored mailbox; replace it with a client-owned address and rotate its password after first sign-in.

## Delivered in this pass

- Rebuilt the authenticated student dashboard around the reference's dark Kenvision sidebar, compact top bar, spacious course cards, four key metrics, quick actions, upcoming training, activity, recommendations, certificates, progress, payments, profile and support sections.
- Added responsive mobile navigation and a mobile sidebar drawer. Dashboard and learning-room layouts were checked at 320, 375, 768 and 1280 CSS-pixel viewport overrides, with no document-level horizontal overflow in the browser used for QA.
- Rebuilt the course learning room with a module rail, active lesson, resource/video region, progress context and completion control.
- Kept a populated, clearly labelled **development-only preview** at `/dashboard?demo=1` for authenticated admins; its sample data does not write to Payload. The normal `/dashboard` reads real account data and displays honest empty states where records do not exist.
- A production build completes successfully.

## Remaining work, prioritized

| Priority | Gap | Evidence and impact | Completion criterion |
| --- | --- | --- | --- |
| **P0 — before paid LMS launch** | Lesson and resource access is not enforced at the CMS boundary when the addon is enabled. | With `ENABLE_LMS=false`, LMS collections deny access. When enabled, `src/collections/Lessons.ts` and `src/collections/CourseModules.ts` use `publishedOrStaff`, so published records can be fetched without an active enrollment even though the `/learn/[slug]` page checks enrollment. `src/collections/Media.ts` allows public reads for every upload, including lesson PDFs. | Restrict paid lesson/module reads to enrolled learners, staff, or explicitly free previews; separate or protect private resource files and test direct REST/file URLs. |
| **P0 — before paid LMS launch** | Progress can be recorded against a lesson outside the learner's enrolled course. | `src/collections/LessonProgress.ts` checks that the enrollment belongs to the user and is active, but does not verify that the submitted lesson's module belongs to that enrollment's course. Its completion calculation counts all completed lesson IDs for the enrollment, not only IDs in the course. | Validate course/lesson relationship on create and update; calculate percentage from the intersection of this course's lessons and completed records; add abuse tests. |
| **P1 — needed for a working learner journey** | No complete course content is populated. | `src/seed.ts` seeds categories and course catalogue entries only; it does not create modules, lessons, media, quizzes or enrollments. The populated learning room is a labelled preview, not a live course. | Author/publish at least one complete course and test student enrollment → lesson access → progress → completion end to end. |
| **P1** | Payments and receipts are not implemented. | `src/collections/Enrollments.ts` has a staff-only `paymentReference` field but no payment ledger, transaction status, receipt or provider integration. The live Payments section correctly says records are unavailable; the preview table is sample data. | Define payment workflow and provider, persist transactions/receipts, reconcile enrollment status and display real student-owned payment history. |
| **P1** | Course scheduling is too shallow for cohorts. | `src/collections/Courses.ts` stores one `upcomingDate` and delivery modes; there is no session/cohort record with venue, start/end times, capacity, price or learner's chosen session. | Add sessions/cohorts and attach enrollments to a session; populate upcoming training from that relationship. |
| **P1** | Certificate lifecycle is manual and incomplete. | `src/collections/Certificates.ts` stores staff-created records and an optional uploaded file. `LessonProgress` marks enrollment complete but does not issue a certificate; there is no certificate generation or public verification endpoint. | Define completion rules, generate/issue a PDF with unique number, make download available, and provide verification/revocation handling. |
| **P1** | Quiz data models are not a learner assessment flow. | `src/collections/Quizzes.ts` and `QuizAttempts.ts` exist, but no student quiz route or UI is present and completion does not depend on quiz results. | Build attempt/submit/review screens, server-side scoring and retake policy, and any required lesson/certificate gating. |
| **P2** | Built-in marketing pages are still code-managed. | Published Payload Pages now render at new top-level slugs, and Courses/Solutions/Insights use CMS SEO fields; the sitemap uses document update dates. Existing routes such as `/about`, `/clients` and `/contact` still take precedence over CMS Pages with the same slug. | Decide which built-in pages editors should own, then migrate those sections to CMS blocks without breaking their existing routes or design. |
| **P2** | Notifications and learning-hours analytics are presentation-only. | `src/components/StudentPortal.tsx` derives notification text from available records and has no inbox/read state; live metrics use completed lessons because no learning-time model exists. The 42-hour value exists only in the preview fixture. | Persist notification events/read state if needed; track credible learning time or remove that metric from the live product. |
| **P2** | Some design content has no live CMS equivalent. | The preview includes sample payments, dates, certificates and professional course images. Course `coverImage` is optional and the seed does not upload imagery. `Users` has job title but no education field from the reference profile. | Upload licensed course artwork, enter real dates/content, and add profile fields only if the business will collect and maintain them. |
| **P2 — LMS production readiness** | Student email and recovery flow need configuration and testing. | Payload currently reports no email adapter in development, and `AuthForm` has no forgot-password path. | Configure transactional mail, reset-password screens, sender/domain settings and delivery tests before inviting students. |

## Website-only launch checks

- Keep `ENABLE_LMS=false` for this release. If the client later supplies a primary domain, update `NEXT_PUBLIC_SITE_URL`, Payload Site Settings, canonical metadata and the proxy certificate together.
- Replace the temporary Payload admin email with an address the client controls, change the initial password, and add any named editors with least-privilege roles.
- Configure an email adapter and sender-domain records. Enquiries are saved to Payload, but no notification email is sent yet; until configured, someone must check Contact Inquiries in `/admin`.
- Have the client approve public claims, prices, programme descriptions, course dates, country/client references and image usage rights. The seeded catalogue comes from the exported design data; not every programme has a CMS-uploaded image or full editorial description.
- Connect Google Search Console or the client's chosen webmaster tool, add its verification token in Site Settings, and submit `https://kenvision.mkbuilds.live/sitemap.xml`. The live robots file currently permits indexing.
- Define off-server backups for PostgreSQL and uploaded media. The live containers use persistent volumes, but persistence on this host is not an off-site backup.
- Submit one agreed contact enquiry during launch acceptance and confirm it appears in Payload. This was not submitted during deployment to avoid creating a real client enquiry.
- Review keyboard and mobile behaviour on the public deployment, and confirm analytics, privacy and cookie requirements with the client before adding tracking.

## Verification limits

The production build and browser rendering passed. The live enrollment → lesson → certificate flow was not end-to-end tested because the database does not yet contain a complete published course with lessons and a test student enrollment. The profile edit form was not submitted against the existing admin account during this visual QA pass. These are still acceptance tests, not assumed successes.
