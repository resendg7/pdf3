import { payloads, payloads2, type Payload, type InsertPayload } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  savePayload(payload: InsertPayload & { pdfData: string; userId?: string }): Promise<Payload>;
  getLatestPayload(): Promise<Payload | undefined>;
  getLatestPayloadByUser(userId: string): Promise<Payload | undefined>;
}

export class DatabaseStorage implements IStorage {
  async savePayload(payload: InsertPayload & { pdfData: string; userId?: string }): Promise<Payload> {
    const [saved] = await db
      .insert(payloads2)
      .values({
        userId: payload.userId,
        filename: payload.filename,
        fileContent: payload.fileContent,
        pdfData: payload.pdfData,
      })
      .returning();
    return saved;
  }

  async getLatestPayload(): Promise<Payload | undefined> {
    const [latest] = await db
      .select()
      .from(payloads2)
      .orderBy(desc(payloads2.createdAt))
      .limit(1);
    return latest;
  }

  async getLatestPayloadByUser(userId: string): Promise<Payload | undefined> {
    const [latest] = await db
      .select()
      .from(payloads2)
      .where(eq(payloads2.userId, userId))
      .orderBy(desc(payloads2.createdAt))
      .limit(1);
    return latest;
  }
}

export const storage = new DatabaseStorage();
