import { useAuth } from '@/context/AuthContext';
import AddressSection from '@/components/AddressSection';
import { useNavigate } from 'react-router-dom';

export default function AddressesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-zinc-800 rounded-2xl border border-zinc-700 text-center">
        <h1 className="text-3xl font-bold mb-4">Addresses</h1>
          <p className="text-zinc-400 mb-6">Please sign in to manage your addresses.</p>
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
        <h1 className="text-4xl font-bold mb-8 text-center">Your Addresses</h1>
        
        <AddressSection />
      </div>
    </div>
  );
}