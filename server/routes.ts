import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertEstimateRequestSchema, insertCalendarAvailabilitySchema } from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import OpenAI from "openai";

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
  
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
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
  app.get('/api/admin/contacts', isAuthenticated, async (req, res) => {
    try {
      const contacts = await storage.getContactRequests();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get('/api/admin/estimates', isAuthenticated, async (req, res) => {
    try {
      const estimates = await storage.getEstimateRequests();
      res.json(estimates);
    } catch (error) {
      console.error("Error fetching estimates:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Calendar availability routes
  app.get('/api/calendar', async (req, res) => {
    try {
      const date = req.query.date as string | undefined;
      const availability = await storage.getCalendarAvailability(date);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching calendar availability:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post('/api/admin/calendar', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCalendarAvailabilitySchema.parse(req.body);
      const availability = await storage.createCalendarAvailability(validatedData);
      res.status(201).json(availability);
    } catch (error) {
      console.error("Error creating calendar availability:", error);
      res.status(400).json({ message: "Invalid calendar availability data" });
    }
  });
  
  app.put('/api/admin/calendar/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const availability = await storage.updateCalendarAvailability(id, req.body);
      res.json(availability);
    } catch (error) {
      console.error("Error updating calendar availability:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete('/api/admin/calendar/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCalendarAvailability(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting calendar availability:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Route to create initial admin user if none exists
  app.post('/api/admin/setup', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if users exist already
      const usersExist = await storage.checkIfUsersExist();
      
      // If users already exist, only allow if authenticated as admin
      if (usersExist && !req.isAuthenticated()) {
        return res.status(403).send("Nie można utworzyć więcej kont administratora");
      }
      
      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Użytkownik o takiej nazwie już istnieje");
      }
      
      // Create admin user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword
      });
      
      res.status(201).json({ message: "Konto administratora utworzone pomyślnie", userId: user.id });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).send("Wystąpił błąd podczas tworzenia konta administratora");
    }
  });
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
      const { query, userName } = req.body;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Invalid query parameter" });
      }
      
      // Generate response using OpenAI
      const response = await generatePriceEstimate(query);
      
      // Get client IP address
      const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      
      // Store the request and response with additional info
      await storage.createEstimateRequest({
        query,
        response,
        user_name: userName || null,
        ip_address: typeof ip_address === 'string' ? ip_address : null
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
    // Log more detailed error information
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
    return "Przepraszam, mam problem z wygenerowaniem wyceny w tej chwili. Proszę spróbować ponownie później lub skontaktować się z nami bezpośrednio.";
  }
}
