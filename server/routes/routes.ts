import { Express } from "express";
import OpenAI from "openai";
const client = new OpenAI();

export async function registerRoutes(app: Express): Promise<void> {
  app.get("/api/estimate", async (req, res) => {
    try {
      const response = await client.responses.create({
        model: "gpt-4.1",
        input: "Write a one-sentence bedtime story about a unicorn.",
      });

      console.log(response.output_text);
    } catch (error) {
      console.log(error);
    }
  });
}
