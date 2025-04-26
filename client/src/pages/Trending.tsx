import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
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

export default function Trending() {
  const [sortBy, setSortBy] = useState('popularity');

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products?trending=true&sortBy=${sortBy}`]
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
            {products && (
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
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/trending-banner.jpg')",
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
            <i className="ri-fire-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No trending products found</h2>
            <p className="text-[#BBBBBB] mb-4">Check back soon for hot new trends!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map(product => (
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