import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter'; // Assuming wouter is used for routing, though not directly used in this component for navigation
// Assuming your Product type matches the Supabase table structure
import { Product } from '../types';
import { ProductCard } from '../components/ui/product-card';
import { Skeleton } from '../components/ui/skeleton';
// Assuming useToast is correctly implemented
import { useToast } from '../hooks/use-toast'; // Assuming this hook is correctly imported and used
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// Import Supabase client
import { supabase } from '../lib/supabaseClient';

export default function Sale() {
  const [sortBy, setSortBy] = useState('discount'); // Default sort
  const [email, setEmail] = useState(''); // State for the email input
  const { toast } = useToast(); // Hook for displaying toasts

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown Timer Logic (remains unchanged as it's client-side)
  useEffect(() => {
    const storedEndDate = localStorage.getItem('saleEndDate');
    if (!storedEndDate) {
      // If no end date is stored, set it to 3 weeks from now
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 21); // 3 weeks = 21 days
      localStorage.setItem('saleEndDate', endDate.toISOString());
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const storedEndDate = localStorage.getItem('saleEndDate');
      if (!storedEndDate) return;

      const saleEndDate = new Date(storedEndDate);
      const now = new Date();
      const difference = saleEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Use sortBy as part of the query key
  // The 'on sale' filter is fixed in the queryFn, so it doesn't need to be in the query key for refetching
  const queryKey = ['sale-products', sortBy];

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
        // Filter for products that are on sale.
        // Assuming a product is on sale if original_price is not null
        // and greater than price, or if the 'discount' column is greater than 0.
        // Using 'original_price' is not null as the primary indicator of being on sale.
        .not('original_price', 'is', null);


      // Apply sorting
      switch (sortBy) {
        case 'discount':
          // Assuming 'discount' column exists and represents the discount amount/percentage
          query = query.order('discount', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          // Assuming 'id' or 'created_at' is a good indicator of newest
          // If you have a 'created_at' timestamp column, use that instead of 'id'
          query = query.order('id', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          // Default sorting if no option is selected or recognized
           query = query.order('discount', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || []; // Return empty array if data is null
    },
  });

  // Newsletter signup logic - MOVED INSIDE THE COMPONENT
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Here you would typically send the email to your backend or a Supabase Edge Function
    console.log('Subscribing email:', email); // Keeping console log for demonstration

    // Example of how you might call a Supabase Function for subscriptions (commented out)
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
    //      toast({
    //        title: "Successfully Subscribed!",
    //        description: "You'll be the first to know about new drops.",
    //        duration: 3000,
    //      });
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
        <title>Sale | Dripster</title>
        <meta
          name="description"
          content="Shop our sale collection at Dripster. Get the best deals on streetwear fashion and urban style."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">Sale</h1>
            <p className="text-[#BBBBBB] mb-4">Limited time offers on premium streetwear</p>
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
                <SelectItem value="discount">Biggest Discount</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Banner */}
        <div
          className="w-full h-64 md:h-80 rounded-xl mb-12 bg-cover bg-center flex items-center"
          style={{
            // Removed the static background image as local asset paths are not accessible
            // If you want a background image, you'd need to store it in Supabase Storage
            background: "linear-gradient(to right, rgba(220, 38, 38, 0.8), rgba(0, 0, 0, 0.8))",
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="container px-8 py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-3 text-white">Limited Time Offers</h2>
            <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
              Up to 50% off on selected items. Premium streetwear at unbeatable prices.
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
            <i className="ri-price-tag-3-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No sale products available</h2>
            <p className="text-[#BBBBBB] mb-4">Check back soon for upcoming sales and offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Countdown Timer */}
        <div
          className="mt-16 p-8 rounded-xl"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Sale Ends In:</h3>
            <div className="flex justify-center space-x-4 my-6">
              <div className="bg-[rgba(220,38,38,0.2)] p-4 rounded-xl min-w-20">
                <div className="text-3xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
                <div className="text-sm text-[#BBBBBB]">Days</div>
              </div>
              <div className="bg-[rgba(220,38,38,0.2)] p-4 rounded-xl min-w-20">
                <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm text-[#BBBBBB]">Hours</div>
              </div>
              <div className="bg-[rgba(220,38,38,0.2)] p-4 rounded-xl min-w-20">
                <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm text-[#BBBBBB]">Minutes</div>
              </div>
              <div className="bg-[rgba(220,38,38,0.2)] p-4 rounded-xl min-w-20">
                <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm text-[#BBBBBB]">Seconds</div>
              </div>
            </div>
            <p className="text-[#BBBBBB] mb-4">Don't miss out on these incredible deals!</p>
          </div>
        </div>
      </div>
    </>
  );
}
