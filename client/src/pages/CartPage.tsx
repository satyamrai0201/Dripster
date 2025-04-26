import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

interface CartItem {
  id: string;
  price: number;
  name: string;
  quantity: number;
  image: string;
}

const CartPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      setTotal(total);
    };
    calculateTotal();
  }, [cartItems]);

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/checkout/address');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-zinc-400">Your cart is empty</p>
            <Link to="/" className="mt-4 inline-block px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 bg-zinc-800 rounded-2xl">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-zinc-400">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-8 p-6 bg-zinc-800 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium">Total</span>
                <span className="text-2xl font-bold">₹{total}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full px-6 py-4 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium text-lg transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 