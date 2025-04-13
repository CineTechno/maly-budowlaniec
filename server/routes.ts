import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertCalendarAvailabilitySchema } from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import OpenAI, {ChatCompletionMessageParam} from "openai";
import 'dotenv/config'

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Log OpenAI availability for debugging
console.log("OpenAI API Key available:", !!process.env.OPENAI_API_KEY);

// Helper functions for password hashing
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'maly-budowlaniec-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // passport.use(new LocalStrategy(async (username, password, done) => {
  //   try {
  //     const user = await storage.getUserByUsername(username);
  //     if (!user || !(await comparePasswords(password, user.password))) {
  //       return done(null, false);
  //     }
  //     return done(null, user);
  //   } catch (err) {
  //     return done(err);
  //   }
  // }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // passport.deserializeUser(async (id: number, done) => {
  //   try {
  //     const user = await storage.getUser(id);
  //     done(null, user);
  //   } catch (err) {
  //     done(err);
  //   }
  // });
  
  // Authentication routes
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true, user: req.user });
  });
  
  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.json({ success: true });
    });
  });
  
  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isAuthenticated: true, user: req.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  
  // Admin routes
  // app.get('/api/admin/contacts', isAuthenticated, async (req, res) => {
  //   try {
  //     const contacts = await storage.getContactRequests();
  //     res.json(contacts);
  //   } catch (error) {
  //     console.error("Error fetching contacts:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  //
  // app.get('/api/admin/estimates', isAuthenticated, async (req, res) => {
  //   try {
  //     const estimates = await storage.getEstimateRequests();
  //     res.json(estimates);
  //   } catch (error) {
  //     console.error("Error fetching estimates:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  //
  // app.get('/api/admin/chat-sessions', isAuthenticated, async (req, res) => {
  //   try {
  //     const chatSessions = await storage.getAllChatSessions();
  //     res.json(chatSessions);
  //   } catch (error) {
  //     console.error("Error fetching chat sessions:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  
  // // Calendar availability routes
  // app.get('/api/calendar', async (req, res) => {
  //   try {
  //     const date = req.query.date as string | undefined;
  //     const availability = await storage.getCalendarAvailability(date);
  //     res.json(availability);
  //   } catch (error) {
  //     console.error("Error fetching calendar availability:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  //
  // app.post('/api/admin/calendar', isAuthenticated, async (req, res) => {
  //   try {
  //     const validatedData = insertCalendarAvailabilitySchema.parse(req.body);
  //     const availability = await storage.createCalendarAvailability(validatedData);
  //     res.status(201).json(availability);
  //   } catch (error) {
  //     console.error("Error creating calendar availability:", error);
  //     res.status(400).json({ message: "Invalid calendar availability data" });
  //   }
  // });
  
  // app.put('/api/admin/calendar/:id', isAuthenticated, async (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     const availability = await storage.updateCalendarAvailability(id, req.body);
  //     res.json(availability);
  //   } catch (error) {
  //     console.error("Error updating calendar availability:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  //
  // app.delete('/api/admin/calendar/:id', isAuthenticated, async (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id);
  //     await storage.deleteCalendarAvailability(id);
  //     res.status(204).send();
  //   } catch (error) {
  //     console.error("Error deleting calendar availability:", error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  
  // Route to create initial admin user if none exists
  app.post('/api/admin/setup', async (req, res) => {
    try {
      const {username, password} = req.body;

      // // Check if users exist already
      // const usersExist = await storage.checkIfUsersExist();
      //
      // // If users already exist, only allow if authenticated as admin
      // if (usersExist && !req.isAuthenticated()) {
      //   return res.status(403).send("Nie można utworzyć więcej kont administratora");
      // }
      //
      // // Check if username exists
      // const existingUser = await storage.getUserByUsername(username);
      // if (existingUser) {
      //   return res.status(400).send("Użytkownik o takiej nazwie już istnieje");
      // }
      //
      // // Create admin user
      // const hashedPassword = await hashPassword(password);
      // const user = await storage.createUser({
      //   username,
      //   password: hashedPassword
      // });

      //     res.status(201).json({ message: "Konto administratora utworzone pomyślnie", userId: user.id });
      //   } catch (error) {
      //     console.error("Error creating admin user:", error);
      //     res.status(500).send("Wystąpił błąd podczas tworzenia konta administratora");
      //   }
      // });
      // Contact form submission
      // app.post("/api/contact", async (req, res) => {
      //   try {
      //     const validatedData = insertContactRequestSchema.parse(req.body);
      //     const contactRequest = await storage.createContactRequest(validatedData);
      //     res.status(201).json({ message: "Contact request received", id: contactRequest.id });
      //   } catch (error) {
      //     console.error("Error creating contact request:", error);
      //     res.status(400).json({ message: "Invalid contact request data" });
      //   }
      // });

      app.put("/api/test", async (req, res) => {
        try {
          console.log("test");
          res.status(200).json({message: "API test successful"});
        } catch (e) {
          res.status(500).json({error: e.message});
        }
      });

      // Chat session routes

      app.put("/api/new-user", async (req, res, next) => {
        try {

        } catch (e) {
        }
      })


      // app.get("/api/chat-session/:userName", async (req, res) => {
      //   try {
      //     const userName = req.params.userName;
      //     const chatSession = await storage.getChatSessionById(userName);
      //
      //     if (!chatSession) {
      //       return res.status(404).json({ message: "Chat session not found" });
      //     }
      //
      //     res.json(chatSession);
      //   } catch (error) {
      //     console.error("Error fetching chat session:", error);
      //     res.status(500).json({ message: "Server error" });
      //   }
      // });

      app.put("/api/chat-session/:id", async (req, res) => {
        try {
          const id = parseInt(req.params.id);
          const {chatHistory, totalMessages} = req.body;

          if (!chatHistory || typeof chatHistory !== "string" || !totalMessages || typeof totalMessages !== "number") {
            return res.status(400).json({message: "Invalid chat session data"});
          }

          const chatSession = await storage.updateChatHistory(id, chatHistory, totalMessages);
          res.json(chatSession);
        } catch (error) {
          console.error("Error updating chat session:", error);
          res.status(500).json({message: "Server error"});
        }
      });

      // AI price estimator endpoint
      app.post("/api/estimate", async (req, res) => {
            let userId = null;
            try {
              const {query, userName, chatHistory, id} = req.body;

              if (!query || typeof query !== "string") {
                return res.status(400).json({message: "Invalid query parameter"});
              }

              if (!userName || typeof userName !== "string") {
                return res.status(400).json({message: "Imię jest wymagane"}); // Name is required
              }

              userId = id;
              let existingChatSession = await storage.getChatSessionById(id);

              // If user has an existing chat session, use it
              if (existingChatSession) {

                await storage.updateChatHistory(
                    existingChatSession.id,
                    chatHistory
                );
              } else {
                // Create a new chat session

                const newChatSession = await storage.createChatSession(
                    userName, chatHistory
                );

                userId = newChatSession.id

              }


              // Generate response using OpenAI with chat history
              const response = await generatePriceEstimate(query, chatHistory);

              // Store the request and response with additional info

              const fullUpdatedHistory = [...chatHistory, {role: "assistant", content: response}];

              await storage.updateChatHistory(
                  userId, fullUpdatedHistory
              );

              res.status(200).json({response, userId: userId});
            } catch (error) {
              console.error("Error generating estimate:", error);
              res.status(500).json({message: "Error generating estimate"});
            }
          }
      );
      const server = createServer(app);
      return server;
    }


    async function generatePriceEstimate(query: string, chatHistory: string[]): Promise<string> {

      // Set up pricing data to ground the model's responses in realistic pricing
      const serviceInfo = `
      Here's our service pricing (all prices in Polish Zloty - zł):
      { id: 1, service: "Podstawowe usługi", price: "90 zł", unit: "za godzinę", category: "podstawowe" },
    { id: 2, service: "Naprawa płyt gipsowo-kartonowych", price: "200 zł", unit: "za miejsce", category: "podstawowe" },
    { id: 3, service: "Montaż oświetlenia", price: "150 zł", unit: "za punkt", category: "podstawowe" },
    { id: 4, service: "Malowanie wnętrz", price: "30 zł", unit: "za m²", category: "podstawowe" },
    { id: 5, service: "Montaż szafek", price: "250 zł", unit: "za szafkę", category: "podstawowe" },
    { id: 6, service: "Naprawa zamków", price: "120 zł", unit: "za sztukę", category: "podstawowe" },
    { id: 7, service: "Montaż karniszy", price: "80 zł", unit: "za sztukę", category: "podstawowe" },
    { id: 8, service: "Wymiana gniazdek/włączników", price: "60 zł", unit: "za sztukę", category: "podstawowe" },

    // Kuchnie i łazienki
    { id: 9, service: "Remont kuchni (mała)", price: "10 000 zł", unit: "10m2", category: "kuchnie-lazienki" },
    { id: 10, service: "Remont kuchni (duża)", price: "20 000 zł", unit: "20m2", category: "kuchnie-lazienki" },
    { id: 11, service: "Remont łazienki (mała)", price: "8 000 zł", unit: "6m2", category: "kuchnie-lazienki" },
    { id: 12, service: "Remont łazienki (duża)", price: "15 000 zł", unit: "12m2", category: "kuchnie-lazienki" },
    { id: 13, service: "Montaż kabiny prysznicowej", price: "500 zł", unit: "2m2", category: "kuchnie-lazienki" },
    { id: 14, service: "Montaż wanny", price: "450 zł", unit: "1", category: "kuchnie-lazienki" },
    { id: 15, service: "Montaż umywalki", price: "300 zł", unit: "1", category: "kuchnie-lazienki" },
    { id: 16, service: "Montaż toalety", price: "350 zł", unit: "1", category: "kuchnie-lazienki" },

    // Prace wykończeniowe
    { id: 17, service: "Układanie płytek", price: "120 zł", unit: "za m²", category: "wykonczeniowe" },
    { id: 18, service: "Wymiana drzwi wewnętrznych", price: "350 zł", unit: "za sztukę", category: "wykonczeniowe" },
    { id: 19, service: "Wymiana okien", price: "800 zł", unit: "za m²", category: "wykonczeniowe" },
    { id: 20, service: "Montaż paneli podłogowych", price: "60 zł", unit: "za m²", category: "wykonczeniowe" },
    { id: 21, service: "Układanie parkietu", price: "120 zł", unit: "za m²", category: "wykonczeniowe" },
    { id: 22, service: "Tynkowanie", price: "70 zł", unit: "za m²", category: "wykonczeniowe" },
    { id: 23, service: "Szpachlowanie", price: "40 zł", unit: "za m²", category: "wykonczeniowe" },
    { id: 24, service: "Tapetowanie", price: "50 zł", unit: "za m²", category: "wykonczeniowe" },

    // Instalacje
    { id: 25, service: "Instalacja elektryczna", price: "100 zł", unit: "za punkt", category: "instalacje" },
    { id: 26, service: "Instalacja hydrauliczna", price: "150 zł", unit: "za punkt", category: "instalacje" },
    { id: 27, service: "Montaż ogrzewania podłogowego", price: "200 zł", unit: "za m²", category: "instalacje" },
    { id: 28, service: "Wymiana grzejników", price: "300 zł", unit: "za sztukę", category: "instalacje" },
    { id: 29, service: "Instalacja odkurzacza centralnego", price: "3 000 zł", unit: "od", category: "instalacje" },
    { id: 30, service: "Instalacja klimatyzacji", price: "3 500 zł", unit: "od", category: "instalacje" },

    // Prace zewnętrzne
    { id: 31, service: "Montaż ogrodzenia", price: "200 zł", unit: "za mb", category: "zewnetrzne" },
    { id: 32, service: "Budowa tarasu", price: "400 zł", unit: "za m²", category: "zewnetrzne" },
    { id: 33, service: "Układanie kostki brukowej", price: "150 zł", unit: "za m²", category: "zewnetrzne" },
    { id: 34, service: "Montaż rynien", price: "90 zł", unit: "za mb", category: "zewnetrzne" },
    { id: 35, service: "Montaż drzwi zewnętrznych", price: "700 zł", unit: "za sztukę", category: "zewnetrzne" },
    { id: 36, service: "Instalacja oświetlenia ogrodowego", price: "150 zł", unit: "za punkt", category: "zewnetrzne" }
    `;

      // Prepare message array for the API call
      const systemMessage = {
        role: "system" as const,
        content: `Jesteś asystentem wycen dla polskiej firmy remontowo-budowlanej "Mały Budowlaniec". Twoim zadaniem jest dostarczanie wycen projektów remontowych i budowlanych na podstawie opisu klienta.
      
      ${serviceInfo}
      
      W odpowiedzi zawsze:
      1. Pamiętaj wszystkie informacje podane wcześniej przez klienta, łącz je i twórz kompletny obraz projektu
      2. Pokaż listę usług potrzebnych do wykonania zadania w formie tabeli: "Usługa: Cena × Ilość = Koszt całkowity"
      3. Po liście usług, podaj łączny koszt wszystkich prac, np. "SUMA: 1245 zł"
      4. Jeśli klient nie podał wystarczających informacji, poproś o konkretne szczegóły potrzebne do dokładnej wyceny
      5. Bądź uprzejmy i profesjonalny. Nie podawaj wycen usług spoza naszego zakresu
      6. Zawsze używaj złotych (zł) jako jednostki walutowej
      7. Komunikuj się wyłącznie po polsku
      8. Jeśli masz już wszystkie potrzebne informacje, podaj wycenę nawet jeśli klient dodał tylko małą ilość dodatkowych danych
      
      Odpowiedź musi zawierać listę potrzebnych usług, jedna pod drugą, z cenami i obliczeniem łącznego kosztu (cena × ilość), a na końcu SUMĘ wszystkich kosztów.`
      };

      // Create an array with the appropriate OpenAI message structure
      const messages: ChatCompletionMessageParam[] = [
        systemMessage,
        ...chatHistory,
        {role: "user", content: query} // ✅ now it's valid
      ];

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          max_tokens: 500,
        });

        return completion.choices[0]?.message?.content ?? "Unable to generate a price estimate at this time.";
      } catch (error) {
        console.error("Error generating price estimate:", error);
        return "An error occurred while generating the price estimate.";
      }
    }

