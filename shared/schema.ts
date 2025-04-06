import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
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
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  user_name: text("user_name").notNull(),
  started_at: timestamp("started_at").defaultNow(),
  chat_history: text("chat_history").notNull(), // JSON stringified chat history
  total_messages: integer("total_messages").default(0),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  user_name: true,
  chat_history: true,
  total_messages: true,
});

export const estimateRequests = pgTable("estimate_requests", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  user_name: text("user_name"),
  created_at: text("created_at").notNull(),
  ip_address: text("ip_address"),
  chat_session_id: integer("chat_session_id").references(() => chatSessions.id),
});

export const insertEstimateRequestSchema = createInsertSchema(estimateRequests).pick({
  query: true,
  response: true,
  user_name: true,
  ip_address: true,
  chat_session_id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;

export const calendarAvailability = pgTable("calendar_availability", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  status: text("status").notNull().default("niedostepny"), // "dostepny", "zajety", or "niedostepny"
  created_at: timestamp("created_at").defaultNow(),
  updated_by: integer("updated_by").references(() => users.id),
});

export const insertCalendarAvailabilitySchema = createInsertSchema(calendarAvailability).pick({
  date: true,
  status: true,
  updated_by: true,
});

export type EstimateRequest = typeof estimateRequests.$inferSelect;
export type InsertEstimateRequest = z.infer<typeof insertEstimateRequestSchema>;

export type CalendarAvailability = typeof calendarAvailability.$inferSelect;
export type InsertCalendarAvailability = z.infer<typeof insertCalendarAvailabilitySchema>;

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
