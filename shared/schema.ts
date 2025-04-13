
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import {sql} from "drizzle-orm";


export const contactRequests = sqliteTable("contact_requests", {
  id: integer("id", ).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service"),
  message: text("message").notNull(),
  created_at: text("created_at").notNull(),
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).pick({
  name: true,
  email: true,
  phone: true,
  service: true,
  message: true,
});

// Chat sessions table to store complete conversations

export const chats = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  chat_history: text("chat_history")
});

export const insertChatSchema = createInsertSchema(chats).pick({
  name:true,
  chat_history: true
})


export type chats = typeof chats.$inferSelect;
export type InsertUser = z.infer<typeof insertChatSchema>;

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;




export const calendarAvailability = sqliteTable("calendar_availability", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  status: text("status").notNull().default("niedostepny"), // "dostepny", "zajety", or "niedostepny"
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_by: integer("updated_by").references(() => users.id),
});

export const insertCalendarAvailabilitySchema = createInsertSchema(calendarAvailability).pick({
  date: true,
  status: true,
  updated_by: true,
});


