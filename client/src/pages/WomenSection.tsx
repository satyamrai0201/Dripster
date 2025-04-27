import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
// Assuming your Product type matches the Supabase table structure
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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


const WOMEN_CATEGORIES = ['tops', 'sweatshirts', 'sneakers', 'accessories'];
// Genders is not needed as state/filter for this page, as it's fixed to 'women'
// const GENDERS = ['men', 'women'];

export default function WomenSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // null means 'All' categories
  const [sortBy, setSortBy] = useState('newest'); // Default sort

  // Use selectedCategory and sortBy as part of the query key
  // Gender is fixed to 'women' for this page, so it doesn't need to be in the query key for refetching
  const queryKey = ['women-products', selectedCategory, sortBy];

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        // Always filter by gender 'women' for this page
        .eq('gender', 'women');

      // Apply category filter: if a specific category is selected, filter by it.
      // If selectedCategory is null (meaning 'All'), the query will fetch all women's products
      // without an additional category filter, which aligns with the original logic.
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      // Note: If you strictly only want products from WOMEN_CATEGORIES when 'All' is selected,
      // you would use `.in('category', WOMEN_CATEGORIES)` when selectedCategory is null.
      // This implementation fetches all women's products if no category is selected.

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
        <title>Women | Dripster</title>
        <meta
          name="description"
          content="Explore trending streetwear for women — tops, sweatshirts, sneakers, and accessories to match your vibe."
        />
      </Helmet>

      <section className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-2 text-white">
              Women
            </h1>
            <p className="text-[#BBBBBB] mb-2">
              Discover trending styles for the modern woman — minimal, bold, or both.
            </p>
            {/* Product count now reflects the filtered data from Supabase */}
            {Array.isArray(products) && (
              <p className="text-[#BBBBBB]">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
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

        {/* Red Banner */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-[#a52a2a] via-[#7b1e1e] to-[#1e1e1e] p-8 md:p-20 text-center text-white shadow-lg min-h-[320px] flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat mb-4">
            Redefine Everyday Fits
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#DDDDDD]">
            Discover top-tier streetwear designed for women — from stylish tops and sweatshirts
            to eye-catching sneakers and accessories. Your fit, your rules.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap mb-10">
          <span className="font-semibold text-white">Category:</span>
          {/* Add an 'All' button for categories */}
          <button
            key="all"
            onClick={() => setSelectedCategory(null)} // Set to null for 'All'
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
              ${
                selectedCategory === null
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-gray-300 hover:border-red-500'
              }
            `}
          >
            All
          </button>
          {WOMEN_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-black border-gray-300 hover:border-red-500'
                }
              `}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
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
          <div className="p-8 rounded-xl text-center border border-red-600 bg-[rgba(30,30,30,0.7)]">
            <p className="text-red-400">Failed to load products. Please try again later.</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && Array.isArray(products) && products.length === 0 && (
          <div className="text-center text-[#BBBBBB] mt-8">
            <i className="ri-search-line text-4xl mb-3" />
            <p className="text-lg font-semibold">No results found</p>
            <p>Try adjusting your filters.</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && Array.isArray(products) && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up-fade">
            {/* The filtering logic here is no longer needed as Supabase handles it */}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
