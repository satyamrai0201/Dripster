import { IStorage } from './storage';
import { User, Product, Address, Order, Wishlist, Wardrobe } from './mongodb';
import { Gender, ProductCategory, Size } from "../client/src/types";
import { getProductsData } from "./data/products";
import { ObjectId } from 'mongodb';

// Convert to ObjectId or return original if it's a string that's not a valid ObjectId
const toObjectId = (id: string | number) => {
  if (typeof id === 'string' && ObjectId.isValid(id)) {
    return new ObjectId(id);
  }
  return id;
};

// Map MongoDB document to our application model
const mapUser = (user: any) => {
  if (!user) return undefined;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    password: user.password,
    profilePicture: user.profilePicture,
    googleId: user.googleId,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const mapProduct = (product: any) => {
  if (!product) return undefined;
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    images: product.images,
    price: product.price,
    originalPrice: product.originalPrice,
    gender: product.gender,
    category: product.category,
    subCategory: product.subCategory,
    sizes: product.sizes,
    rating: product.rating,
    reviewCount: product.reviewCount,
    stock: product.stock,
    tags: product.tags || [],
    deliveryEta: product.deliveryEta,
    isNew: product.isNew,
    trending: product.trending,
    discount: product.discount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
};

const mapAddress = (address: any) => {
  if (!address) return undefined;
  return {
    id: address._id.toString(),
    userId: address.userId.toString(),
    fullName: address.fullName,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt
  };
};

const mapOrder = (order: any) => {
  if (!order) return undefined;
  return {
    id: order._id.toString(),
    userId: order.userId.toString(),
    items: order.items,
    total: order.total,
    status: order.status,
    shippingAddressId: order.shippingAddressId.toString(),
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
};

const mapWishlistItem = (item: any) => {
  if (!item) return undefined;
  return {
    id: item._id.toString(),
    userId: item.userId.toString(),
    productId: item.productId.toString(),
    createdAt: item.createdAt
  };
};

const mapWardrobeItem = (item: any) => {
  if (!item) return undefined;
  return {
    id: item._id.toString(),
    userId: item.userId.toString(),
    productId: item.productId.toString(),
    createdAt: item.createdAt
  };
};

export class MongoStorage implements IStorage {
  private initialized: boolean = false;
  private fallbackToMemory: boolean = false;
  private readonly MONGO_TIMEOUT = 5000; // 5 seconds timeout

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;
    
    try {
      // Set up a timeout to avoid hanging
      const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MongoDB connection timeout')), this.MONGO_TIMEOUT);
      });
      
      // Try to connect with timeout
      const initDb = Promise.race([
        Promise.resolve().then(async () => {
          // Check if products collection is empty
          const productsCount = await Product.countDocuments();
          
          if (productsCount === 0) {
            console.log('Seeding products data...');
            await this.seedProducts();
          }
          
          // Check if admin user exists
          const adminExists = await User.findOne({ email: 'admin@dripster.com' });
          
          if (!adminExists) {
            console.log('Creating admin user...');
            await this.createUser({
              name: "Admin User",
              email: "admin@dripster.com",
              password: "admin123",
              role: "admin"
            });
          }
        }),
        timeout
      ]);
      
      await initDb;
      this.initialized = true;
      console.log('MongoDB storage initialized successfully');
    } catch (error) {
      console.error('Error initializing MongoDB storage:', error);
      console.warn('Falling back to in-memory storage');
      this.fallbackToMemory = true;
      this.initialized = true;
    }
  }

  // Seed products data
  private async seedProducts() {
    const productsData = getProductsData();
    
    // Create all products
    const createdProducts = [];
    for (const product of productsData) {
      const newProduct = await this.createProduct(product);
      createdProducts.push(newProduct);
    }
    
    // Shuffle array using Fisher-Yates algorithm
    const productIds = createdProducts.map(p => p.id);
    for (let i = productIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productIds[i], productIds[j]] = [productIds[j], productIds[i]];
    }
    
    // Set 5 products as trending
    for (let i = 0; i < 5; i++) {
      await this.updateProduct(productIds[i], { trending: true });
    }
    
    // Set next 5 as new
    // First reset all products
    await Product.updateMany({}, { $set: { isNew: false } });
    
    // Then set new ones
    for (let i = 5; i < 10; i++) {
      await this.updateProduct(productIds[i], { isNew: true });
    }
    
    // Set next 5 as on sale
    // First reset all products
    await Product.updateMany({}, { $unset: { discount: 1, originalPrice: 1 } });
    
    // Then add new sale items with discounts
    for (let i = 10; i < 15; i++) {
      const product = await this.getProduct(productIds[i]);
      if (product) {
        const discount = Math.floor(Math.random() * (30 - 10) + 10); // Random discount between 10-30%
        const originalPrice = Math.round(product.price / (1 - discount/100));
        await this.updateProduct(productIds[i], { 
          discount, 
          originalPrice
        });
      }
    }
  }

  // User methods
  async getUser(id: number | string): Promise<any> {
    const user = await User.findById(id);
    return mapUser(user);
  }
  
  async getUserByEmail(email: string): Promise<any> {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    return mapUser(user);
  }
  
  async getUserByGoogleId(googleId: string): Promise<any> {
    const user = await User.findOne({ googleId });
    return mapUser(user);
  }
  
  async createUser(userData: any): Promise<any> {
    const newUser = new User({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedUser = await newUser.save();
    return mapUser(savedUser);
  }
  
  async updateUser(id: number | string, userData: any): Promise<any> {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...userData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return mapUser(updatedUser);
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
  }): Promise<any[]> {
    let query: any = {};
    
    if (params) {
      if (params.gender && params.gender !== 'all') {
        query.gender = params.gender;
      }
      
      if (params.category) {
        query.category = params.category;
      }
      
      if (params.trending) {
        query.trending = true;
      }
      
      if (params.isNew) {
        query.isNew = true;
      }
      
      if (params.onSale) {
        query.discount = { $gt: 0 };
      }
      
      if (params.minPrice !== undefined) {
        query.price = { ...query.price, $gte: params.minPrice };
      }
      
      if (params.maxPrice !== undefined) {
        query.price = { ...query.price, $lte: params.maxPrice };
      }
      
      if (params.sizes && params.sizes.length > 0) {
        query.sizes = { $in: params.sizes };
      }
      
      if (params.minRating !== undefined) {
        query.rating = { $gte: params.minRating };
      }
    }
    
    let productsQuery = Product.find(query);
    
    // Apply sorting
    if (params?.sortBy) {
      switch(params.sortBy) {
        case 'price-low':
          productsQuery = productsQuery.sort({ price: 1 });
          break;
        case 'price-high':
          productsQuery = productsQuery.sort({ price: -1 });
          break;
        case 'rating':
          productsQuery = productsQuery.sort({ rating: -1 });
          break;
        case 'popularity':
          productsQuery = productsQuery.sort({ reviewCount: -1 });
          break;
        case 'newest':
        default:
          productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    }
    
    // Apply limit
    if (params?.limit) {
      productsQuery = productsQuery.limit(params.limit);
    }
    
    const products = await productsQuery.exec();
    return products.map(mapProduct);
  }
  
  async getProduct(id: number | string): Promise<any> {
    const product = await Product.findById(id);
    return mapProduct(product);
  }
  
  async searchProducts(query: string): Promise<any[]> {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    });
    
    return products.map(mapProduct);
  }
  
  async getSimilarProducts(productId: number | string): Promise<any[]> {
    const product = await Product.findById(productId);
    
    if (!product) {
      return [];
    }
    
    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      gender: product.gender,
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ]
    }).limit(4);
    
    return similarProducts.map(mapProduct);
  }
  
  async createProduct(productData: any): Promise<any> {
    const newProduct = new Product({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedProduct = await newProduct.save();
    return mapProduct(savedProduct);
  }
  
  async updateProduct(id: number | string, productData: any): Promise<any> {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...productData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return mapProduct(updatedProduct);
  }
  
  async deleteProduct(id: number | string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
  
  // Order methods
  async getOrders(userId: number | string): Promise<any[]> {
    const orders = await Order.find({ userId: toObjectId(userId) }).sort({ createdAt: -1 });
    return orders.map(mapOrder);
  }
  
  async getAllOrders(): Promise<any[]> {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders.map(mapOrder);
  }
  
  async getOrder(id: number | string): Promise<any> {
    const order = await Order.findById(id);
    return mapOrder(order);
  }
  
  async createOrder(orderData: any): Promise<any> {
    const newOrder = new Order({
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedOrder = await newOrder.save();
    
    // Add items to user's wardrobe
    const orderItems = typeof savedOrder.items === 'string' 
      ? JSON.parse(savedOrder.items) 
      : savedOrder.items;
    
    for (const item of orderItems) {
      await this.addToWardrobe({
        userId: savedOrder.userId,
        productId: item.product.id
      });
    }
    
    return mapOrder(savedOrder);
  }
  
  async updateOrderStatus(id: number | string, status: string): Promise<any> {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return mapOrder(updatedOrder);
  }
  
  // Wishlist methods
  async getWishlistItems(userId: number | string): Promise<any[]> {
    const wishlistItems = await Wishlist.find({ userId: toObjectId(userId) })
      .populate('productId');
    
    return wishlistItems.map(item => mapProduct(item.productId));
  }
  
  async addToWishlist(wishlistItem: any): Promise<any> {
    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      userId: toObjectId(wishlistItem.userId),
      productId: toObjectId(wishlistItem.productId)
    });
    
    if (existingItem) {
      return mapWishlistItem(existingItem);
    }
    
    const newItem = new Wishlist({
      userId: toObjectId(wishlistItem.userId),
      productId: toObjectId(wishlistItem.productId),
      createdAt: new Date()
    });
    
    const savedItem = await newItem.save();
    return mapWishlistItem(savedItem);
  }
  
  async removeFromWishlist(userId: number | string, productId: number | string): Promise<boolean> {
    const result = await Wishlist.findOneAndDelete({
      userId: toObjectId(userId),
      productId: toObjectId(productId)
    });
    
    return !!result;
  }
  
  async isInWishlist(userId: number | string, productId: number | string): Promise<boolean> {
    const item = await Wishlist.findOne({
      userId: toObjectId(userId),
      productId: toObjectId(productId)
    });
    
    return !!item;
  }
  
  // Wardrobe methods
  async getWardrobeItems(userId: number | string): Promise<any[]> {
    const wardrobeItems = await Wardrobe.find({ userId: toObjectId(userId) })
      .populate('productId');
    
    return wardrobeItems.map(item => mapProduct(item.productId));
  }
  
  async addToWardrobe(wardrobeItem: any): Promise<any> {
    // Check if already in wardrobe
    const existingItem = await Wardrobe.findOne({
      userId: toObjectId(wardrobeItem.userId),
      productId: toObjectId(wardrobeItem.productId)
    });
    
    if (existingItem) {
      return mapWardrobeItem(existingItem);
    }
    
    const newItem = new Wardrobe({
      userId: toObjectId(wardrobeItem.userId),
      productId: toObjectId(wardrobeItem.productId),
      createdAt: new Date()
    });
    
    const savedItem = await newItem.save();
    return mapWardrobeItem(savedItem);
  }
  
  // Address methods
  async getUserAddresses(userId: number | string): Promise<any[]> {
    const addresses = await Address.find({ userId: toObjectId(userId) });
    return addresses.map(mapAddress);
  }
  
  async createAddress(addressData: any): Promise<any> {
    const newAddress = new Address({
      ...addressData,
      userId: toObjectId(addressData.userId),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedAddress = await newAddress.save();
    return mapAddress(savedAddress);
  }
  
  async updateAddress(id: number | string, addressData: any): Promise<any> {
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        ...addressData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return mapAddress(updatedAddress);
  }
  
  async deleteAddress(id: number | string): Promise<boolean> {
    const result = await Address.findByIdAndDelete(id);
    return !!result;
  }
}