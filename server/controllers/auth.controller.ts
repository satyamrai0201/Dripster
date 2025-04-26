import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { storage } from "../storage";

const router = express.Router();

// Login validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register validation schema
const registerSchema = insertUserSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// User authentication status
router.get("/status", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json(null);
  }
  
  // Return user info (exclude password)
  const user = { ...req.user } as any;
  delete user.password;
  
  res.status(200).json(user);
});

// User login
router.post("/login", async (req, res, next) => {
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);
    
    // Use passport for authentication
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid email or password" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Return user info (exclude password)
        const userResponse = { ...user };
        delete userResponse.password;
        
        return res.status(200).json(userResponse);
      });
    })(req, res, next);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: error.errors 
      });
    }
    next(error);
  }
});

// User registration
router.post("/register", async (req, res, next) => {
  try {
    // Validate request body
    const { name, email, password } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await storage.createUser({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });
    
    // Auto login after registration
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      
      // Return user info (exclude password)
      const userResponse = { ...newUser };
      delete userResponse.password;
      
      return res.status(201).json(userResponse);
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: error.errors 
      });
    }
    next(error);
  }
});

// User logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Google OAuth routes
router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"] 
}));

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

export const authRoutes = router;
