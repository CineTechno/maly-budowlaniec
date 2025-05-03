import { Express } from "express";
import estimate from "./estimate";
import calendar from "./calendar";

export async function registerRoutes(app: Express): Promise<void> {
  app.use("/api/estimate", estimate);
  app.use("/api/calendar", calendar)
}
