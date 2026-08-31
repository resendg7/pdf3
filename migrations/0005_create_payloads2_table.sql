CREATE TABLE "payloads2" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"filename" text NOT NULL,
	"file_content" text NOT NULL,
	"pdf_data" text NOT NULL,
	"content_type" text DEFAULT 'application/pdf' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
