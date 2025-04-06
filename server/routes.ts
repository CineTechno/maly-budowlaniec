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
      Here's our service pricing (all prices in Polish Zloty - zł):
      - Podstawowe usługi: 90 zł za godzinę
      - Naprawa płyt gipsowo-kartonowych: 200 zł za miejsce
      - Układanie płytek: 120 zł za m²
      - Remont kuchni: 20 000 zł (od)
      - Remont łazienki: 15 000 zł (od)
      - Montaż oświetlenia: 150 zł za punkt
      - Montaż ogrodzenia: 200 zł za mb
      - Budowa tarasu: 400 zł za m²
      - Malowanie wnętrz: 30 zł za m²
      - Montaż szafek: 250 zł za szafkę
      - Wymiana drzwi wewnętrznych: 350 zł za sztukę
      - Wymiana okien: 800 zł za m²
      - Instalacja elektryczna: 100 zł za punkt
      - Instalacja hydrauliczna: 150 zł za punkt
      - Montaż paneli podłogowych: 60 zł za m²
      - Układanie parkietu: 120 zł za m²
      - Wyburzanie ścian: 300 zł za m²
      - Tynkowanie: 70 zł za m²
    `;
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Jesteś asystentem wycen dla polskiej firmy remontowo-budowlanej "BudTeam". Twoim zadaniem jest dostarczanie wycen projektów remontowych i budowlanych na podstawie opisu klienta.
          
          ${serviceInfo}
          
          W odpowiedzi zawsze:
          1. Pokaż listę usług potrzebnych do wykonania zadania w formie tabeli: "Usługa: Cena × Ilość = Koszt całkowity"
          2. Po liście usług, podaj łączny koszt wszystkich prac, np. "SUMA: 1245 zł"
          3. Jeśli klient nie podał wystarczających informacji, poproś o szczegóły potrzebne do dokładnej wyceny
          4. Bądź uprzejmy i profesjonalny. Nie podawaj wycen usług spoza naszego zakresu
          5. Zawsze używaj złotych (zł) jako jednostki walutowej
          6. Komunikuj się wyłącznie po polsku
          
          Odpowiedź musi zawierać listę potrzebnych usług, jedna pod drugą, z cenami i obliczeniem łącznego kosztu (cena × ilość), a na końcu SUMĘ wszystkich kosztów.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
    });
    
    return completion.choices[0].message.content || "Przepraszam, nie mogłem wygenerować wyceny. Proszę skontaktować się z nami bezpośrednio, aby uzyskać spersonalizowaną ofertę.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Przepraszam, mam problem z wygenerowaniem wyceny w tej chwili. Proszę spróbować ponownie później lub skontaktować się z nami bezpośrednio.";
  }
}
