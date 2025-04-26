import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface WishlistContextType {
  wishlist: Product[];
  isLoading: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
}

// Default values to avoid undefined checks
const defaultWishlistContext: WishlistContextType = {
  wishlist: [],
  isLoading: false,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {}
};

const WishlistContext = createContext<WishlistContextType>(defaultWishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { toast } = useToast();
  // Default to using localStorage for wishlist functionality
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const queryClient = useQueryClient();

  // Get authentication status and user data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
          if (data.isAuthenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch auth status:', error);
      } finally {
        // Always load from localStorage first for a better UX
        loadFromLocalStorage();
      }
    };
    
    checkAuth();
  }, []);
  
  // Function to load wishlist from localStorage
  const loadFromLocalStorage = () => {
    try {
      const localWishlist = localStorage.getItem('dripster-wishlist');
      if (localWishlist) {
        setWishlist(JSON.parse(localWishlist));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      setIsLoading(false);
    }
  };
  
  // Get wishlist items from server if user is authenticated
  const { data } = useQuery({
    queryKey: ['/api/wishlist'],
    enabled: isAuthenticated
  });
  
  // Update wishlist when server data changes
  useEffect(() => {
    if (data) {
      setWishlist(data as Product[]);
      setIsLoading(false);
    }
  }, [data]);

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest('POST', '/api/wishlist', { productId });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add to wishlist',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest('DELETE', `/api/wishlist/${productId}`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to remove from wishlist',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });

  // Local wishlist for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = localStorage.getItem('dripster-wishlist');
      if (localWishlist) {
        setWishlist(JSON.parse(localWishlist));
      }
    }
  }, [isAuthenticated]);

  // Sync local wishlist to server when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      const localWishlist = localStorage.getItem('dripster-wishlist');
      if (localWishlist) {
        const localItems = JSON.parse(localWishlist) as Product[];
        
        // Clear local storage now that we've logged in
        localStorage.removeItem('dripster-wishlist');
        
        // Add any local wishlist items to server if they don't exist there
        localItems.forEach(item => {
          if (!wishlist.some(w => w.id === item.id)) {
            addToWishlistMutation.mutate(item.id);
          }
        });
      }
    }
  }, [isAuthenticated, user]);

  const addToWishlist = (product: Product) => {
    if (isAuthenticated) {
      addToWishlistMutation.mutate(product.id);
      
      // Optimistically update the UI
      setWishlist(prev => {
        if (!prev.some(item => item.id === product.id)) {
          return [...prev, product];
        }
        return prev;
      });
    } else {
      // Store in local storage if not authenticated
      setWishlist(prev => {
        if (!prev.some(item => item.id === product.id)) {
          const newWishlist = [...prev, product];
          localStorage.setItem('dripster-wishlist', JSON.stringify(newWishlist));
          return newWishlist;
        }
        return prev;
      });
    }
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} added to your wishlist`,
    });
  };

  const removeFromWishlist = (productId: number) => {
    if (isAuthenticated) {
      removeFromWishlistMutation.mutate(productId);
      
      // Optimistically update the UI
      setWishlist(prev => prev.filter(item => item.id !== productId));
    } else {
      // Remove from local storage if not authenticated
      setWishlist(prev => {
        const newWishlist = prev.filter(item => item.id !== productId);
        localStorage.setItem('dripster-wishlist', JSON.stringify(newWishlist));
        return newWishlist;
      });
    }
    
    const productName = wishlist.find(item => item.id === productId)?.name || 'Item';
    toast({
      title: "Removed from wishlist",
      description: `${productName} removed from your wishlist`,
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  return useContext(WishlistContext);
};
