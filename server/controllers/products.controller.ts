import express from "express";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";
import { storage } from "../storage";
import { isAdmin, optionalAuth } from "../middleware/auth";
import { sanitizeSearchQuery } from "../utils/formatter";

const router = express.Router();

// Search products - must come before /:id route
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.trim() === "") {
      return res.status(200).json([]);
    }
    
    const sanitizedQuery = sanitizeSearchQuery(query);
    const products = await storage.searchProducts(sanitizedQuery);
    
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// Get similar products - must come before /:id route
router.get("/similar/:id", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const similarProducts = await storage.getSimilarProducts(productId);
    
    res.status(200).json(similarProducts);
  } catch (error) {
    next(error);
  }
});

// Get all products with optional filtering
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const { 
      gender, 
      category, 
      trending, 
      isNew,
      onSale,
      filter,
      minPrice, 
      maxPrice, 
      sizes, 
      minRating, 
      sortBy,
      limit
    } = req.query;

    // Convert query parameters to proper types
    const queryParams: any = {};
    
    if (gender) queryParams.gender = gender as string;
    if (category) queryParams.category = category as string;
    if (trending === "true") queryParams.trending = true;
    if (isNew === "true") queryParams.isNew = true;
    if (onSale === "true") queryParams.onSale = true;
    
    // Handle special filters for backward compatibility
    if (filter === "new") queryParams.isNew = true;
    if (filter === "sale") queryParams.onSale = true;
    
    if (minPrice) queryParams.minPrice = parseInt(minPrice as string);
    if (maxPrice) queryParams.maxPrice = parseInt(maxPrice as string);
    
    if (sizes) {
      queryParams.sizes = (sizes as string).split(",");
    }
    
    if (minRating) queryParams.minRating = parseFloat(minRating as string);
    if (sortBy) queryParams.sortBy = sortBy as string;
    if (limit) queryParams.limit = parseInt(limit as string);
    
    const products = await storage.getProducts(queryParams);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// Get a specific product by ID - must come after /search and /similar/:id routes
router.get("/:id", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// Create a new product (admin only)
router.post("/", isAdmin, async (req, res, next) => {
  try {
    // Validate request body
    const productData = insertProductSchema.parse(req.body);
    
    // Create product
    const newProduct = await storage.createProduct(productData);
    
    res.status(201).json(newProduct);
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

// Update a product (admin only)
router.put("/:id", isAdmin, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Validate request body
    const productData = insertProductSchema.partial().parse(req.body);
    
    // Update product
    const updatedProduct = await storage.updateProduct(productId, productData);
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(updatedProduct);
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

// Delete a product (admin only)
router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Delete product
    const deleted = await storage.deleteProduct(productId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Admin products route (includes all products for admin view)
router.get("/admin", isAdmin, async (req, res, next) => {
  try {
    const products = await storage.getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

export const productRoutes = router;
