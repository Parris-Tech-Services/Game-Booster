import { pgTable, text, serial, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const saves = pgTable("saves", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").notNull(), // Stores the entire game state
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSaveSchema = createInsertSchema(saves).omit({ id: true, createdAt: true });
export type InsertSave = z.infer<typeof insertSaveSchema>;
export type Save = typeof saves.$inferSelect;
