import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
// Assuming your Product type matches the Supabase table structure
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';
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


const allCategories = ['tshirts', 'hoodies', 'tops', 'sweatshirts'];
const genders = ['men', 'women'];

export default function FitsPage() {
  const [sortBy, setSortBy] = useState('newest'); // Default sort
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Use selectedGender, selectedCategory, and sortBy as part of the query key
  const queryKey = ['fits', selectedGender, selectedCategory, sortBy];

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');

      // Apply category filter: if a specific category is selected, filter by it.
      // Otherwise, filter by all categories in the allCategories array.
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      } else {
        query = query.in('category', allCategories);
      }

      // Apply gender filter if selected
      if (selectedGender) {
        query = query.eq('gender', selectedGender);
      }

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

  return (
    <>
      <Helmet>
        <title>Fits | Dripster</title>
        <meta
          name="description"
          content="Explore the freshest fits in streetwear. Find tees, hoodies, sweatshirts and more in the Dripster Fits collection."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* All Fashion Dresses Banner */}
<div className="mb-12 rounded-xl bg-gradient-to-r from-[#a52a2a] via-[#7b1e1e] to-[#1e1e1e] p-8 md:p-20 text-center text-white shadow-lg min-h-[320px] flex flex-col items-center justify-center">
  <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat mb-4">
    Dresses That Define Your Style
  </h2>
  <p className="max-w-2xl mx-auto text-base md:text-lg text-[#F3E5F5]">
    From Tees to bold Sweatshirts, explore fits made to turn heads and elevate everyday elegance. Designed for every body, every mood, every moment.
  </p>
</div>

        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">Fits</h1>
            <p className="text-[#BBBBBB] mb-4">Your go-to gear for everyday streetwear vibes</p>
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

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Gender:</span>
            {genders.map((gender) => (
              <button
                key={gender}
                onClick={() =>
                  setSelectedGender(gender === selectedGender ? null : gender)
                }
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  selectedGender === gender
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-gray-300 hover:border-red-500'
              }`}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Category:</span>
             {/* Add an 'All' button for categories */}
             <button
                key="all"
                onClick={() => setSelectedCategory(null)} // Set to null for 'All'
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === null
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                All
              </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(cat === selectedCategory ? null : cat)
                }
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
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
              border: '1px solid rgba(255, 255, 255, 0.1)',
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
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <i className="ri-search-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No fits found</h2>
            <p className="text-[#BBBBBB] mb-4">
              Try different categories or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
           {/* The filtering logic here is no longer needed as Supabase handles it */}
           {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
