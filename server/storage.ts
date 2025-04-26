import { users, products, orders, wishlist, wardrobe, addresses } from "@shared/schema";
import type { 
  User, InsertUser, 
  Product, InsertProduct, 
  Order, InsertOrder,
  WishlistItem, InsertWishlistItem,
  WardrobeItem, InsertWardrobeItem,
  Address, InsertAddress
} from "@shared/schema";
import { Gender, ProductCategory, Size } from "../client/src/types";
import { getProductsData } from "./data/products";

// Define the storage interface with all needed methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Product methods
  getProducts(params?: {
    gender?: Gender,
    category?: ProductCategory,
    trending?: boolean,
    isNew?: boolean,
    onSale?: boolean,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
    sizes?: Size[],
    minRating?: number,
    sortBy?: string
  }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  getSimilarProducts(productId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Wishlist methods
  getWishlistItems(userId: number): Promise<Product[]>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;
  
  // Wardrobe methods
  getWardrobeItems(userId: number): Promise<Product[]>;
  addToWardrobe(wardrobeItem: InsertWardrobeItem): Promise<WardrobeItem>;
  
  // Address methods
  getUserAddresses(userId: number): Promise<Address[]>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, addressData: Partial<Address>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private wishlistItems: Map<number, WishlistItem>;
  private wardrobeItems: Map<number, WardrobeItem>;
  private addresses: Map<number, Address>;
  
  private nextUserId: number;
  private nextProductId: number;
  private nextOrderId: number;
  private nextWishlistId: number;
  private nextWardrobeId: number;
  private nextAddressId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.wishlistItems = new Map();
    this.wardrobeItems = new Map();
    this.addresses = new Map();
    
    this.nextUserId = 1;
    this.nextProductId = 1;
    this.nextOrderId = 1;
    this.nextWishlistId = 1;
    this.nextWardrobeId = 1;
    this.nextAddressId = 1;
    
    // Seed the database with products
    this.seedProducts();
    
    // Create an admin user
    this.createUser({
      name: "Admin User",
      email: "admin@dripster.com",
      password: "admin123",
      role: "admin"
    });
  }
  
  // Seed products data
  private seedProducts() {
    const productsData = getProductsData();
    
    // Pick 5 random products for trending, new, and sale
    const productIds = [...Array(productsData.length).keys()].map(i => i + 1);
    
    // Shuffle array using Fisher-Yates algorithm
    for (let i = productIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productIds[i], productIds[j]] = [productIds[j], productIds[i]];
    }
    
    // First create all products
    for (const product of productsData) {
      this.createProduct(product);
    }
    
    // Set 5 products as trending 
    for (let i = 0; i < 5; i++) {
      this.updateProduct(productIds[i], { trending: true });
    }
    
    // Set next 5 as new (clear existing and set new ones)
    for (let id = 1; id <= this.nextProductId; id++) {
      const product = this.products.get(id);
      if (product) {
        this.updateProduct(id, { isNew: false });
      }
    }
    
    for (let i = 5; i < 10; i++) {
      this.updateProduct(productIds[i], { isNew: true });
    }
    
    // Set next 5 as on sale
    // First remove all sales
    for (let id = 1; id <= this.nextProductId; id++) {
      const product = this.products.get(id);
      if (product) {
        this.updateProduct(id, { discount: undefined, originalPrice: undefined });
      }
    }
    
    // Then add new sale items with discounts
    for (let i = 10; i < 15; i++) {
      const product = this.products.get(productIds[i]);
      if (product) {
        const discount = Math.floor(Math.random() * (30 - 10) + 10); // Random discount between 10-30%
        const originalPrice = Math.round(product.price / (1 - discount/100));
        this.updateProduct(productIds[i], { 
          discount, 
          originalPrice
        });
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product methods
  async getProducts(params?: {
    gender?: Gender,
    category?: ProductCategory,
    trending?: boolean,
    isNew?: boolean,
    onSale?: boolean,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
    sizes?: Size[],
    minRating?: number,
    sortBy?: string
  }): Promise<Product[]> {
    let filteredProducts = Array.from(this.products.values());
    
    if (params) {
      if (params.gender && params.gender !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.gender === params.gender);
      }
      
      if (params.category) {
        filteredProducts = filteredProducts.filter(p => p.category === params.category);
      }
      
      if (params.trending) {
        filteredProducts = filteredProducts.filter(p => p.trending === true);
      }
      
      if (params.isNew) {
        filteredProducts = filteredProducts.filter(p => p.isNew === true);
      }
      
      if (params.onSale) {
        filteredProducts = filteredProducts.filter(p => p.discount && p.discount > 0);
      }
      
      if (params.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice!);
      }
      
      if (params.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice!);
      }
      
      if (params.sizes && params.sizes.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          params.sizes!.some(size => p.sizes.includes(size as string))
        );
      }
      
      if (params.minRating !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.rating >= params.minRating!);
      }
      
      if (params.sortBy) {
        switch(params.sortBy) {
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'popularity':
            filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          case 'newest':
          default:
            filteredProducts.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      }
      
      if (params.limit) {
        filteredProducts = filteredProducts.slice(0, params.limit);
      }
    }
    
    return filteredProducts;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }
  
  async getSimilarProducts(productId: number): Promise<Product[]> {
    const product = this.products.get(productId);
    if (!product) {
      return [];
    }
    
    return Array.from(this.products.values())
      .filter(p => 
        p.id !== productId && 
        p.gender === product.gender &&
        (p.category === product.category || 
          (product.tags && p.tags && p.tags.some(tag => product.tags.includes(tag))))
      )
      .slice(0, 4);
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.nextProductId++;
    const now = new Date();
    const product: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) {
      return undefined;
    }
    
    const updatedProduct: Product = {
      ...product,
      ...productData,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.nextOrderId++;
    const now = new Date();
    const order: Order = {
      ...orderData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.orders.set(id, order);
    
    // Add items to user's wardrobe
    const orderItems = JSON.parse(String(order.items));
    for (const item of orderItems) {
      await this.addToWardrobe({
        userId: order.userId,
        productId: item.product.id
      });
    }
    
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) {
      return undefined;
    }
    
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Wishlist methods
  async getWishlistItems(userId: number): Promise<Product[]> {
    const wishlistIds = Array.from(this.wishlistItems.values())
      .filter(item => item.userId === userId)
      .map(item => item.productId);
    
    return Array.from(this.products.values())
      .filter(product => wishlistIds.includes(product.id));
  }
  
  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if already in wishlist
    const existingItem = Array.from(this.wishlistItems.values())
      .find(item => 
        item.userId === wishlistItem.userId && 
        item.productId === wishlistItem.productId
      );
    
    if (existingItem) {
      return existingItem;
    }
    
    const id = this.nextWishlistId++;
    const now = new Date();
    const newItem: WishlistItem = {
      ...wishlistItem,
      id,
      createdAt: now
    };
    
    this.wishlistItems.set(id, newItem);
    return newItem;
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const itemToDelete = Array.from(this.wishlistItems.values())
      .find(item => item.userId === userId && item.productId === productId);
    
    if (!itemToDelete) {
      return false;
    }
    
    return this.wishlistItems.delete(itemToDelete.id);
  }
  
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.wishlistItems.values())
      .some(item => item.userId === userId && item.productId === productId);
  }
  
  // Wardrobe methods
  async getWardrobeItems(userId: number): Promise<Product[]> {
    const wardrobeIds = Array.from(this.wardrobeItems.values())
      .filter(item => item.userId === userId)
      .map(item => item.productId);
    
    return Array.from(this.products.values())
      .filter(product => wardrobeIds.includes(product.id));
  }
  
  async addToWardrobe(wardrobeItem: InsertWardrobeItem): Promise<WardrobeItem> {
    // Check if already in wardrobe
    const existingItem = Array.from(this.wardrobeItems.values())
      .find(item => 
        item.userId === wardrobeItem.userId && 
        item.productId === wardrobeItem.productId
      );
    
    if (existingItem) {
      return existingItem;
    }
    
    const id = this.nextWardrobeId++;
    const now = new Date();
    const newItem: WardrobeItem = {
      ...wardrobeItem,
      id,
      createdAt: now
    };
    
    this.wardrobeItems.set(id, newItem);
    return newItem;
  }
  
  // Address methods
  async getUserAddresses(userId: number): Promise<Address[]> {
    return Array.from(this.addresses.values())
      .filter(address => address.userId === userId);
  }
  
  async createAddress(addressData: InsertAddress): Promise<Address> {
    const id = this.nextAddressId++;
    const now = new Date();
    const address: Address = {
      ...addressData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.addresses.set(id, address);
    return address;
  }
  
  async updateAddress(id: number, addressData: Partial<Address>): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) {
      return undefined;
    }
    
    const updatedAddress: Address = {
      ...address,
      ...addressData,
      updatedAt: new Date()
    };
    
    this.addresses.set(id, updatedAddress);
    return updatedAddress;
  }
  
  async deleteAddress(id: number): Promise<boolean> {
    return this.addresses.delete(id);
  }
}

// Export a singleton instance
// Import the MongoDB storage implementation
import { MongoStorage } from './mongoStorage';

// Create in-memory storage for use as the default
const memStorage = new MemStorage();

// Just use memory storage for simplicity and reliability
export const storage = memStorage;
