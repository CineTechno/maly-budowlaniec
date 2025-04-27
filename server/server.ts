import express from "express";
import { createServer as createViteServer } from "vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes/routes";
import dotenv from "dotenv";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./server/.env" });
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function startServer() {
  const app = express();
  app.use(express.json());
  registerRoutes(app);

  if (process.env.NODE_ENV === "production") {
    // Serve static files from dist
    app.use(express.static(path.resolve(__dirname, "../client/dist")));

    app.get("*", (_, res) => {
      res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
    });
  }

  app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
  });
}

startServer();
