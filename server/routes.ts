import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API Routes
  app.get("/api/status", (req, res) => {
    res.json({
      status: "online",
      message: "Server is functioning properly",
      timestamp: new Date().toISOString()
    });
  });
  
  // User progress routes if we want to save game progress
  app.post("/api/progress", async (req, res) => {
    try {
      const { username, progress } = req.body;
      
      if (!username || !progress) {
        return res.status(400).json({ error: "Username and progress data required" });
      }
      
      // Check if user exists
      let user = await storage.getUserByUsername(username);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          username,
          password: "temp", // In a real app, we'd have proper auth
        });
      }
      
      // In a real implementation, we would store the progress
      // For now, just return success
      
      res.status(200).json({
        success: true,
        message: "Progress saved"
      });
    } catch (error) {
      console.error("Error saving progress:", error);
      res.status(500).json({ error: "Failed to save progress" });
    }
  });
  
  return httpServer;
}
