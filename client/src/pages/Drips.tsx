import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
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

const DRIPS_CATEGORIES = ['accessories'];
const GENDERS = ['men', 'women'];

export default function DripsPage() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('accessories');
  const [sortBy, setSortBy] = useState('newest');

  const queryString = new URLSearchParams({
    ...(selectedGender ? { gender: selectedGender } : {}),
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(sortBy ? { sortBy } : {}),
  }).toString();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/drips', queryString],
    queryFn: async () => {
      const res = await fetch(`/api/products?${queryString}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  return (
    <>
      <Helmet>
        <title>Drips | Dripster</title>
        <meta 
          name="description" 
          content="Accessorize your fit with stylish drips from Dripster. Shop premium accessories for men and women." 
        />
      </Helmet>

      <section className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-2">Drips</h1>
            <p className="text-[#BBBBBB] mb-2">
              Finish your outfit with next-level accessories for every vibe.
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

        {/* Red Banner */}
<div className="mb-12 rounded-xl bg-gradient-to-r from-[#a52a2a] via-[#7b1e1e] to-[#1e1e1e] p-8 md:p-20 text-center text-white shadow-lg min-h-[320px] flex flex-col items-center justify-center">
  <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat mb-4">
  Get Equipped for the Everyday Hustle
  </h2>
  <p className="max-w-2xl mx-auto text-base md:text-lg text-[#DDDDDD]">
    Explore top-tier accessories made for men and women from watches and betl to standout tote bags and hats.
    Style starts here.
  </p>
</div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap mb-10">
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
            <p className="text-red-400">Failed to load drips. Please try again later.</p>
          </div>
        )}

        {/* No Products */}
        {!isLoading && Array.isArray(products) && products.length === 0 && (
          <div className="text-center text-[#BBBBBB] mt-8">
            <i className="ri-search-line text-4xl mb-3" />
            <p className="text-lg font-semibold">No accessories found</p>
            <p>Try adjusting your filters.</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && Array.isArray(products) && products.length > 0 && (
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