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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
  
  createEstimateRequest(request: InsertEstimateRequest): Promise<EstimateRequest>;
  getEstimateRequests(): Promise<EstimateRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactRequests: Map<number, ContactRequest>;
  private estimateRequests: Map<number, EstimateRequest>;
  
  userCurrentId: number;
  contactRequestCurrentId: number;
  estimateRequestCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contactRequests = new Map();
    this.estimateRequests = new Map();
    
    this.userCurrentId = 1;
    this.contactRequestCurrentId = 1;
    this.estimateRequestCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = this.contactRequestCurrentId++;
    const created_at = new Date().toISOString();
    const contactRequest: ContactRequest = { ...insertRequest, id, created_at };
    this.contactRequests.set(id, contactRequest);
    return contactRequest;
  }
  
  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }
  
  async createEstimateRequest(insertRequest: InsertEstimateRequest): Promise<EstimateRequest> {
    const id = this.estimateRequestCurrentId++;
    const created_at = new Date().toISOString();
    const estimateRequest: EstimateRequest = { ...insertRequest, id, created_at };
    this.estimateRequests.set(id, estimateRequest);
    return estimateRequest;
  }
  
  async getEstimateRequests(): Promise<EstimateRequest[]> {
    return Array.from(this.estimateRequests.values());
  }
}

export const storage = new MemStorage();
