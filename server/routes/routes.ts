import { Express } from "express";
import estimate from "./estimate";
import calendar from "./calendar";
import services from "./services";

export async function registerRoutes(app: Express): Promise<void> {
  app.use("/api/estimate", estimate);
  app.use("/api/calendar", calendar)
  app.use("/api/services", services)
}
