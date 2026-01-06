
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const payloads = pgTable("payloads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  jsContent: text("js_content").notNull(),
  pdfData: text("pdf_data").notNull(), // Base64 encoded PDF
  contentType: text("content_type").notNull().default("application/pdf"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPayloadSchema = createInsertSchema(payloads).pick({
  filename: true,
  jsContent: true,
});

export type Payload = typeof payloads.$inferSelect;
export type InsertPayload = z.infer<typeof insertPayloadSchema>;
