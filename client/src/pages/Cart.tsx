import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { formatPrice } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { Product, Size } from '@/types';
import { useAuth } from '@/context/AuthContext';

// Define CartItem interface for local storage usage
interface CartItem {
  product: Product;
  quantity: number;
  size: Size;
  color?: string;
}

export default function Cart() {
  const [, navigate] = useLocation();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { currentUser, showLoginPopup } = useAuth();
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const cartString = localStorage.getItem('dripster-cart');
      if (cartString) {
        const cartData = JSON.parse(cartString);
        setCartItems(cartData);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast({
        title: "Error loading cart",
        description: "There was a problem loading your cart",
        variant: "destructive"
      });
    }
  }, []);
  
  // Cart management functions
  const removeFromCart = (productId: number, size: Size) => {
    try {
      const updatedCart = cartItems.filter(
        item => !(item.product.id === productId && item.size === size)
      );
      setCartItems(updatedCart);
      localStorage.setItem('dripster-cart', JSON.stringify(updatedCart));
      
      toast({
        title: "Item removed",
        description: "Item removed from your cart",
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  };
  
  const updateQuantity = (productId: number, size: Size, quantity: number) => {
    try {
      // Validate quantity
      if (quantity < 1) return;
      
      const updatedCart = cartItems.map(item => {
        if (item.product.id === productId && item.size === size) {
          // Check against stock
          const maxQuantity = item.product.stock || 10;
          const newQuantity = Math.min(quantity, maxQuantity);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      setCartItems(updatedCart);
      localStorage.setItem('dripster-cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };
  
  const clearCart = () => {
    try {
      setCartItems([]);
      localStorage.setItem('dripster-cart', JSON.stringify([]));
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    }
  };
  
  // Calculate cart totals
  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };
  
  const getCartDiscount = () => {
    // Simple discount calculation, could be enhanced
    const subtotal = getCartSubtotal();
    return couponCode ? Math.round(subtotal * 0.1) : 0; // 10% discount with coupon
  };
  
  const getShippingCost = () => {
    // Simple shipping calculation
    const subtotal = getCartSubtotal();
    return subtotal > 5000 ? 0 : 299; // Free shipping above ₹5000
  };
  
  const getTaxAmount = () => {
    // Simple tax calculation (5% GST)
    const subtotal = getCartSubtotal();
    return Math.round(subtotal * 0.05);
  };
  
  const getCartTotal = () => {
    return getCartSubtotal() - getCartDiscount() + getShippingCost() + getTaxAmount();
  };
  
  // Authentication status (using localStorage for demo purposes)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in (simplified for demo)
    const userString = localStorage.getItem('dripster-user');
    setIsAuthenticated(!!userString);
  }, []);

  const isEmpty = cartItems.length === 0;

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/orders', { 
        items: cartItems,
        couponCode: couponCode || undefined
      });
      return await response.json();
    },
    onSuccess: (data) => {
      clearCart();
      toast({
        title: 'Order placed successfully!',
        description: `Order #${data.id} has been placed.`,
      });
      navigate(`/order-confirmation/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Checkout failed',
        description: error.message || 'Unable to process your order. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items to proceed to checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) {
      showLoginPopup('purchase');
      return;
    }

    navigate('/checkout/address');
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: 'Invalid coupon',
        description: 'Please enter a valid coupon code',
        variant: 'destructive',
      });
      return;
    }
    
    setIsApplyingCoupon(true);
    
    // Simulate coupon application
    setTimeout(() => {
      toast({
        title: 'Coupon applied',
        description: 'Discount has been applied to your cart',
      });
      setIsApplyingCoupon(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Your Cart | Dripster</title>
        <meta name="description" content="View and manage your shopping cart at Dripster." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">Shopping Cart</h1>
        
        {isEmpty ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <i className="ri-shopping-bag-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-[#BBBBBB] mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/category/all">
              <a className="px-6 py-3 bg-primary hover:bg-[#e03535] text-white rounded-full font-montserrat font-semibold transition-colors">
                Start Shopping
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div 
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Cart items */}
                <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-montserrat font-semibold">
                      Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                    </h3>
                    <button 
                      className="text-primary text-sm hover:underline"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                  </div>
                  
                  {cartItems.map((item, index) => (
                    <div 
                      key={`${item.product.id}-${item.size}`} 
                      className={`flex py-4 ${
                        index < cartItems.length - 1 ? 'border-b border-[rgba(255,255,255,0.1)]' : ''
                      }`}
                    >
                      <Link href={`/product/${item.product.id}`}>
                        <a className="block">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </a>
                      </Link>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <Link href={`/product/${item.product.id}`}>
                            <a className="font-montserrat font-medium hover:text-primary transition-colors">
                              {item.product.name}
                            </a>
                          </Link>
                          <button 
                            className="text-[#BBBBBB] hover:text-primary transition-colors"
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            aria-label="Remove item"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                        <p className="text-[#BBBBBB] text-sm">
                          Size: {item.size} {item.color && `| Color: ${item.color}`}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <button 
                              className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-primary transition-colors"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <i className="ri-subtract-line text-sm"></i>
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button 
                              className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-primary transition-colors"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              aria-label="Increase quantity"
                            >
                              <i className="ri-add-line text-sm"></i>
                            </button>
                          </div>
                          <span className="font-montserrat font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Coupon */}
                <div className="p-6">
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Coupon code" 
                      className="flex-1 py-2 px-4 rounded-l-full bg-[#2A2A2A] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-primary text-white"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      className="px-6 py-2 rounded-r-full font-montserrat font-medium bg-primary hover:bg-[#e03535] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div 
              className="rounded-xl p-6"
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 className="font-montserrat font-semibold mb-6">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#BBBBBB]">Subtotal</span>
                  <span>{formatPrice(getCartSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#BBBBBB]">Discount</span>
                  <span className="text-[#4CAF50]">- {formatPrice(getCartDiscount())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#BBBBBB]">Shipping</span>
                  <span>{formatPrice(getShippingCost())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#BBBBBB]">Tax</span>
                  <span>{formatPrice(getTaxAmount())}</span>
                </div>
              </div>
              
              <div className="border-t border-[rgba(255,255,255,0.1)] my-4 pt-4">
                <div className="flex justify-between font-montserrat font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
              
              <button 
                className="w-full py-3 rounded-full font-montserrat font-semibold mt-4 bg-primary hover:bg-[#e03535] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                onClick={handleCheckout}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <div className="flex items-center justify-center mt-6 text-sm text-[#BBBBBB]">
                <i className="ri-lock-line mr-2"></i>
                <span>Secure Checkout</span>
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  <i className="ri-visa-line text-2xl"></i>
                  <i className="ri-mastercard-line text-2xl"></i>
                  <i className="ri-paypal-line text-2xl"></i>
                  <i className="ri-amazon-pay-line text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
