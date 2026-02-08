import { saves, type Save, type InsertSave } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSaves(): Promise<Save[]>;
  getSave(id: number): Promise<Save | undefined>;
  createSave(save: InsertSave): Promise<Save>;
  deleteSave(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSaves(): Promise<Save[]> {
    return await db.select().from(saves).orderBy(desc(saves.createdAt));
  }

  async getSave(id: number): Promise<Save | undefined> {
    const [save] = await db.select().from(saves).where(eq(saves.id, id));
    return save;
  }

  async createSave(insertSave: InsertSave): Promise<Save> {
    const [save] = await db.insert(saves).values(insertSave).returning();
    return save;
  }

  async deleteSave(id: number): Promise<void> {
    await db.delete(saves).where(eq(saves.id, id));
  }
}

export const storage = new DatabaseStorage();
