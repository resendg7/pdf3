CREATE TABLE "payloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"js_content" text NOT NULL,
	"pdf_data" text NOT NULL,
	"content_type" text DEFAULT 'application/pdf' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
