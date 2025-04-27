import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter'; // Assuming wouter is used for routing
// Assuming your Product type matches the Supabase table structure
import { Product } from '../types';
import { ProductCard } from '../components/ui/product-card';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// Import Supabase client
import { supabase } from '../lib/supabaseClient';

export default function Trending() {
  const [sortBy, setSortBy] = useState('popularity'); // Default sort

  // Use sortBy as part of the query key
  // The 'trending' filter (based on review_count threshold) is fixed in the queryFn
  const queryKey = ['trending-products', sortBy];

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
        // Filter for "trending" products.
        // ASSUMPTION: Trending products are those with a review_count > 100.
        // You may need to adjust this filter based on your actual definition of "trending".
        // A dedicated boolean 'is_trending' column or a database function might be better.
        .gt('review_count', 100); // Example filter for trending based on popularity


      // Apply sorting
      switch (sortBy) {
        case 'popularity':
          // Assuming 'review_count' is the measure of popularity
          query = query.order('review_count', { ascending: false });
          break;
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
           query = query.order('review_count', { ascending: false });
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
        <title>Trending Now | Dripster</title>
        <meta
          name="description"
          content="Shop what's trending now at Dripster. The hottest streetwear fashion pieces that everyone is talking about."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">Trending Now</h1>
            <p className="text-[#BBBBBB] mb-4">The hottest pieces everyone's talking about</p>
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
                <SelectItem value="popularity">Most Popular</SelectItem>
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
            // Removed the static background image as local asset paths are not accessible
            // If you want a background image, you'd need to store it in Supabase Storage
            background: "linear-gradient(to right, rgba(30, 30, 30, 0.8), rgba(220, 38, 38, 0.8))",
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="container px-8 py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-3 text-white">Hot Right Now</h2>
            <p className="text-gray-200 text-lg mb-6 max-w-2xl mx-auto">
              The most sought-after pieces in street fashion. Get them before they're gone.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[360px] w-full rounded-xl" />
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
            <i className="ri-fire-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No trending products found</h2>
            <p className="text-[#BBBBBB] mb-4">Check back soon for hot new trends!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Trending Categories */}
        <div className="mt-16">
          <h2 className="text-xl md:text-2xl font-montserrat font-bold mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/category/fits" className="rounded-xl h-32 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="font-semibold text-lg">Fits</h3>
            </Link>
            <Link href="/category/kicks" className="rounded-xl h-32 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="font-semibold text-lg">Kicks</h3>
            </Link>
            <Link href="/category/drips" className="rounded-xl h-32 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="font-semibold text-lg">Drips</h3>
            </Link>
            <Link href="/category/all" className="rounded-xl h-32 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="font-semibold text-lg">All</h3>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
