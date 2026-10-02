import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('student', 'instructor', 'admin');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_course_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__course_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_courses_delivery_modes" AS ENUM('In person', 'Online', 'Blended');
  CREATE TYPE "public"."enum_courses_level" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'All levels');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_version_delivery_modes" AS ENUM('In person', 'Online', 'Blended');
  CREATE TYPE "public"."enum__courses_v_version_level" AS ENUM('Beginner', 'Intermediate', 'Advanced', 'All levels');
  CREATE TYPE "public"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_course_modules_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__course_modules_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lessons_lesson_type" AS ENUM('text', 'video', 'resource', 'live-session');
  CREATE TYPE "public"."enum_lessons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lessons_v_version_lesson_type" AS ENUM('text', 'video', 'resource', 'live-session');
  CREATE TYPE "public"."enum__lessons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enrollments_status" AS ENUM('pending', 'active', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_quizzes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quizzes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contact_inquiries_inquiry_type" AS ENUM('General', 'Security systems', 'Corporate training', 'Course enrollment', 'Other');
  CREATE TYPE "public"."enum_contact_inquiries_status" AS ENUM('new', 'in-progress', 'resolved');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TABLE "users_sessions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) with time zone,
	"expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"phone" varchar,
	"country" varchar DEFAULT 'Kenya',
	"role" "enum_users_role" DEFAULT 'student' NOT NULL,
	"organization_id" integer,
	"job_title" varchar,
	"marketing_opt_in" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"reset_password_requested_at" timestamp(3) with time zone,
	"login_attempts" numeric DEFAULT 0,
	"lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_card_url" varchar,
	"sizes_card_width" numeric,
	"sizes_card_height" numeric,
	"sizes_card_mime_type" varchar,
	"sizes_card_filesize" numeric,
	"sizes_card_filename" varchar,
	"sizes_wide_url" varchar,
	"sizes_wide_width" numeric,
	"sizes_wide_height" numeric,
	"sizes_wide_mime_type" varchar,
	"sizes_wide_filesize" numeric,
	"sizes_wide_filename" varchar,
	"sizes_social_url" varchar,
	"sizes_social_width" numeric,
	"sizes_social_height" numeric,
	"sizes_social_mime_type" varchar,
	"sizes_social_filesize" numeric,
	"sizes_social_filename" varchar
  );

  CREATE TABLE "pages_blocks_rich_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar,
	"content" jsonb,
	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_image_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar,
	"content" jsonb,
	"image_id" integer,
	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_cards_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"text" varchar,
	"image_id" integer,
	"link" varchar
  );

  CREATE TABLE "pages_blocks_cards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar,
	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_call_to_action" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"heading" varchar,
	"text" varchar,
	"label" varchar,
	"url" varchar,
	"block_name" varchar
  );

  CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"summary" varchar,
	"hero_eyebrow" varchar,
	"hero_heading" varchar,
	"hero_subheading" varchar,
	"hero_image_id" integer,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_pages_status" DEFAULT 'draft'
  );

  CREATE TABLE "_pages_v_blocks_rich_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar,
	"content" jsonb,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_image_text" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar,
	"content" jsonb,
	"image_id" integer,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_cards_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"text" varchar,
	"image_id" integer,
	"link" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_pages_v_blocks_cards" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_call_to_action" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"heading" varchar,
	"text" varchar,
	"label" varchar,
	"url" varchar,
	"_uuid" varchar,
	"block_name" varchar
  );

  CREATE TABLE "_pages_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_summary" varchar,
	"version_hero_eyebrow" varchar,
	"version_hero_heading" varchar,
	"version_hero_subheading" varchar,
	"version_hero_image_id" integer,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
  );

  CREATE TABLE "course_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"description" varchar,
	"image_id" integer,
	"sort_order" numeric DEFAULT 0,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_course_categories_status" DEFAULT 'draft'
  );

  CREATE TABLE "_course_categories_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_description" varchar,
	"version_image_id" integer,
	"version_sort_order" numeric DEFAULT 0,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__course_categories_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "courses_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar
  );

  CREATE TABLE "courses_delivery_modes" (
	"order" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"value" "enum_courses_delivery_modes",
	"id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "courses_requirements" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item" varchar
  );

  CREATE TABLE "courses_outcomes" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"item" varchar
  );

  CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"category_id" integer,
	"summary" varchar,
	"description" jsonb,
	"cover_image_id" integer,
	"price" numeric,
	"previous_price" numeric,
	"duration" varchar,
	"level" "enum_courses_level",
	"featured" boolean DEFAULT false,
	"upcoming_date" timestamp(3) with time zone,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_courses_status" DEFAULT 'draft'
  );

  CREATE TABLE "_courses_v_version_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"tag" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_courses_v_version_delivery_modes" (
	"order" integer NOT NULL,
	"parent_id" integer NOT NULL,
	"value" "enum__courses_v_version_delivery_modes",
	"id" serial PRIMARY KEY NOT NULL
  );

  CREATE TABLE "_courses_v_version_requirements" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"item" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_courses_v_version_outcomes" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"item" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_courses_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_category_id" integer,
	"version_summary" varchar,
	"version_description" jsonb,
	"version_cover_image_id" integer,
	"version_price" numeric,
	"version_previous_price" numeric,
	"version_duration" varchar,
	"version_level" "enum__courses_v_version_level",
	"version_featured" boolean DEFAULT false,
	"version_upcoming_date" timestamp(3) with time zone,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__courses_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
  );

  CREATE TABLE "solutions_features" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"feature" varchar
  );

  CREATE TABLE "solutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"summary" varchar,
	"description" jsonb,
	"image_id" integer,
	"sort_order" numeric DEFAULT 0,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_solutions_status" DEFAULT 'draft'
  );

  CREATE TABLE "_solutions_v_version_features" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"feature" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_solutions_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_summary" varchar,
	"version_description" jsonb,
	"version_image_id" integer,
	"version_sort_order" numeric DEFAULT 0,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "insights_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar
  );

  CREATE TABLE "insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"excerpt" varchar,
	"content" jsonb,
	"cover_image_id" integer,
	"author_id" integer,
	"published_at" timestamp(3) with time zone,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_insights_status" DEFAULT 'draft'
  );

  CREATE TABLE "_insights_v_version_tags" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"tag" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_insights_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_excerpt" varchar,
	"version_content" jsonb,
	"version_cover_image_id" integer,
	"version_author_id" integer,
	"version_published_at" timestamp(3) with time zone,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_meta_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__insights_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
  );

  CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"country" varchar,
	"contact_name" varchar,
	"contact_email" varchar,
	"contact_phone" varchar,
	"notes" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "course_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"course_id" integer,
	"description" varchar,
	"sort_order" numeric DEFAULT 0,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_course_modules_status" DEFAULT 'draft'
  );

  CREATE TABLE "_course_modules_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_course_id" integer,
	"version_description" varchar,
	"version_sort_order" numeric DEFAULT 0,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__course_modules_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"module_id" integer,
	"lesson_type" "enum_lessons_lesson_type" DEFAULT 'text',
	"content" jsonb,
	"video_url" varchar,
	"resource_id" integer,
	"duration_minutes" numeric,
	"sort_order" numeric DEFAULT 0,
	"free_preview" boolean DEFAULT false,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_lessons_status" DEFAULT 'draft'
  );

  CREATE TABLE "_lessons_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_module_id" integer,
	"version_lesson_type" "enum__lessons_v_version_lesson_type" DEFAULT 'text',
	"version_content" jsonb,
	"version_video_url" varchar,
	"version_resource_id" integer,
	"version_duration_minutes" numeric,
	"version_sort_order" numeric DEFAULT 0,
	"version_free_preview" boolean DEFAULT false,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__lessons_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"organization_id" integer,
	"status" "enum_enrollments_status" DEFAULT 'pending',
	"enrolled_at" timestamp(3) with time zone,
	"completed_at" timestamp(3) with time zone,
	"progress_percent" numeric DEFAULT 0,
	"payment_reference" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "lesson_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"enrollment_id" integer NOT NULL,
	"lesson_id" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp(3) with time zone,
	"last_position_seconds" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "quizzes_questions_options" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar
  );

  CREATE TABLE "quizzes_questions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"prompt" varchar,
	"correct_option" numeric,
	"explanation" varchar
  );

  CREATE TABLE "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"course_id" integer,
	"lesson_id" integer,
	"passing_score" numeric DEFAULT 70,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_quizzes_status" DEFAULT 'draft'
  );

  CREATE TABLE "_quizzes_v_version_questions_options" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_quizzes_v_version_questions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" varchar,
	"correct_option" numeric,
	"explanation" varchar,
	"_uuid" varchar
  );

  CREATE TABLE "_quizzes_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_course_id" integer,
	"version_lesson_id" integer,
	"version_passing_score" numeric DEFAULT 70,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__quizzes_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean
  );

  CREATE TABLE "quiz_attempts_answers" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"question_index" numeric NOT NULL,
	"selected_option" numeric NOT NULL
  );

  CREATE TABLE "quiz_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"enrollment_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"score" numeric,
	"passed" boolean,
	"submitted_at" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"certificate_number" varchar NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"enrollment_id" integer NOT NULL,
	"issued_at" timestamp(3) with time zone NOT NULL,
	"file_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "contact_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar,
	"organization" varchar,
	"inquiry_type" "enum_contact_inquiries_inquiry_type" DEFAULT 'General',
	"message" varchar NOT NULL,
	"status" "enum_contact_inquiries_status" DEFAULT 'new',
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "redirects" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" varchar NOT NULL,
	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
	"to_url" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "redirects_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"pages_id" integer,
	"courses_id" integer,
	"solutions_id" integer,
	"insights_id" integer
  );

  CREATE TABLE "payload_kv" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"global_slug" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer,
	"media_id" integer,
	"pages_id" integer,
	"course_categories_id" integer,
	"courses_id" integer,
	"solutions_id" integer,
	"insights_id" integer,
	"organizations_id" integer,
	"course_modules_id" integer,
	"lessons_id" integer,
	"enrollments_id" integer,
	"lesson_progress_id" integer,
	"quizzes_id" integer,
	"quiz_attempts_id" integer,
	"certificates_id" integer,
	"contact_inquiries_id" integer,
	"redirects_id" integer
  );

  CREATE TABLE "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
  );

  CREATE TABLE "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "site_settings_social_links" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"url" varchar NOT NULL
  );

  CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" varchar DEFAULT 'Kenvision Techniks' NOT NULL,
	"tagline" varchar DEFAULT 'Technology, expertise and training that build capability.',
	"logo_id" integer,
	"contact_general_email" varchar DEFAULT 'info@kenvisiontechniks.com',
	"contact_training_email" varchar DEFAULT 'ken_trainers@kenvisiontechniks.com',
	"contact_phone" varchar DEFAULT '+254 725 579 251',
	"contact_training_phone" varchar DEFAULT '+254 731 983 371',
	"contact_address" varchar DEFAULT 'Q7–Q9 Feliz Building, Kahawa Sukari Avenue, Nairobi, Kenya',
	"default_meta_title" varchar DEFAULT 'Kenvision Techniks | Training & Technical Solutions',
	"default_meta_description" varchar DEFAULT 'Professional training and technical solutions across East and Southern Africa.',
	"default_social_image_id" integer,
	"google_site_verification" varchar,
	"no_index_site" boolean DEFAULT false,
	"meta_title" varchar,
	"meta_description" varchar,
	"meta_image_id" integer,
	"updated_at" timestamp(3) with time zone,
	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards" ADD CONSTRAINT "pages_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards" ADD CONSTRAINT "_pages_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_categories" ADD CONSTRAINT "course_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_categories_v" ADD CONSTRAINT "_course_categories_v_parent_id_course_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_categories_v" ADD CONSTRAINT "_course_categories_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_tags" ADD CONSTRAINT "courses_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_delivery_modes" ADD CONSTRAINT "courses_delivery_modes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_requirements" ADD CONSTRAINT "courses_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_outcomes" ADD CONSTRAINT "courses_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_course_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."course_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_version_tags" ADD CONSTRAINT "_courses_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_delivery_modes" ADD CONSTRAINT "_courses_v_version_delivery_modes_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_requirements" ADD CONSTRAINT "_courses_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_outcomes" ADD CONSTRAINT "_courses_v_version_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_category_id_course_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."course_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_features" ADD CONSTRAINT "solutions_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_features" ADD CONSTRAINT "_solutions_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights_tags" ADD CONSTRAINT "insights_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_version_tags" ADD CONSTRAINT "_insights_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_modules_v" ADD CONSTRAINT "_course_modules_v_parent_id_course_modules_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_modules_v" ADD CONSTRAINT "_course_modules_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_resource_id_media_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_parent_id_lessons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_version_module_id_course_modules_id_fk" FOREIGN KEY ("version_module_id") REFERENCES "public"."course_modules"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_version_resource_id_media_id_fk" FOREIGN KEY ("version_resource_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quizzes_questions_options" ADD CONSTRAINT "quizzes_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quizzes_questions" ADD CONSTRAINT "quizzes_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quizzes_v_version_questions_options" ADD CONSTRAINT "_quizzes_v_version_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quizzes_v_version_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quizzes_v_version_questions" ADD CONSTRAINT "_quizzes_v_version_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quizzes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quizzes_v" ADD CONSTRAINT "_quizzes_v_parent_id_quizzes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quizzes_v" ADD CONSTRAINT "_quizzes_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quizzes_v" ADD CONSTRAINT "_quizzes_v_version_lesson_id_lessons_id_fk" FOREIGN KEY ("version_lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quiz_attempts_answers" ADD CONSTRAINT "quiz_attempts_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_categories_fk" FOREIGN KEY ("course_categories_id") REFERENCES "public"."course_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizations_fk" FOREIGN KEY ("organizations_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_modules_fk" FOREIGN KEY ("course_modules_id") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lesson_progress_fk" FOREIGN KEY ("lesson_progress_id") REFERENCES "public"."lesson_progress"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quizzes_fk" FOREIGN KEY ("quizzes_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quiz_attempts_fk" FOREIGN KEY ("quiz_attempts_id") REFERENCES "public"."quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_inquiries_fk" FOREIGN KEY ("contact_inquiries_id") REFERENCES "public"."contact_inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_social_image_id_media_id_fk" FOREIGN KEY ("default_social_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_full_name_idx" ON "users" USING btree ("full_name");
  CREATE INDEX "users_organization_idx" ON "users" USING btree ("organization_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_social_sizes_social_filename_idx" ON "media" USING btree ("sizes_social_filename");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_items_order_idx" ON "pages_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_items_parent_id_idx" ON "pages_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_items_image_idx" ON "pages_blocks_cards_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cards_order_idx" ON "pages_blocks_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_parent_id_idx" ON "pages_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_path_idx" ON "pages_blocks_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "pages_blocks_call_to_action" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cards_items_order_idx" ON "_pages_v_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_items_parent_id_idx" ON "_pages_v_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_items_image_idx" ON "_pages_v_blocks_cards_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cards_order_idx" ON "_pages_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_parent_id_idx" ON "_pages_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_path_idx" ON "_pages_v_blocks_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_call_to_action_order_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_call_to_action_parent_id_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_call_to_action_path_idx" ON "_pages_v_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_hero_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "course_categories_slug_idx" ON "course_categories" USING btree ("slug");
  CREATE INDEX "course_categories_image_idx" ON "course_categories" USING btree ("image_id");
  CREATE INDEX "course_categories_updated_at_idx" ON "course_categories" USING btree ("updated_at");
  CREATE INDEX "course_categories_created_at_idx" ON "course_categories" USING btree ("created_at");
  CREATE INDEX "course_categories__status_idx" ON "course_categories" USING btree ("_status");
  CREATE INDEX "_course_categories_v_parent_idx" ON "_course_categories_v" USING btree ("parent_id");
  CREATE INDEX "_course_categories_v_version_version_slug_idx" ON "_course_categories_v" USING btree ("version_slug");
  CREATE INDEX "_course_categories_v_version_version_image_idx" ON "_course_categories_v" USING btree ("version_image_id");
  CREATE INDEX "_course_categories_v_version_version_updated_at_idx" ON "_course_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_course_categories_v_version_version_created_at_idx" ON "_course_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_course_categories_v_version_version__status_idx" ON "_course_categories_v" USING btree ("version__status");
  CREATE INDEX "_course_categories_v_created_at_idx" ON "_course_categories_v" USING btree ("created_at");
  CREATE INDEX "_course_categories_v_updated_at_idx" ON "_course_categories_v" USING btree ("updated_at");
  CREATE INDEX "_course_categories_v_latest_idx" ON "_course_categories_v" USING btree ("latest");
  CREATE INDEX "courses_tags_order_idx" ON "courses_tags" USING btree ("_order");
  CREATE INDEX "courses_tags_parent_id_idx" ON "courses_tags" USING btree ("_parent_id");
  CREATE INDEX "courses_delivery_modes_order_idx" ON "courses_delivery_modes" USING btree ("order");
  CREATE INDEX "courses_delivery_modes_parent_idx" ON "courses_delivery_modes" USING btree ("parent_id");
  CREATE INDEX "courses_requirements_order_idx" ON "courses_requirements" USING btree ("_order");
  CREATE INDEX "courses_requirements_parent_id_idx" ON "courses_requirements" USING btree ("_parent_id");
  CREATE INDEX "courses_outcomes_order_idx" ON "courses_outcomes" USING btree ("_order");
  CREATE INDEX "courses_outcomes_parent_id_idx" ON "courses_outcomes" USING btree ("_parent_id");
  CREATE INDEX "courses_title_idx" ON "courses" USING btree ("title");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_category_idx" ON "courses" USING btree ("category_id");
  CREATE INDEX "courses_cover_image_idx" ON "courses" USING btree ("cover_image_id");
  CREATE INDEX "courses_featured_idx" ON "courses" USING btree ("featured");
  CREATE INDEX "courses_meta_meta_image_idx" ON "courses" USING btree ("meta_image_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses__status_idx" ON "courses" USING btree ("_status");
  CREATE INDEX "_courses_v_version_tags_order_idx" ON "_courses_v_version_tags" USING btree ("_order");
  CREATE INDEX "_courses_v_version_tags_parent_id_idx" ON "_courses_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_delivery_modes_order_idx" ON "_courses_v_version_delivery_modes" USING btree ("order");
  CREATE INDEX "_courses_v_version_delivery_modes_parent_idx" ON "_courses_v_version_delivery_modes" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_requirements_order_idx" ON "_courses_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_courses_v_version_requirements_parent_id_idx" ON "_courses_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_version_outcomes_order_idx" ON "_courses_v_version_outcomes" USING btree ("_order");
  CREATE INDEX "_courses_v_version_outcomes_parent_id_idx" ON "_courses_v_version_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_title_idx" ON "_courses_v" USING btree ("version_title");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_category_idx" ON "_courses_v" USING btree ("version_category_id");
  CREATE INDEX "_courses_v_version_version_cover_image_idx" ON "_courses_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_courses_v_version_version_featured_idx" ON "_courses_v" USING btree ("version_featured");
  CREATE INDEX "_courses_v_version_meta_version_meta_image_idx" ON "_courses_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_latest_idx" ON "_courses_v" USING btree ("latest");
  CREATE INDEX "_courses_v_autosave_idx" ON "_courses_v" USING btree ("autosave");
  CREATE INDEX "solutions_features_order_idx" ON "solutions_features" USING btree ("_order");
  CREATE INDEX "solutions_features_parent_id_idx" ON "solutions_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_image_idx" ON "solutions" USING btree ("image_id");
  CREATE INDEX "solutions_meta_meta_image_idx" ON "solutions" USING btree ("meta_image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE INDEX "_solutions_v_version_features_order_idx" ON "_solutions_v_version_features" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_features_parent_id_idx" ON "_solutions_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_version_slug_idx" ON "_solutions_v" USING btree ("version_slug");
  CREATE INDEX "_solutions_v_version_version_image_idx" ON "_solutions_v" USING btree ("version_image_id");
  CREATE INDEX "_solutions_v_version_meta_version_meta_image_idx" ON "_solutions_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE INDEX "insights_tags_order_idx" ON "insights_tags" USING btree ("_order");
  CREATE INDEX "insights_tags_parent_id_idx" ON "insights_tags" USING btree ("_parent_id");
  CREATE INDEX "insights_title_idx" ON "insights" USING btree ("title");
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_cover_image_idx" ON "insights" USING btree ("cover_image_id");
  CREATE INDEX "insights_author_idx" ON "insights" USING btree ("author_id");
  CREATE INDEX "insights_published_at_idx" ON "insights" USING btree ("published_at");
  CREATE INDEX "insights_meta_meta_image_idx" ON "insights" USING btree ("meta_image_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE INDEX "_insights_v_version_tags_order_idx" ON "_insights_v_version_tags" USING btree ("_order");
  CREATE INDEX "_insights_v_version_tags_parent_id_idx" ON "_insights_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_title_idx" ON "_insights_v" USING btree ("version_title");
  CREATE INDEX "_insights_v_version_version_slug_idx" ON "_insights_v" USING btree ("version_slug");
  CREATE INDEX "_insights_v_version_version_cover_image_idx" ON "_insights_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_insights_v_version_version_author_idx" ON "_insights_v" USING btree ("version_author_id");
  CREATE INDEX "_insights_v_version_version_published_at_idx" ON "_insights_v" USING btree ("version_published_at");
  CREATE INDEX "_insights_v_version_meta_version_meta_image_idx" ON "_insights_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  CREATE INDEX "_insights_v_autosave_idx" ON "_insights_v" USING btree ("autosave");
  CREATE INDEX "organizations_name_idx" ON "organizations" USING btree ("name");
  CREATE INDEX "organizations_updated_at_idx" ON "organizations" USING btree ("updated_at");
  CREATE INDEX "organizations_created_at_idx" ON "organizations" USING btree ("created_at");
  CREATE INDEX "course_modules_course_idx" ON "course_modules" USING btree ("course_id");
  CREATE INDEX "course_modules_updated_at_idx" ON "course_modules" USING btree ("updated_at");
  CREATE INDEX "course_modules_created_at_idx" ON "course_modules" USING btree ("created_at");
  CREATE INDEX "course_modules__status_idx" ON "course_modules" USING btree ("_status");
  CREATE INDEX "_course_modules_v_parent_idx" ON "_course_modules_v" USING btree ("parent_id");
  CREATE INDEX "_course_modules_v_version_version_course_idx" ON "_course_modules_v" USING btree ("version_course_id");
  CREATE INDEX "_course_modules_v_version_version_updated_at_idx" ON "_course_modules_v" USING btree ("version_updated_at");
  CREATE INDEX "_course_modules_v_version_version_created_at_idx" ON "_course_modules_v" USING btree ("version_created_at");
  CREATE INDEX "_course_modules_v_version_version__status_idx" ON "_course_modules_v" USING btree ("version__status");
  CREATE INDEX "_course_modules_v_created_at_idx" ON "_course_modules_v" USING btree ("created_at");
  CREATE INDEX "_course_modules_v_updated_at_idx" ON "_course_modules_v" USING btree ("updated_at");
  CREATE INDEX "_course_modules_v_latest_idx" ON "_course_modules_v" USING btree ("latest");
  CREATE INDEX "lessons_module_idx" ON "lessons" USING btree ("module_id");
  CREATE INDEX "lessons_resource_idx" ON "lessons" USING btree ("resource_id");
  CREATE INDEX "lessons_updated_at_idx" ON "lessons" USING btree ("updated_at");
  CREATE INDEX "lessons_created_at_idx" ON "lessons" USING btree ("created_at");
  CREATE INDEX "lessons__status_idx" ON "lessons" USING btree ("_status");
  CREATE INDEX "_lessons_v_parent_idx" ON "_lessons_v" USING btree ("parent_id");
  CREATE INDEX "_lessons_v_version_version_module_idx" ON "_lessons_v" USING btree ("version_module_id");
  CREATE INDEX "_lessons_v_version_version_resource_idx" ON "_lessons_v" USING btree ("version_resource_id");
  CREATE INDEX "_lessons_v_version_version_updated_at_idx" ON "_lessons_v" USING btree ("version_updated_at");
  CREATE INDEX "_lessons_v_version_version_created_at_idx" ON "_lessons_v" USING btree ("version_created_at");
  CREATE INDEX "_lessons_v_version_version__status_idx" ON "_lessons_v" USING btree ("version__status");
  CREATE INDEX "_lessons_v_created_at_idx" ON "_lessons_v" USING btree ("created_at");
  CREATE INDEX "_lessons_v_updated_at_idx" ON "_lessons_v" USING btree ("updated_at");
  CREATE INDEX "_lessons_v_latest_idx" ON "_lessons_v" USING btree ("latest");
  CREATE INDEX "enrollments_student_idx" ON "enrollments" USING btree ("student_id");
  CREATE INDEX "enrollments_course_idx" ON "enrollments" USING btree ("course_id");
  CREATE INDEX "enrollments_organization_idx" ON "enrollments" USING btree ("organization_id");
  CREATE INDEX "enrollments_status_idx" ON "enrollments" USING btree ("status");
  CREATE INDEX "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
  CREATE INDEX "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
  CREATE INDEX "lesson_progress_student_idx" ON "lesson_progress" USING btree ("student_id");
  CREATE INDEX "lesson_progress_enrollment_idx" ON "lesson_progress" USING btree ("enrollment_id");
  CREATE INDEX "lesson_progress_lesson_idx" ON "lesson_progress" USING btree ("lesson_id");
  CREATE INDEX "lesson_progress_updated_at_idx" ON "lesson_progress" USING btree ("updated_at");
  CREATE INDEX "lesson_progress_created_at_idx" ON "lesson_progress" USING btree ("created_at");
  CREATE INDEX "quizzes_questions_options_order_idx" ON "quizzes_questions_options" USING btree ("_order");
  CREATE INDEX "quizzes_questions_options_parent_id_idx" ON "quizzes_questions_options" USING btree ("_parent_id");
  CREATE INDEX "quizzes_questions_order_idx" ON "quizzes_questions" USING btree ("_order");
  CREATE INDEX "quizzes_questions_parent_id_idx" ON "quizzes_questions" USING btree ("_parent_id");
  CREATE INDEX "quizzes_course_idx" ON "quizzes" USING btree ("course_id");
  CREATE INDEX "quizzes_lesson_idx" ON "quizzes" USING btree ("lesson_id");
  CREATE INDEX "quizzes_updated_at_idx" ON "quizzes" USING btree ("updated_at");
  CREATE INDEX "quizzes_created_at_idx" ON "quizzes" USING btree ("created_at");
  CREATE INDEX "quizzes__status_idx" ON "quizzes" USING btree ("_status");
  CREATE INDEX "_quizzes_v_version_questions_options_order_idx" ON "_quizzes_v_version_questions_options" USING btree ("_order");
  CREATE INDEX "_quizzes_v_version_questions_options_parent_id_idx" ON "_quizzes_v_version_questions_options" USING btree ("_parent_id");
  CREATE INDEX "_quizzes_v_version_questions_order_idx" ON "_quizzes_v_version_questions" USING btree ("_order");
  CREATE INDEX "_quizzes_v_version_questions_parent_id_idx" ON "_quizzes_v_version_questions" USING btree ("_parent_id");
  CREATE INDEX "_quizzes_v_parent_idx" ON "_quizzes_v" USING btree ("parent_id");
  CREATE INDEX "_quizzes_v_version_version_course_idx" ON "_quizzes_v" USING btree ("version_course_id");
  CREATE INDEX "_quizzes_v_version_version_lesson_idx" ON "_quizzes_v" USING btree ("version_lesson_id");
  CREATE INDEX "_quizzes_v_version_version_updated_at_idx" ON "_quizzes_v" USING btree ("version_updated_at");
  CREATE INDEX "_quizzes_v_version_version_created_at_idx" ON "_quizzes_v" USING btree ("version_created_at");
  CREATE INDEX "_quizzes_v_version_version__status_idx" ON "_quizzes_v" USING btree ("version__status");
  CREATE INDEX "_quizzes_v_created_at_idx" ON "_quizzes_v" USING btree ("created_at");
  CREATE INDEX "_quizzes_v_updated_at_idx" ON "_quizzes_v" USING btree ("updated_at");
  CREATE INDEX "_quizzes_v_latest_idx" ON "_quizzes_v" USING btree ("latest");
  CREATE INDEX "quiz_attempts_answers_order_idx" ON "quiz_attempts_answers" USING btree ("_order");
  CREATE INDEX "quiz_attempts_answers_parent_id_idx" ON "quiz_attempts_answers" USING btree ("_parent_id");
  CREATE INDEX "quiz_attempts_student_idx" ON "quiz_attempts" USING btree ("student_id");
  CREATE INDEX "quiz_attempts_enrollment_idx" ON "quiz_attempts" USING btree ("enrollment_id");
  CREATE INDEX "quiz_attempts_quiz_idx" ON "quiz_attempts" USING btree ("quiz_id");
  CREATE INDEX "quiz_attempts_updated_at_idx" ON "quiz_attempts" USING btree ("updated_at");
  CREATE INDEX "quiz_attempts_created_at_idx" ON "quiz_attempts" USING btree ("created_at");
  CREATE UNIQUE INDEX "certificates_certificate_number_idx" ON "certificates" USING btree ("certificate_number");
  CREATE INDEX "certificates_student_idx" ON "certificates" USING btree ("student_id");
  CREATE INDEX "certificates_course_idx" ON "certificates" USING btree ("course_id");
  CREATE INDEX "certificates_enrollment_idx" ON "certificates" USING btree ("enrollment_id");
  CREATE INDEX "certificates_file_idx" ON "certificates" USING btree ("file_id");
  CREATE INDEX "certificates_updated_at_idx" ON "certificates" USING btree ("updated_at");
  CREATE INDEX "certificates_created_at_idx" ON "certificates" USING btree ("created_at");
  CREATE INDEX "contact_inquiries_updated_at_idx" ON "contact_inquiries" USING btree ("updated_at");
  CREATE INDEX "contact_inquiries_created_at_idx" ON "contact_inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_courses_id_idx" ON "redirects_rels" USING btree ("courses_id");
  CREATE INDEX "redirects_rels_solutions_id_idx" ON "redirects_rels" USING btree ("solutions_id");
  CREATE INDEX "redirects_rels_insights_id_idx" ON "redirects_rels" USING btree ("insights_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_course_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("course_categories_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");
  CREATE INDEX "payload_locked_documents_rels_organizations_id_idx" ON "payload_locked_documents_rels" USING btree ("organizations_id");
  CREATE INDEX "payload_locked_documents_rels_course_modules_id_idx" ON "payload_locked_documents_rels" USING btree ("course_modules_id");
  CREATE INDEX "payload_locked_documents_rels_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("lessons_id");
  CREATE INDEX "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
  CREATE INDEX "payload_locked_documents_rels_lesson_progress_id_idx" ON "payload_locked_documents_rels" USING btree ("lesson_progress_id");
  CREATE INDEX "payload_locked_documents_rels_quizzes_id_idx" ON "payload_locked_documents_rels" USING btree ("quizzes_id");
  CREATE INDEX "payload_locked_documents_rels_quiz_attempts_id_idx" ON "payload_locked_documents_rels" USING btree ("quiz_attempts_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_id");
  CREATE INDEX "payload_locked_documents_rels_contact_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_default_social_image_idx" ON "site_settings" USING btree ("default_social_image_id");
  CREATE INDEX "site_settings_meta_meta_image_idx" ON "site_settings" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_cards_items" CASCADE;
  DROP TABLE "pages_blocks_cards" CASCADE;
  DROP TABLE "pages_blocks_call_to_action" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_call_to_action" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "course_categories" CASCADE;
  DROP TABLE "_course_categories_v" CASCADE;
  DROP TABLE "courses_tags" CASCADE;
  DROP TABLE "courses_delivery_modes" CASCADE;
  DROP TABLE "courses_requirements" CASCADE;
  DROP TABLE "courses_outcomes" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "_courses_v_version_tags" CASCADE;
  DROP TABLE "_courses_v_version_delivery_modes" CASCADE;
  DROP TABLE "_courses_v_version_requirements" CASCADE;
  DROP TABLE "_courses_v_version_outcomes" CASCADE;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "solutions_features" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "_solutions_v_version_features" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "insights_tags" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v_version_tags" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "organizations" CASCADE;
  DROP TABLE "course_modules" CASCADE;
  DROP TABLE "_course_modules_v" CASCADE;
  DROP TABLE "lessons" CASCADE;
  DROP TABLE "_lessons_v" CASCADE;
  DROP TABLE "enrollments" CASCADE;
  DROP TABLE "lesson_progress" CASCADE;
  DROP TABLE "quizzes_questions_options" CASCADE;
  DROP TABLE "quizzes_questions" CASCADE;
  DROP TABLE "quizzes" CASCADE;
  DROP TABLE "_quizzes_v_version_questions_options" CASCADE;
  DROP TABLE "_quizzes_v_version_questions" CASCADE;
  DROP TABLE "_quizzes_v" CASCADE;
  DROP TABLE "quiz_attempts_answers" CASCADE;
  DROP TABLE "quiz_attempts" CASCADE;
  DROP TABLE "certificates" CASCADE;
  DROP TABLE "contact_inquiries" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_course_categories_status";
  DROP TYPE "public"."enum__course_categories_v_version_status";
  DROP TYPE "public"."enum_courses_delivery_modes";
  DROP TYPE "public"."enum_courses_level";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum__courses_v_version_delivery_modes";
  DROP TYPE "public"."enum__courses_v_version_level";
  DROP TYPE "public"."enum__courses_v_version_status";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_version_status";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum_course_modules_status";
  DROP TYPE "public"."enum__course_modules_v_version_status";
  DROP TYPE "public"."enum_lessons_lesson_type";
  DROP TYPE "public"."enum_lessons_status";
  DROP TYPE "public"."enum__lessons_v_version_lesson_type";
  DROP TYPE "public"."enum__lessons_v_version_status";
  DROP TYPE "public"."enum_enrollments_status";
  DROP TYPE "public"."enum_quizzes_status";
  DROP TYPE "public"."enum__quizzes_v_version_status";
  DROP TYPE "public"."enum_contact_inquiries_inquiry_type";
  DROP TYPE "public"."enum_contact_inquiries_status";
  DROP TYPE "public"."enum_redirects_to_type";`)
}
