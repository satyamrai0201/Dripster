import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import AddressSection from '@/components/AddressSection';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutAddress() {
  const [, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleAddressSelect = (addressId: string) => {
    localStorage.setItem('last-selected-address', addressId);
  };

  const handleProceed = () => {
    const selectedAddress = localStorage.getItem('last-selected-address');
    const selectedPayment = localStorage.getItem('last-payment-method');

    if (!selectedAddress && !selectedPayment) {
      toast({
        title: "Selection Required",
        description: "Please select either an address or payment method to proceed",
        variant: "destructive"
      });
      return;
    }

    navigate('/checkout-payment');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-zinc-800 rounded-2xl border border-zinc-700 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-zinc-400 mb-6">Please sign in to proceed with your order.</p>
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
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Select Delivery Address</h1>
        
        <AddressSection 
          showProceedButton={true}
          onProceed={handleProceed}
          onAddressSelect={handleAddressSelect}
        />
      </div>
    </div>
  );
} 