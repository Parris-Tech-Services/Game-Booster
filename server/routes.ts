import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get(api.saves.list.path, async (req, res) => {
    const saves = await storage.getSaves();
    res.json(saves);
  });

  app.post(api.saves.create.path, async (req, res) => {
    try {
      const input = api.saves.create.input.parse(req.body);
      const save = await storage.createSave(input);
      res.status(201).json(save);
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", details: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.saves.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const save = await storage.getSave(id);
    if (!save) return res.status(404).json({ message: "Save not found" });
    res.json(save);
  });

  app.delete(api.saves.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteSave(id);
    res.status(204).send();
  });

  return httpServer;
}
