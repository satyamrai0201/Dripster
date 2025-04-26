export type Gender = 'men' | 'women' | 'all';

export type ProductCategory = 
  | 'tshirts' 
  | 'hoodies' 
  | 'sneakers' 
  | 'accessories' 
  | 'tops' 
  | 'sweatshirts';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'ONE SIZE';

export interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  gender: Gender;
  category: ProductCategory;
  subCategory?: string;
  sizes: Size[];
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
  deliveryEta: string;
  isNew?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: Size;
  color?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  orders?: Order[];
  addresses?: Address[];
  wishlist?: number[];
  wardrobe?: number[];
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: string;
}
