ALTER TABLE "students" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "attendances" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "enrollments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "students" CASCADE;--> statement-breakpoint
DROP TABLE "attendances" CASCADE;--> statement-breakpoint
DROP TABLE "enrollments" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_code_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_email_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_document_unique";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "code";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "workload";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "document";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "degree";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "specialization";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "admission_date";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN "updated_at";--> statement-breakpoint
DROP TYPE "public"."attendance_status";--> statement-breakpoint
DROP TYPE "public"."enrollment_status";