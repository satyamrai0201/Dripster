import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
// Assuming your Product type matches the Supabase table structure
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '../hooks/use-toast'; // Assuming this hook is correctly implemented
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your actual Supabase URL and Anon Key)
// It's recommended to use environment variables for these keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure keys are defined before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not defined.');
  // Handle this error appropriately in a real application (e.g., show an error message)
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);


export default function NewArrivals() {
  const [sortBy, setSortBy] = useState('newest'); // Default sort
  const [email, setEmail] = useState('');
  const { toast } = useToast(); // Assuming useToast is correctly imported and used

  // Use sortBy as part of the query key
  // The 'isNew=true' filter is fixed in the queryFn, so it doesn't need to be in the query key for refetching
  const queryKey = ['new-arrivals', sortBy];

  // Fetch products
  const {
    data: products = [], // Default fallback to empty array
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        // Filter specifically for new arrivals
        .eq('is_new', true); // Assuming 'is_new' is a boolean column in your table

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          // Assuming 'id' or 'created_at' is a good indicator of newest
          // If you have a 'created_at' timestamp column, use that instead of 'id'
          query = query.order('id', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          // Default sorting if no option is selected or recognized
           query = query.order('id', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || []; // Return empty array if data is null
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Here you would typically send the email to your backend or a Supabase Edge Function
    console.log('Subscribing email:', email);

    // Example of how you might call a Supabase Function (replace with your actual function name and logic)
    // async function subscribeEmailToSupabase(email: string) {
    //   const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
    //     body: { email: email },
    //   });
    //   if (error) {
    //     console.error('Subscription failed:', error);
    //     toast({
    //       title: "Subscription Failed",
    //       description: error.message,
    //       duration: 3000,
    //       variant: "destructive",
    //     });
    //   } else {
    //      console.log('Subscription successful:', data);
           toast({
             title: "Successfully Subscribed!",
             description: "You'll be the first to know about new drops.",
             duration: 3000,
           });
    //   }
    // }
    // subscribeEmailToSupabase(email);


    // For now, keeping the original toast and email reset
    toast({
      title: "Successfully Subscribed!",
      description: "You'll be the first to know about new drops.",
      duration: 3000,
    });

    setEmail('');
  };

  return (
    <>
      <Helmet>
        <title>New Arrivals | Dripster</title>
        <meta
          name="description"
          content="Shop the latest new arrivals at Dripster. Find the freshest streetwear styles and urban fashion."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">New Arrivals</h1>
            <p className="text-[#BBBBBB] mb-4">The freshest drops from your favorite brands</p>
            {/* Product count now reflects the filtered data from Supabase */}
            {Array.isArray(products) && (
              <p className="text-[#BBBBBB]">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] bg-[rgba(42,42,42,0.7)] border border-red-500 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Banner */}
        <div
          className="w-full h-64 md:h-80 rounded-xl mb-12 bg-cover bg-center flex items-center"
          style={{
            // Removed the static background image and linear gradient style to simplify
            // If you want a background image, you'd need to manage it differently or use a div inside with the image
            background: "linear-gradient(to right, rgba(220, 38, 38, 0.8), rgba(30, 30, 30, 0.8))",
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="container px-8 py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-3 text-white">Fresh Off The Rack</h2>
            <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
              Discover the latest in streetwear fashion before anyone else. Updated weekly with the freshest styles.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Skeleton className="w-full h-80" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <p className="text-red-400">Failed to load products. Please try again later.</p>
          </div>
        ) : products.length === 0 ? (
          <div
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <i className="ri-search-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No new products found</h2>
            <p className="text-[#BBBBBB] mb-4">Check back soon for our next drop!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Newsletter signup */}
        <div
          className="mt-16 p-8 rounded-xl"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-semibold mb-2">Get early access to new drops</h3>
              <p className="text-[#BBBBBB]">Subscribe to our newsletter and be the first to know about new arrivals</p>
            </div>
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="bg-[rgba(42,42,42,0.7)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 mb-3 sm:mb-0 sm:mr-3 w-full md:w-auto focus:outline-none focus:border-red-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-[#e03535] text-white px-6 py-2 rounded-full transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
