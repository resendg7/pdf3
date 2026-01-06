
import { payloads, type Payload, type InsertPayload } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  savePayload(payload: InsertPayload & { pdfData: string }): Promise<Payload>;
  getLatestPayload(): Promise<Payload | undefined>;
}

export class DatabaseStorage implements IStorage {
  async savePayload(payload: InsertPayload & { pdfData: string }): Promise<Payload> {
    const [saved] = await db
      .insert(payloads)
      .values({
        filename: payload.filename,
        jsContent: payload.jsContent,
        pdfData: payload.pdfData,
      })
      .returning();
    return saved;
  }

  async getLatestPayload(): Promise<Payload | undefined> {
    const [latest] = await db
      .select()
      .from(payloads)
      .orderBy(desc(payloads.createdAt))
      .limit(1);
    return latest;
  }
}

export const storage = new DatabaseStorage();
