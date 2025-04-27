import { Express } from "express";
import estimate from "./estimate";

export async function registerRoutes(app: Express): Promise<void> {
  app.use("/api/estimate", estimate);
}
