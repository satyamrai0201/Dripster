import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  address: string;
  payment: string;
  items: {
    productId: number;
    name: string;
    image: string;
    price: number;
    qty: number;
    size: string;
  }[];
}

interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  cardNumber?: string;
  upiId?: string;
  bankName?: string;
}

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // For now, we'll create a mock order from the cart items
    const cartString = localStorage.getItem('dripster-cart');
    const paymentMethodId = localStorage.getItem('last-payment-method');
    const lastSelectedAddressId = localStorage.getItem('last-selected-address');
    
    if (cartString && paymentMethodId && lastSelectedAddressId) {
      const cartItems = JSON.parse(cartString);
      const addresses: Address[] = JSON.parse(localStorage.getItem('user-addresses') || '[]');
      const paymentMethods: PaymentMethod[] = JSON.parse(localStorage.getItem('user-payment-methods') || '[]');
      
      const selectedAddress = addresses.find(addr => addr.id === lastSelectedAddressId);
      const selectedPayment = paymentMethods.find(method => method.id === paymentMethodId);
      
      if (cartItems.length > 0 && selectedAddress && selectedPayment) {
        const formattedAddress = `${selectedAddress.fullName}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;
        
        const formattedPayment = (() => {
          switch (selectedPayment.type) {
            case 'card':
              return `Card ending in ${selectedPayment.cardNumber?.slice(-4)}`;
            case 'upi':
              return `UPI ID: ${selectedPayment.upiId}`;
            case 'netbanking':
              return `Net Banking - ${selectedPayment.bankName}`;
            case 'cod':
              return 'Cash on Delivery';
            default:
              return 'Unknown Payment Method';
          }
        })();
        
        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          status: 'Processing',
          total: cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0),
          address: formattedAddress,
          payment: formattedPayment,
          items: cartItems.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.images[0],
            price: item.product.price,
            qty: item.quantity,
            size: item.size
          }))
        };

        // Save the order
        const existingOrders = JSON.parse(localStorage.getItem('dripster-orders') || '[]');
        localStorage.setItem('dripster-orders', JSON.stringify([...existingOrders, newOrder]));
        
        // Clear the cart, payment method, and selected address
        localStorage.removeItem('dripster-cart');
        localStorage.removeItem('last-payment-method');
        localStorage.removeItem('last-selected-address');
        
        setOrders([...existingOrders, newOrder]);
      }
    } else {
      // Load existing orders
      const existingOrders = JSON.parse(localStorage.getItem('dripster-orders') || '[]');
      setOrders(existingOrders);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-zinc-800 rounded-2xl border border-zinc-700 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
          <p className="text-zinc-400 mb-6">Please sign in to view your orders.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center text-zinc-400">
            <p className="text-xl mb-4">You have no orders yet.</p>
            <button
              onClick={() => navigate('/category/all')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <span className="font-semibold text-xl">Order #{order.id}</span>
                    <span className="ml-4 text-zinc-400">{order.date}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 md:mt-0 ${
                    order.status === 'Delivered'
                      ? 'bg-green-700 text-green-200'
                      : order.status === 'Shipped'
                      ? 'bg-blue-700 text-blue-200'
                      : 'bg-yellow-700 text-yellow-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-zinc-400">Total: </span>
                    <span className="text-white font-semibold">₹{order.total}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Payment Method: </span>
                    <span className="text-white font-semibold">{order.payment}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-zinc-400">Delivery Address: </span>
                  <span className="text-white">{order.address}</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-zinc-700/50 p-3 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-zinc-400">
                            Size: {item.size} | Qty: {item.qty}
                          </div>
                          <div className="text-sm">₹{item.price * item.qty}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}