
import { db } from "./db";
import { eq } from "drizzle-orm";
import {chats} from "@shared/schema.ts";

const getChatSessionById = async (id:number) =>  {
    if (id) {
      const [chat] = await db.select().from(chats).where(eq(chats.id, id));
      return chat
    } else return null
  }

const updateChatHistory = async (userId: number, chatHistory: string) => {
  await db.update(chats).set({
    chat_history: JSON.stringify(chatHistory)
  }).where(eq(chats.id, userId));
};

const createChatSession = async (user:string, chatHistory:string[] ) =>{
  const [session] = await db.insert(chats).values({name:user, chat_history:JSON.stringify(chatHistory)}).returning()
  return session
}


export const storage = {
  getChatSessionById,
  updateChatHistory,
  createChatSession,
  // Add other functions here
};

