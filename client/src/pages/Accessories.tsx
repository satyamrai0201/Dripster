import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Import Supabase client
import { supabase } from '../lib/supabaseClient';

export default function Accessories() {
  const [sortBy, setSortBy] = useState('newest'); // Default sort
  const [gender, setGender] = useState('all'); // Default gender filter

  // Use gender and sortBy as part of the query key
  const queryKey = ['accessories', gender, sortBy];

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        // Always filter by category 'accessories' for this page
        .eq('category', 'accessories');

      // Apply gender filter if not 'all'
      if (gender !== 'all') {
        query = query.eq('gender', gender);
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
         case 'popularity':
          // Assuming 'review_count' is a proxy for popularity
          // If you have a dedicated popularity score or view count, use that
          query = query.order('review_count', { ascending: false });
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

  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  return (
    <>
      <Helmet>
        <title>Accessories | Dripster</title>
        <meta
          name="description"
          content="Shop our accessories collection at Dripster. Find the perfect finishing touches for your streetwear outfits."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">Accessories</h1>
            <p className="text-[#BBBBBB] mb-4">Complete your look with our premium accessories</p>
            {products && (
              <p className="text-[#BBBBBB]">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gender Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" onValueChange={handleGenderChange}>
            <TabsList className="bg-[rgba(42,42,42,0.7)]">
              <TabsTrigger value="all">All Accessories</TabsTrigger>
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
            </TabsList>
          </Tabs>
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
            <p>Failed to load products. Please try again later.</p>
          </div>
        ) : products && products.length === 0 ? (
          <div
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <i className="ri-handbag-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No accessories found</h2>
            <p className="text-[#BBBBBB] mb-4">Try a different category or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Style Guide */}
        <div
          className="mt-16 p-8 rounded-xl"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8 flex-1">
              <h3 className="text-xl font-semibold mb-2">How to Style Accessories</h3>
              <p className="text-[#BBBBBB] mb-4">
                The right accessories can take your outfit from basic to bold. Here are our top tips for styling accessories:
              </p>
              <ul className="list-disc list-inside text-[#BBBBBB] space-y-2">
                <li>Less is more - choose 1-2 statement pieces</li>
                <li>Match metals for a cohesive look</li>
                <li>Consider your outfit's color palette</li>
                <li>Balance proportions for visual harmony</li>
              </ul>
            </div>
            <div
              className="flex-1 h-48 rounded-xl"
              style={{
                background: 'rgba(220, 38, 38, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Placeholder for style guide image */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
