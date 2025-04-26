import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

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
  expiryDate?: string;
  cardholderName?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  isDefault: boolean;
}

export default function OrderSuccess() {
  const [, navigate] = useLocation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    // Get selected address and payment method
    const addresses: Address[] = JSON.parse(localStorage.getItem('user-addresses') || '[]');
    const paymentMethods: PaymentMethod[] = JSON.parse(localStorage.getItem('user-payment-methods') || '[]');
    
    const lastSelectedAddressId = localStorage.getItem('last-selected-address');
    const lastSelectedPaymentId = localStorage.getItem('last-payment-method');

    if (lastSelectedAddressId) {
      const address = addresses.find(addr => addr.id === lastSelectedAddressId);
      if (address) setSelectedAddress(address);
    }

    if (lastSelectedPaymentId) {
      const payment = paymentMethods.find(method => method.id === lastSelectedPaymentId);
      if (payment) setSelectedPayment(payment);
    }

    // After 2 seconds, redirect to orders page
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center max-w-lg w-full mx-auto p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, times: [0, 0.8, 1] }}
          className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-12 h-12 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-3xl font-bold text-white mb-6"
        >
          Order Placed Successfully!
        </motion.h2>

        {(selectedAddress || selectedPayment) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="bg-zinc-800/50 rounded-xl p-6 mb-6 text-left"
          >
            {selectedAddress && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Delivery Address</h3>
                <p className="text-white">{selectedAddress.fullName}</p>
                <p className="text-zinc-400">{selectedAddress.addressLine1}</p>
                {selectedAddress.addressLine2 && (
                  <p className="text-zinc-400">{selectedAddress.addressLine2}</p>
                )}
                <p className="text-zinc-400">
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </p>
              </div>
            )}

            {selectedPayment && (
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Payment Method</h3>
                {selectedPayment.type === 'card' && (
                  <p className="text-white">
                    Card ending in {selectedPayment.cardNumber?.slice(-4)}
                  </p>
                )}
                {selectedPayment.type === 'upi' && (
                  <p className="text-white">{selectedPayment.upiId}</p>
                )}
                {selectedPayment.type === 'netbanking' && (
                  <p className="text-white">{selectedPayment.bankName}</p>
                )}
                {selectedPayment.type === 'cod' && (
                  <p className="text-white">Cash on Delivery</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-zinc-400"
        >
          Redirecting to your orders...
        </motion.p>
      </div>
    </div>
  );
} 