import { 
  users, 
  contactRequests, 
  estimateRequests, 
  type User, 
  type InsertUser, 
  type ContactRequest, 
  type InsertContactRequest,
  type EstimateRequest,
  type InsertEstimateRequest
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
  
  createEstimateRequest(request: InsertEstimateRequest): Promise<EstimateRequest>;
  getEstimateRequests(): Promise<EstimateRequest[]>;
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
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
