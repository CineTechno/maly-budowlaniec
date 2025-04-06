import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertEstimateRequestSchema } from "@shared/schema";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sample_key" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(validatedData);
      res.status(201).json({ message: "Contact request received", id: contactRequest.id });
    } catch (error) {
      console.error("Error creating contact request:", error);
      res.status(400).json({ message: "Invalid contact request data" });
    }
  });
  
  // AI price estimator endpoint
  app.post("/api/estimate", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Invalid query parameter" });
      }
      
      // Generate response using OpenAI
      const response = await generatePriceEstimate(query);
      
      // Store the request and response
      await storage.createEstimateRequest({
        query,
        response
      });
      
      res.status(200).json({ response });
    } catch (error) {
      console.error("Error generating estimate:", error);
      res.status(500).json({ message: "Error generating estimate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generatePriceEstimate(query: string): Promise<string> {
  try {
    // Set up pricing data to ground the model's responses in realistic pricing
    const serviceInfo = `
      Here's our service pricing:
      - Basic Handyman Services: $75 per hour
      - Drywall Repair: $150 per patch
      - Tile Installation: $12 per sq ft
      - Kitchen Remodel: $5,000+ depending on size and materials
      - Bathroom Remodel: $3,500+ depending on fixtures and extent of work
      - Light Fixture Installation: $85 per fixture
      - Fence Installation: $25 per linear ft
      - Deck Building: $35 per sq ft
      - Interior Painting: $2.50 per sq ft
      - Cabinet Installation: $100 per cabinet
    `;
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for a handyman and building service company named HandyPro. Your role is to provide price estimates for home improvement and repair projects based on the client's description. 
          
          ${serviceInfo}
          
          Give a reasonable price range based on the information provided. If the client doesn't provide enough information, ask for the necessary details to give an accurate estimate. Be friendly and professional. Don't provide estimates for services outside our scope. Always invite them to contact us for a detailed quote.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 300,
    });
    
    return completion.choices[0].message.content || "I'm sorry, I couldn't generate an estimate. Please contact us directly for a personalized quote.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "I apologize, but I'm having trouble generating an estimate right now. Please try again later or contact us directly for a personalized quote.";
  }
}
