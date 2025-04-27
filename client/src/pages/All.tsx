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
import { supabase } from '../lib/supabaseClient';

const GENDERS = ['men', 'women'];

export default function AllProductsPage() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest'); // Default sort

  // Use the selectedGender and sortBy as part of the query key
  const queryKey = ['products', selectedGender, sortBy];

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase.from('products').select('*');

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
        <title>All Products | Dripster</title>
        <meta
          name="description"
          content="Browse all fashion products from Dripster. Find your fit across all categories and styles."
        />
      </Helmet>

      <section className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">All Products</h1>
            <p className="text-[#BBBBBB] mb-2">
              Dive into our complete collection of curated fashion pieces.
            </p>
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

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Gender:</span>
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

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[360px] w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-xl text-center border border-[rgba(255,255,255,0.1)] bg-[rgba(30,30,30,0.7)]">
            <p className="text-red-400">Failed to load products. Please try again later.</p>
          </div>
        ) : Array.isArray(products) && products.length === 0 ? (
          <div className="text-center text-[#BBBBBB] mt-8">
            <i className="ri-search-line text-4xl mb-3" />
            <p className="text-lg font-semibold">No products found</p>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
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