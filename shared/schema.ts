import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  level: integer("level").notNull().default(1),
  hackingPoints: integer("hacking_points").notNull().default(0),
  completedLevels: jsonb("completed_levels").notNull().default([]),
  unlockedTools: jsonb("unlocked_tools").notNull().default([]),
  lastUpdated: text("last_updated").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameProgressSchema = createInsertSchema(gameProgress).pick({
  userId: true,
  level: true,
  hackingPoints: true,
  completedLevels: true,
  unlockedTools: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameProgress = typeof gameProgress.$inferSelect;
