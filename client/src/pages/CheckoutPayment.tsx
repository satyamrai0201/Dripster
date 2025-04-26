import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import OrderSuccess from '@/components/OrderSuccess';

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

interface NewPaymentFormData {
  type: 'card' | 'upi' | 'netbanking';
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

const bankOptions = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank',
  'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'Kotak Mahindra Bank', 'IndusInd Bank',
  'Bank of India', 'IDBI Bank', 'Indian Bank', 'Central Bank of India', 'Indian Overseas Bank',
  'UCO Bank', 'Bank of Maharashtra', 'Punjab & Sind Bank', 'Federal Bank', 'Yes Bank'
];

const paymentTypeConfig = {
  card: {
    title: 'Credit/Debit Cards',
    icon: '💳',
    description: 'Pay using your saved cards or add a new one',
  },
  upi: {
    title: 'UPI',
    icon: '💸',
    description: 'Pay using your saved UPI IDs or add a new one',
  },
  netbanking: {
    title: 'Net Banking',
    icon: '🏦',
    description: 'Pay using your saved bank accounts or add a new one',
  },
  cod: {
    title: 'Cash on Delivery',
    icon: '💰',
    description: 'Pay when you receive your order',
  },
};

export default function CheckoutPayment() {
  const [, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    card: false,
    upi: false,
    netbanking: false,
    cod: false,
  });
  const [formData, setFormData] = useState<NewPaymentFormData>({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  // Load saved payment methods and select default
  useEffect(() => {
    if (currentUser) {
      const savedMethods = JSON.parse(localStorage.getItem('user-payment-methods') || '[]');
      setSavedPaymentMethods(savedMethods);
      
      // Find and select the default payment method
      const defaultMethod = savedMethods.find((method: PaymentMethod) => method.isDefault);
      if (defaultMethod) {
        setSelectedPayment(defaultMethod.id);
        // Expand the section containing the default method
        setExpandedSections(prev => ({
          ...prev,
          [defaultMethod.type]: true
        }));
      }
    }
  }, [currentUser]);

  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPayment(paymentId);
  };

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAddNewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: selectedType,
      isDefault: savedPaymentMethods.length === 0, // Set as default if it's the first method
      ...(selectedType === 'card' && {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cardholderName: formData.cardholderName
      }),
      ...(selectedType === 'upi' && {
        upiId: formData.upiId
      }),
      ...(selectedType === 'netbanking' && {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode
      })
    };

    const updatedMethods = [...savedPaymentMethods, newMethod];
    setSavedPaymentMethods(updatedMethods);
    localStorage.setItem('user-payment-methods', JSON.stringify(updatedMethods));
    
    // Select the newly added method
    setSelectedPayment(newMethod.id);
    setFormData({
      type: selectedType,
      cardNumber: '',
      expiryDate: '',
      cardholderName: '',
      upiId: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    });

    // Scroll to the newly added payment method
    requestAnimationFrame(() => {
      scrollToElement(`payment-method-${newMethod.id}`);
    });

    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully",
    });
  };

  const handleProceedToOrder = () => {
    const selectedAddress = localStorage.getItem('last-selected-address');

    if (!selectedAddress) {
      toast({
        title: "Selection Required",
        description: "Please select an address to proceed",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPayment) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to proceed",
        variant: "destructive"
      });
      return;
    }

    // Save the selected payment method
    localStorage.setItem('last-payment-method', selectedPayment);
    
    // Show success animation
    setShowSuccess(true);
  };

  const getMethodsByType = (type: PaymentMethod['type']) => {
    return savedPaymentMethods.filter(method => method.type === type);
  };

  const toggleSection = (type: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div
      id={`payment-method-${method.id}`}
      key={method.id}
      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
        selectedPayment === method.id
          ? 'border-red-500 bg-zinc-800'
          : 'border-zinc-700 hover:border-zinc-600'
      }`}
      onClick={() => handlePaymentSelect(method.id)}
    >
      <div className="flex items-center gap-6">
        <div className="text-4xl">
          {paymentTypeConfig[method.type].icon}
        </div>
        <div className="flex-1">
          {method.type === 'card' && (
            <div className="text-zinc-400">
              <p>•••• •••• •••• {method.cardNumber?.slice(-4)}</p>
              <p>Expires: {method.expiryDate}</p>
              <p>{method.cardholderName}</p>
            </div>
          )}
          {method.type === 'upi' && (
            <p className="text-zinc-400">{method.upiId}</p>
          )}
          {method.type === 'netbanking' && (
            <div className="text-zinc-400">
              <p>{method.bankName}</p>
              <p>••••••••{method.accountNumber?.slice(-4)}</p>
              <p>IFSC: {method.ifscCode}</p>
            </div>
          )}
        </div>
        {selectedPayment === method.id && (
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return value;
  };

  const formatUPI = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, '');
  };

  const formatAccountNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  };

  const formatIFSC = (value: string) => {
    return value.toUpperCase().replace(/\s+/g, '');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-zinc-800 rounded-2xl border border-zinc-700 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-zinc-400 mb-6">Please sign in to proceed with your payment.</p>
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
    <>
      <div className="min-h-screen bg-zinc-900 text-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Select Payment Method</h1>
          
          {/* Payment Type Sections */}
          {(['card', 'upi', 'netbanking', 'cod'] as const).map((type) => {
            const methods = getMethodsByType(type);
            const config = paymentTypeConfig[type];
            const isExpanded = expandedSections[type];
            
            return (
              <div key={type} className="mb-4">
                <div 
                  className="p-6 rounded-2xl border-2 border-zinc-700 cursor-pointer hover:border-zinc-600 transition"
                  onClick={() => toggleSection(type)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <h2 className="text-xl font-semibold">{config.title}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                      {type !== 'cod' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedType(type);
                            setShowAddForm(true);
                            setExpandedSections(prev => ({
                              ...prev,
                              [type]: true
                            }));
                            // Scroll to the form
                            requestAnimationFrame(() => {
                              scrollToElement(`add-form-${type}`);
                            });
                          }}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm transition flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New
                        </button>
                      )}
                      <svg 
                        className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        {type === 'cod' ? (
                          <div 
                            className="p-6 rounded-2xl border-2 transition-all cursor-pointer hover:border-zinc-600"
                            onClick={() => handlePaymentSelect('cod')}
                          >
                            <div className="flex items-center gap-6">
                              <div className="text-4xl">{config.icon}</div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-1">{config.title}</h3>
                                <p className="text-zinc-400">{config.description}</p>
                              </div>
                              {selectedPayment === 'cod' && (
                                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {methods.map(renderPaymentMethod)}
                            {methods.length === 0 && (
                              <div className="p-6 rounded-2xl border-2 border-zinc-700 text-center text-zinc-400">
                                <p>{config.description}</p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Add New Payment Method Form */}
                        {showAddForm && selectedType === type && (
                          <motion.div
                            id={`add-form-${type}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700"
                          >
                            <h2 className="text-xl font-semibold mb-4">Add New {config.title}</h2>
                            <form onSubmit={handleAddNewPayment} className="space-y-4">
                              {selectedType === 'card' && (
                                <>
                                  <div>
                                    <label className="block mb-2 text-zinc-300">Card Number</label>
                                    <input
                                      type="text"
                                      value={formData.cardNumber}
                                      onChange={e => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                      placeholder="1234 5678 9012 3456"
                                      maxLength={19}
                                      pattern="[0-9\s]{16,19}"
                                      required
                                    />
                                    <p className="text-sm text-zinc-400 mt-1">Enter 16-digit card number with or without spaces</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block mb-2 text-zinc-300">Expiry Date</label>
                                      <input
                                        type="text"
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                                        required
                                      />
                                      <p className="text-sm text-zinc-400 mt-1">Format: MM/YY (e.g., 12/25)</p>
                                    </div>
                                    <div>
                                      <label className="block mb-2 text-zinc-300">Cardholder Name</label>
                                      <input
                                        type="text"
                                        value={formData.cardholderName}
                                        onChange={e => setFormData({ ...formData, cardholderName: e.target.value.toUpperCase() })}
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                        placeholder="JOHN DOE"
                                        required
                                      />
                                      <p className="text-sm text-zinc-400 mt-1">Enter name as it appears on card</p>
                                    </div>
                                  </div>
                                </>
                              )}

                              {selectedType === 'upi' && (
                                <div>
                                  <label className="block mb-2 text-zinc-300">UPI ID</label>
                                  <input
                                    type="text"
                                    value={formData.upiId}
                                    onChange={e => setFormData({ ...formData, upiId: formatUPI(e.target.value) })}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                    placeholder="username@upi"
                                    pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+"
                                    required
                                  />
                                  <p className="text-sm text-zinc-400 mt-1">Format: username@upi (e.g., john.doe@upi)</p>
                                </div>
                              )}

                              {selectedType === 'netbanking' && (
                                <>
                                  <div>
                                    <label className="block mb-2 text-zinc-300">Bank</label>
                                    <select
                                      value={formData.bankName}
                                      onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                      required
                                    >
                                      <option value="">Select Bank</option>
                                      {bankOptions.map(bank => (
                                        <option key={bank} value={bank}>{bank}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block mb-2 text-zinc-300">Account Number</label>
                                    <input
                                      type="text"
                                      value={formData.accountNumber}
                                      onChange={e => setFormData({ ...formData, accountNumber: formatAccountNumber(e.target.value) })}
                                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                      placeholder="Enter account number"
                                      pattern="[0-9]{9,18}"
                                      minLength={9}
                                      maxLength={18}
                                      required
                                    />
                                    <p className="text-sm text-zinc-400 mt-1">Enter 9-18 digit account number</p>
                                  </div>
                                  <div>
                                    <label className="block mb-2 text-zinc-300">IFSC Code</label>
                                    <input
                                      type="text"
                                      value={formData.ifscCode}
                                      onChange={e => setFormData({ ...formData, ifscCode: formatIFSC(e.target.value) })}
                                      className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                      placeholder="BANK0123456"
                                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                                      minLength={11}
                                      maxLength={11}
                                      required
                                    />
                                    <p className="text-sm text-zinc-400 mt-1">Format: 4 letters + 0 + 6 alphanumeric (e.g., SBIN0123456)</p>
                                  </div>
                                </>
                              )}

                              <div className="flex gap-4 mt-6">
                                <button
                                  type="submit"
                                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
                                >
                                  Save Payment Method
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowAddForm(false)}
                                  className="flex-1 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="flex justify-center mt-8">
            <button
              onClick={handleProceedToOrder}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium text-lg transition w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedPayment}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {showSuccess && <OrderSuccess />}
    </>
  );
} 