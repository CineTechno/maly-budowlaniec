import { 
  users, 
  contactRequests, 
  estimateRequests, 
  calendarAvailability,
  chatSessions,
  type User, 
  type InsertUser, 
  type ContactRequest, 
  type InsertContactRequest,
  type EstimateRequest,
  type InsertEstimateRequest,
  type CalendarAvailability,
  type InsertCalendarAvailability,
  type ChatSession,
  type InsertChatSession
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  checkIfUsersExist(): Promise<boolean>;
  
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
  
  createEstimateRequest(request: InsertEstimateRequest): Promise<EstimateRequest>;
  getEstimateRequests(): Promise<EstimateRequest[]>;
  
  getCalendarAvailability(date?: string): Promise<CalendarAvailability[]>;
  createCalendarAvailability(availability: InsertCalendarAvailability): Promise<CalendarAvailability>;
  updateCalendarAvailability(id: number, availability: Partial<InsertCalendarAvailability>): Promise<CalendarAvailability>;
  deleteCalendarAvailability(id: number): Promise<void>;
  
  // Chat sessions methods
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionByUserName(userName: string): Promise<ChatSession | undefined>;
  updateChatSession(id: number, chatHistory: string, totalMessages: number): Promise<ChatSession>;
  getAllChatSessions(): Promise<ChatSession[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async checkIfUsersExist(): Promise<boolean> {
    const result = await db.select().from(users).limit(1);
    return result.length > 0;
  }
  
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const created_at = new Date().toISOString();
    const [contactRequest] = await db
      .insert(contactRequests)
      .values({
        ...insertRequest,
        created_at
      })
      .returning();
    return contactRequest;
  }
  
  async getContactRequests(): Promise<ContactRequest[]> {
    return await db.select().from(contactRequests);
  }
  
  async createEstimateRequest(insertRequest: InsertEstimateRequest): Promise<EstimateRequest> {
    const created_at = new Date().toISOString();
    const [estimateRequest] = await db
      .insert(estimateRequests)
      .values({
        ...insertRequest,
        created_at
      })
      .returning();
    return estimateRequest;
  }
  
  async getEstimateRequests(): Promise<EstimateRequest[]> {
    return await db.select().from(estimateRequests);
  }
  
  async getCalendarAvailability(date?: string): Promise<CalendarAvailability[]> {
    if (date) {
      return await db.select().from(calendarAvailability).where(eq(calendarAvailability.date, date));
    }
    return await db.select().from(calendarAvailability);
  }
  
  async createCalendarAvailability(availability: InsertCalendarAvailability): Promise<CalendarAvailability> {
    const [result] = await db
      .insert(calendarAvailability)
      .values(availability)
      .returning();
    return result;
  }
  
  async updateCalendarAvailability(id: number, availability: Partial<InsertCalendarAvailability>): Promise<CalendarAvailability> {
    const [result] = await db
      .update(calendarAvailability)
      .set(availability)
      .where(eq(calendarAvailability.id, id))
      .returning();
    return result;
  }
  
  async deleteCalendarAvailability(id: number): Promise<void> {
    await db
      .delete(calendarAvailability)
      .where(eq(calendarAvailability.id, id));
  }
  
  // Chat session methods implementation
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [result] = await db
      .insert(chatSessions)
      .values(session)
      .returning();
    return result;
  }
  
  async getChatSessionByUserName(userName: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.user_name, userName));
    return session || undefined;
  }
  
  async updateChatSession(id: number, chatHistory: string, totalMessages: number): Promise<ChatSession> {
    const [result] = await db
      .update(chatSessions)
      .set({
        chat_history: chatHistory,
        total_messages: totalMessages
      })
      .where(eq(chatSessions.id, id))
      .returning();
    return result;
  }
  
  async getAllChatSessions(): Promise<ChatSession[]> {
    return await db.select().from(chatSessions);
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
