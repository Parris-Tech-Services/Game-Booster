import { saves, type Save, type InsertSave } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getSaves(): Promise<Save[]>;
  getSave(id: number): Promise<Save | undefined>;
  createSave(save: InsertSave): Promise<Save>;
  deleteSave(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSaves(): Promise<Save[]> {
    const { db } = await import("./db");
    return await db.select().from(saves).orderBy(desc(saves.createdAt));
  }

  async getSave(id: number): Promise<Save | undefined> {
    const { db } = await import("./db");
    const [save] = await db.select().from(saves).where(eq(saves.id, id));
    return save;
  }

  async createSave(insertSave: InsertSave): Promise<Save> {
    const { db } = await import("./db");
    const [save] = await db.insert(saves).values(insertSave).returning();
    return save;
  }

  async deleteSave(id: number): Promise<void> {
    const { db } = await import("./db");
    await db.delete(saves).where(eq(saves.id, id));
  }
}

class FileStorage implements IStorage {
  private filePath: string;

  constructor() {
    // store under server/data/saves.json so it's next to server code
    this.filePath = path.join(process.cwd(), "server", "data", "saves.json");
  }

  private async ensureDir() {
    const dir = path.dirname(this.filePath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (e) {
      // ignore
    }
  }

  private async readAll(): Promise<Save[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const data = JSON.parse(raw) as Save[];
      return data;
    } catch (e) {
      return [];
    }
  }

  private async writeAll(items: Save[]) {
    await this.ensureDir();
    await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), "utf8");
  }

  async getSaves(): Promise<Save[]> {
    const items = await this.readAll();
    // sort by createdAt desc if possible
    return items.sort((a, b) => {
      const ta = new Date(a.createdAt as any).getTime();
      const tb = new Date(b.createdAt as any).getTime();
      return tb - ta;
    });
  }

  async getSave(id: number): Promise<Save | undefined> {
    const items = await this.readAll();
    return items.find((s) => s.id === id);
  }

  async createSave(insertSave: InsertSave): Promise<Save> {
    const items = await this.readAll();
    const id = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const createdAt = new Date().toISOString();
    const save: any = { id, ...insertSave, createdAt } as Save;
    items.push(save);
    await this.writeAll(items);
    return save;
  }

  async deleteSave(id: number): Promise<void> {
    const items = await this.readAll();
    const filtered = items.filter((s) => s.id !== id);
    await this.writeAll(filtered);
  }
}

export const storage: IStorage = process.env.DATABASE_URL ? new DatabaseStorage() : new FileStorage();
