import express, { type Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes"; // ✅ Single import
import { setupVite, serveStatic, log } from "./vite";
import connectDB from "./db"; // ✅ MongoDB-only DB connection

// Load environment variables first
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const MONGO_INIT_TIMEOUT = 10000; // 10 seconds

    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("MongoDB initialization timeout")), MONGO_INIT_TIMEOUT);
    });

    try {
      await Promise.race([connectDB(), timeout]);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      console.warn("⚠️  Continuing without MongoDB - using in-memory storage");
    }

    // Register all routes
    await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("Server error:", err);
    });

    // Setup Vite (only in development)
    if (app.get("env") === "development") {
      const server = await registerRoutes(app);
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    const port = 5001;
    app.listen(port, () => {
      log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Server initialization failed:", error);
    process.exit(1);
  }
})();