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

export const estimateRequests = pgTable("estimate_requests", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  user_name: text("user_name"),
  created_at: text("created_at").notNull(),
  ip_address: text("ip_address"),
});

export const insertEstimateRequestSchema = createInsertSchema(estimateRequests).pick({
  query: true,
  response: true,
  user_name: true,
  ip_address: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;

export const calendarAvailability = pgTable("calendar_availability", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  start_time: text("start_time").notNull(),
  end_time: text("end_time").notNull(),
  is_available: boolean("is_available").notNull().default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertCalendarAvailabilitySchema = createInsertSchema(calendarAvailability).pick({
  date: true,
  start_time: true,
  end_time: true,
  is_available: true,
});

export type EstimateRequest = typeof estimateRequests.$inferSelect;
export type InsertEstimateRequest = z.infer<typeof insertEstimateRequestSchema>;

export type CalendarAvailability = typeof calendarAvailability.$inferSelect;
export type InsertCalendarAvailability = z.infer<typeof insertCalendarAvailabilitySchema>;
