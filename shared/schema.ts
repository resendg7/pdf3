import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const payloads = pgTable("payloads", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  filename: text("filename").notNull(),
  fileContent: text("file_content").notNull(),
  pdfData: text("pdf_data").notNull(), // Base64 encoded PDF
  contentType: text("content_type").notNull().default("application/pdf"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPayloadSchema = createInsertSchema(payloads).pick({
  filename: true,
  fileContent: true,
});

export type Payload = typeof payloads.$inferSelect;
export type InsertPayload = z.infer<typeof insertPayloadSchema>;
