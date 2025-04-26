import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

interface NewAddressFormData {
  type: 'home' | 'office' | 'other';
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const addressTypeConfig = {
  home: {
    title: 'Home',
    icon: '🏠',
    description: 'Your home address',
  },
  office: {
    title: 'Office',
    icon: '🏢',
    description: 'Your office address',
  },
  other: {
    title: 'Other',
    icon: '📍',
    description: 'Other address',
  },
};

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

interface AddressSectionProps {
  onAddressSelect?: (addressId: string) => void;
  selectedAddress?: string | null;
  showProceedButton?: boolean;
  onProceed?: () => void;
}

export default function AddressSection({ 
  onAddressSelect, 
  selectedAddress: externalSelectedAddress,
  showProceedButton = false,
  onProceed 
}: AddressSectionProps) {
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(externalSelectedAddress || null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'home' | 'office' | 'other'>('home');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    home: false,
    office: false,
    other: false,
  });
  const [formData, setFormData] = useState<NewAddressFormData>({
    type: 'home',
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const formRef = useRef<HTMLDivElement>(null);

  // Load saved addresses and select default
  useEffect(() => {
    const savedAddrs = JSON.parse(localStorage.getItem('user-addresses') || '[]');
    setSavedAddresses(savedAddrs);
    
    // Find and select the default address if no address is selected
    if (!externalSelectedAddress) {
      const defaultAddress = savedAddrs.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
        if (onAddressSelect) {
          onAddressSelect(defaultAddress.id);
        }
        // Expand the section containing the default address
        setExpandedSections(prev => ({
          ...prev,
          [defaultAddress.type]: true
        }));
        
        // Scroll to the default address
        setTimeout(() => {
          const element = document.getElementById(defaultAddress.id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      setSelectedAddress(externalSelectedAddress);
      // Find the address and expand its section
      const address = savedAddrs.find((addr: Address) => addr.id === externalSelectedAddress);
      if (address) {
        setExpandedSections(prev => ({
          ...prev,
          [address.type]: true
        }));
      }
    }
  }, [externalSelectedAddress, onAddressSelect]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId);
    if (onAddressSelect) {
      onAddressSelect(addressId);
    }
  };

  const handleAddNewClick = (type: 'home' | 'office' | 'other') => {
    setSelectedType(type);
    setShowAddForm(true);
    setExpandedSections(prev => ({
      ...prev,
      [type]: true
    }));
    
    // Scroll to form after a short delay to allow for animation
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      isDefault: savedAddresses.length === 0,
      ...formData,
      type: selectedType
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses));
    
    setSelectedAddress(newAddress.id);
    if (onAddressSelect) {
      onAddressSelect(newAddress.id);
    }
    
    setFormData({
      type: selectedType,
      fullName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    });

    // Scroll to the new address
    setTimeout(() => {
      const element = document.getElementById(newAddress.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    toast({
      title: "Address Added",
      description: "Your new address has been added successfully",
    });
  };

  const handleSetDefault = (addressId: string) => {
    const updatedAddresses = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses));
    
    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated successfully",
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses));
    
    if (selectedAddress === addressId) {
      setSelectedAddress(null);
      if (onAddressSelect) {
        onAddressSelect('');
      }
    }
    
    toast({
      title: "Address Removed",
      description: "The address has been removed successfully",
    });
  };

  const handleEditAddress = (address: Address) => {
    setSelectedType(address.type);
    setFormData({
      type: address.type,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setShowAddForm(true);
    setExpandedSections(prev => ({
      ...prev,
      [address.type]: true
    }));
    
    // Remove the address being edited
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== address.id);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('user-addresses', JSON.stringify(updatedAddresses));
    
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const getAddressesByType = (type: Address['type']) => {
    return savedAddresses.filter(addr => addr.type === type);
  };

  const toggleSection = (type: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const renderAddress = (address: Address) => (
    <div
      id={address.id}
      key={address.id}
      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
        selectedAddress === address.id
          ? 'border-red-500 bg-zinc-800'
          : 'border-zinc-700 hover:border-zinc-600'
      }`}
      onClick={() => handleAddressSelect(address.id)}
    >
      <div className="flex items-start gap-6">
        <div className="text-4xl">
          {addressTypeConfig[address.type].icon}
        </div>
        <div className="flex-1">
          <div className="text-zinc-400">
            <p className="font-medium text-white">{address.fullName}</p>
            <p>{address.phoneNumber}</p>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>{address.city}, {address.state} - {address.pincode}</p>
          </div>
          {address.isDefault && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-green-700/10 text-green-400 text-xs rounded-full border border-green-700/20">
              Default Address
            </span>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress(address);
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium text-white transition"
            >
              Edit
            </button>
            {!address.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetDefault(address.id);
                }}
                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 rounded-full text-sm font-medium text-white transition"
              >
                Set Default
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(address.id);
              }}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-full text-sm font-medium text-white transition"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Address Type Sections */}
      {(['home', 'office', 'other'] as const).map((type) => {
        const addresses = getAddressesByType(type);
        const config = addressTypeConfig[type];
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNewClick(type);
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
                    {addresses.length > 0 ? (
                      addresses.map(renderAddress)
                    ) : (
                      <div className="p-6 rounded-2xl border-2 border-zinc-700 text-center text-zinc-400">
                        <p>{config.description}</p>
                      </div>
                    )}

                    {/* Add New Address Form */}
                    {showAddForm && selectedType === type && (
                      <motion.div
                        ref={formRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700"
                      >
                        <h2 className="text-xl font-semibold mb-4">Add New {config.title} Address</h2>
                        <form onSubmit={handleAddNewAddress} className="space-y-4">
                          <div>
                            <label className="block mb-2 text-zinc-300">Full Name</label>
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-zinc-300">Phone Number</label>
                            <input
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                              placeholder="+91 9876543210"
                              pattern="[0-9]{10}"
                              maxLength={10}
                              required
                            />
                            <p className="text-sm text-zinc-400 mt-1">Enter 10-digit mobile number</p>
                          </div>
                          <div>
                            <label className="block mb-2 text-zinc-300">Address Line 1</label>
                            <input
                              type="text"
                              value={formData.addressLine1}
                              onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                              placeholder="House No., Building, Street"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-zinc-300">Address Line 2 (Optional)</label>
                            <input
                              type="text"
                              value={formData.addressLine2}
                              onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                              placeholder="Area, Colony, Landmark"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-2 text-zinc-300">City</label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                placeholder="City"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-2 text-zinc-300">State</label>
                              <select
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                                required
                              >
                                <option value="">Select State</option>
                                {indianStates.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block mb-2 text-zinc-300">Pincode</label>
                            <input
                              type="text"
                              value={formData.pincode}
                              onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-400"
                              placeholder="123456"
                              pattern="[0-9]{6}"
                              maxLength={6}
                              required
                            />
                            <p className="text-sm text-zinc-400 mt-1">Enter 6-digit pincode</p>
                          </div>

                          <div className="flex gap-4 mt-6">
                            <button
                              type="submit"
                              className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
                            >
                              Save Address
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

      {showProceedButton && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onProceed}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium text-lg transition w-full max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedAddress}
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
} 