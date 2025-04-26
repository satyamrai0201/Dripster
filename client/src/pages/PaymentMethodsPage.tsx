import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  cardNumber?: string;
  expiryDate?: string;
  cardholderName?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  isDefault: boolean;
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
};

const PaymentMethodsPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id' | 'isDefault'>>({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [selectedType, setSelectedType] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [expandedSections, setExpandedSections] = useState({
    card: false,
    upi: false,
    netbanking: false,
  });

  useEffect(() => {
    if (currentUser) {
      const savedMethods = JSON.parse(localStorage.getItem('user-payment-methods') || '[]');
      setPaymentMethods(savedMethods);
      setLoading(false);
    }
  }, [currentUser]);

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prevMethods => {
      const updatedMethods = prevMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));
      localStorage.setItem('user-payment-methods', JSON.stringify(updatedMethods));
      return updatedMethods;
    });
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated successfully",
    });
  };

  const handleRemove = (methodId: string) => {
    setPaymentMethods(prevMethods => {
      const updatedMethods = prevMethods.filter(method => method.id !== methodId);
      localStorage.setItem('user-payment-methods', JSON.stringify(updatedMethods));
      return updatedMethods;
    });
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed successfully",
    });
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      cardNumber: method.cardNumber || '',
      expiryDate: method.expiryDate || '',
      cardholderName: method.cardholderName || '',
      upiId: method.upiId || '',
      bankName: method.bankName || '',
      accountNumber: method.accountNumber || '',
      ifscCode: method.ifscCode || '',
    });
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMethod) {
      setPaymentMethods(prevMethods => {
        const updatedMethods = prevMethods.map(method => 
          method.id === editingMethod.id 
            ? { ...method, ...formData }
            : method
        );
        localStorage.setItem('user-payment-methods', JSON.stringify(updatedMethods));
        return updatedMethods;
      });
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been updated successfully",
      });
    } else {
      const newMethod: PaymentMethod = {
        ...formData,
        id: `pm-${Date.now()}`,
        isDefault: paymentMethods.length === 0
      };
      setPaymentMethods(prev => [...prev, newMethod]);
      localStorage.setItem('user-payment-methods', JSON.stringify([...paymentMethods, newMethod]));
      toast({
        title: "Payment Method Added",
        description: "Your new payment method has been added successfully",
      });
    }
    setShowAddForm(false);
    setEditingMethod(null);
    setFormData({
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cardholderName: '',
      upiId: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    });
  };

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

  const handleAddNewPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: selectedType,
      isDefault: paymentMethods.length === 0,
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

    const updatedMethods = [...paymentMethods, newMethod];
    setPaymentMethods(updatedMethods);
    localStorage.setItem('user-payment-methods', JSON.stringify(updatedMethods));
    
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

    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully",
    });
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-zinc-900 rounded-2xl border border-zinc-700 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Methods</h1>
        <p>Please sign in to manage your payment methods.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-zinc-900 rounded-2xl border border-zinc-700 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Methods</h1>
        <p>Loading your payment methods...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Payment Methods</h1>
        
        {(['card', 'upi', 'netbanking'] as const).map((type) => {
          const methods = paymentMethods.filter(method => method.type === type);
          const config = paymentTypeConfig[type];
          const isExpanded = expandedSections[type];
          
          return (
            <div key={type} className="mb-4">
              <div 
                className="p-6 rounded-2xl border-2 border-zinc-700 cursor-pointer hover:border-zinc-600 transition"
                onClick={() => setExpandedSections(prev => ({
                  ...prev,
                  [type]: !isExpanded
                }))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <h2 className="text-xl font-semibold">{config.title}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(type);
                        setShowAddForm(true);
                        setExpandedSections(prev => ({
                          ...prev,
                          [type]: true
                        }));
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New
                    </button>
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
                      {methods.length > 0 ? (
                        methods.map(method => (
                          <div key={method.id} className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-semibold text-lg mb-1 text-white">
                                  {method.type === 'card' ? 'Credit/Debit Card' : 
                                   method.type === 'upi' ? 'UPI' :
                                   method.type === 'netbanking' ? 'Net Banking' : 'PayPal'}
                                </div>
                                {method.type === 'card' && (
                                  <>
                                    <div className="text-zinc-300">•••• •••• •••• {method.cardNumber?.slice(-4)}</div>
                                    <div className="text-zinc-400">Expires: {method.expiryDate}</div>
                                    <div className="text-zinc-400">Cardholder: {method.cardholderName}</div>
                                  </>
                                )}
                                {method.type === 'upi' && (
                                  <div className="text-zinc-300">{method.upiId}</div>
                                )}
                                {method.type === 'netbanking' && (
                                  <>
                                    <div className="text-zinc-300">{method.bankName}</div>
                                    <div className="text-zinc-400">Account: ••••{method.accountNumber?.slice(-4)}</div>
                                    <div className="text-zinc-400">IFSC: {method.ifscCode}</div>
                                  </>
                                )}
                                {method.isDefault && (
                                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-700/10 text-green-400 text-xs rounded-full border border-green-700/20">
                                    Default Payment Method
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(method)}
                                  className="px-3 py-1 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  Edit
                                </button>
                                {!method.isDefault && (
                                  <button
                                    onClick={() => handleSetDefault(method.id)}
                                    className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRemove(method.id)}
                                  className="px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 rounded-2xl border-2 border-zinc-700 text-center text-zinc-400">
                          <p>{config.description}</p>
                        </div>
                      )}

                      {showAddForm && selectedType === type && (
                        <motion.div
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
      </div>
    </div>
  );
};

export default PaymentMethodsPage;