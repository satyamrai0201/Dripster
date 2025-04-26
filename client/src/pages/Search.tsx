import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Product } from '@/types';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { Helmet } from 'react-helmet';

export default function Search() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);
  
  // Fetch search results
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`],
    enabled: searchQuery.trim().length > 0,
  });
  
  // Debounced search query handler
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  const updateQuery = debounce((value: string) => {
    setDebouncedSearchQuery(value);
    
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set('q', value);
    window.history.replaceState({}, '', url.toString());
  }, 500);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateQuery(value);
  };

  return (
    <>
      <Helmet>
        <title>{searchQuery ? `Search: ${searchQuery}` : 'Search'} | Dripster</title>
        <meta name="description" content="Search for fashion products at Dripster." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">Search Products</h1>
        
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products, brands, categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-[#2A2A2A] border-[rgba(255,255,255,0.1)] focus:border-primary py-6 pl-12 text-lg"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#BBBBBB]">
              <i className="ri-search-line text-xl"></i>
            </div>
          </div>
        </div>
        
        {searchQuery.trim() === '' ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <i className="ri-search-2-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Start typing to search</h2>
            <p className="text-[#BBBBBB]">Search for products by name, category, or keywords</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <i className="ri-error-warning-line text-5xl text-red-500 mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Error loading search results</h2>
            <p className="text-[#BBBBBB] mb-4">Please try again later or refine your search.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                {products?.length ? (
                  <>{products.length} result{products.length !== 1 ? 's' : ''} for "{debouncedSearchQuery}"</>
                ) : (
                  <>No results found for "{debouncedSearchQuery}"</>
                )}
              </h2>
            </div>
            
            {products?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div 
                className="p-8 rounded-xl text-center"
                style={{
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <i className="ri-file-search-line text-5xl text-[#BBBBBB] mb-4"></i>
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-[#BBBBBB] mb-4">Try different keywords or browse our categories.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
