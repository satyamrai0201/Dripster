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


const KICKS_CATEGORIES = ['sneakers']; // Keeping this for reference, but filtering directly
const GENDERS = ['men', 'women'];

export default function KicksPage() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  // Keeping selectedCategory state, but it's defaulted to 'sneakers' and not changed in this component
  const [selectedCategory, setSelectedCategory] = useState<string | null>('sneakers');
  const [sortBy, setSortBy] = useState('newest'); // Default sort

  // Use selectedGender, selectedCategory, and sortBy as part of the query key
  const queryKey = ['kicks', selectedGender, selectedCategory, sortBy];

  const {
    data: products = [], // ✅ Default fallback to avoid undefined error
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        // Always filter by category 'sneakers' for this page
        .eq('category', 'sneakers'); // Use the fixed category

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

  // Note: Category filter is fixed to 'sneakers' in state and not changed by UI elements here.
  // If you add category filters later, you would need to adjust the state and query logic.

  return (
    <>
      <Helmet>
        <title>Kicks | Dripster</title>
        <meta
          name="description"
          content="Shop the freshest kicks and sneakers on Dripster. Explore trendy styles for men and women."
        />
      </Helmet>

      <section className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">Kicks</h1>
            <p className="text-[#BBBBBB] mb-2">
              Explore the freshest sneaker drops and trendy kicks for all.
            </p>
            {/* Product count now reflects the filtered data from Supabase */}
            <p className="text-[#BBBBBB]">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Sorting */}
          <div className="mt-4 md:mt-0">
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

        {/* Sneakers Banner */}
<div className="mb-12 rounded-xl bg-gradient-to-r from-[#a52a2a] via-[#7b1e1e] to-[#1e1e1e] p-8 md:p-20 text-center text-white shadow-lg min-h-[320px] flex flex-col items-center justify-center">
  <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat mb-4">
    Step Up Your Game
  </h2>
  <p className="max-w-2xl mx-auto text-base md:text-lg text-[#DDDDDD]">
    Discover sneakers that move with you—built for comfort, designed for bold expression. From casual kicks to performance-ready styles, this is where street meets sport.
  </p>
</div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Gender:</span>
            {/* Add an 'All' button for gender */}
             <button
                key="all"
                onClick={() => setSelectedGender(null)} // Set to null for 'All'
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  selectedGender === null
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-gray-300 hover:border-red-500'
              }`}
              >
                All
              </button>
            {GENDERS.map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender === selectedGender ? null : gender)}
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
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[360px] w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-8 rounded-xl text-center border border-[rgba(255,255,255,0.1)] bg-[rgba(30,30,30,0.7)]">
            <p className="text-red-400">Failed to load kicks. Please try again later.</p>
          </div>
        )}

        {/* No Products */}
        {!isLoading && products.length === 0 && (
          <div className="text-center text-[#BBBBBB] mt-8">
            <i className="ri-search-line text-4xl mb-3" />
            <p className="text-lg font-semibold">No sneakers found</p>
            <p>Try adjusting your filters.</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up-fade">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
