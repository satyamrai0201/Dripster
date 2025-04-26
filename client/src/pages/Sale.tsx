import { useState, useEffect } from 'react';
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

export default function Sale() {
  const [sortBy, setSortBy] = useState('discount');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Get or set the sale end date in localStorage
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

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products?onSale=true&sortBy=${sortBy}`]
  });

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
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/assets/sale-banner.jpg')",
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
            <i className="ri-price-tag-3-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">No sale products available</h2>
            <p className="text-[#BBBBBB] mb-4">Check back soon for upcoming sales and offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map(product => (
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