import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Size } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size: Size, color?: string) => void;
  removeFromCart: (productId: number, size: Size) => void;
  updateQuantity: (productId: number, size: Size, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getShippingCost: () => number;
  getTaxAmount: () => number;
}

// Create a default value for the context to avoid the undefined check
const defaultCartContext: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getItemsCount: () => 0,
  getCartSubtotal: () => 0,
  getCartDiscount: () => 0,
  getShippingCost: () => 0,
  getTaxAmount: () => 0
};

const CartContext = createContext<CartContextType>(defaultCartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Try to get cart from localStorage
    const savedCart = localStorage.getItem('dripster-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const { toast } = useToast();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dripster-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, size: Size, color?: string) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart with same size
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Cart updated",
          description: `${product.name} quantity updated in cart`,
        });
        
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
        });
        
        return [...prevItems, { product, quantity, size, color }];
      }
    });
  };

  const removeFromCart = (productId: number, size: Size) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(
        item => item.product.id === productId && item.size === size
      );
      
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.product.name} removed from your cart`,
        });
      }
      
      return prevItems.filter(
        item => !(item.product.id === productId && item.size === size)
      );
    });
  };

  const updateQuantity = (productId: number, size: Size, quantity: number) => {
    if (quantity < 1) return;

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    const shipping = getShippingCost();
    const tax = getTaxAmount();
    
    return subtotal - discount + shipping + tax;
  };

  const getItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  };

  const getCartDiscount = () => {
    // Calculate discount as 10% of subtotal
    return Math.round(getCartSubtotal() * 0.10);
  };

  const getShippingCost = () => {
    // Free shipping for orders over ₹5000, otherwise ₹99
    return getCartSubtotal() > 5000 ? 0 : 99;
  };

  const getTaxAmount = () => {
    // Calculate tax as 5% of subtotal after discount
    return Math.round((getCartSubtotal() - getCartDiscount()) * 0.05);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemsCount,
      getCartSubtotal,
      getCartDiscount,
      getShippingCost,
      getTaxAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  return useContext(CartContext);
};
