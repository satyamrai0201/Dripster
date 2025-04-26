import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import passport from "passport";
import session from "express-session";
import { authRoutes } from "./controllers/auth.controller";
import { productRoutes } from "./controllers/products.controller";
import { orderRoutes } from "./controllers/orders.controller";
import { wishlistRoutes } from "./controllers/wishlist.controller";
import { wardrobeRoutes } from "./controllers/wardrobe.controller";
import { isAuthenticated, isAdmin } from "./middleware/auth";
import MemoryStore from "memorystore";

// Initialize passport configuration
import "./config/passport";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dripster-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // API Routes
  const apiRouter = express.Router();
  
  // Auth routes
  apiRouter.use("/auth", authRoutes);
  
  // Product routes
  apiRouter.use("/products", productRoutes);
  
  // Order routes - require authentication
  apiRouter.use("/orders", isAuthenticated, orderRoutes);
  
  // Wishlist routes - require authentication
  apiRouter.use("/wishlist", isAuthenticated, wishlistRoutes);
  
  // Wardrobe routes - require authentication
  apiRouter.use("/wardrobe", isAuthenticated, wardrobeRoutes);

  // Prefix all routes with /api
  app.use("/api", apiRouter);

  // Health check route
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
