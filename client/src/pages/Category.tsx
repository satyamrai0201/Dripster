import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product, Gender, ProductCategory } from '@/types';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { Checkbox } from '@/components/ui/checkbox';
import { debounce } from '@/lib/utils';
import { Helmet } from 'react-helmet';

// Get category display name
const getCategoryDisplayName = (category?: string) => {
  if (!category) return 'All Products';
  
  const map: Record<string, string> = {
    'tshirts': 'T-Shirts',
    'hoodies': 'Hoodies',
    'sneakers': 'Sneakers',
    'accessories': 'Accessories',
    'tops': 'Tops',
    'sweatshirts': 'Sweatshirts'
  };
  
  return map[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

export default function Category() {
  const { gender, category } = useParams<{ gender: Gender; category?: ProductCategory }>();
  const [location, setLocation] = useLocation();
  
  // Parse URL search parameters
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialFilter = searchParams.get('filter') || '';
  const initialTrending = searchParams.get('trending') === 'true';
  const initialIsNew = searchParams.get('isNew') === 'true';
  const initialOnSale = searchParams.get('onSale') === 'true';
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(category);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filter, setFilter] = useState<string>(initialFilter);
  const [trending, setTrending] = useState<boolean>(initialTrending);
  const [isNew, setIsNew] = useState<boolean>(initialIsNew);
  const [onSale, setOnSale] = useState<boolean>(initialOnSale);
  
  // Create query string based on filters
  const getQueryString = () => {
    const params = new URLSearchParams();
    
    if (filter) params.append('filter', filter);
    if (trending) params.append('trending', 'true');
    if (isNew) params.append('isNew', 'true');
    if (onSale) params.append('onSale', 'true');
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 10000) params.append('maxPrice', priceRange[1].toString());
    if (selectedSizes.length > 0) params.append('sizes', selectedSizes.join(','));
    if (minRating > 0) params.append('minRating', minRating.toString());
    if (sortBy !== 'newest') params.append('sortBy', sortBy);
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };
  
  // Update URL when filters change
  useEffect(() => {
    const newQueryString = getQueryString();
    const newPath = `/category/${gender}${selectedCategory ? `/${selectedCategory}` : ''}${newQueryString}`;
    
    if (newPath !== location) {
      setLocation(newPath);
    }
  }, [selectedCategory, priceRange, selectedSizes, minRating, sortBy, filter, trending, isNew, onSale]);
  
  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products?gender=${gender}${category ? `&category=${category}` : ''}&${getQueryString()}`]
  });
  
  // For mobile filter toggle
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? undefined : value);
  };
  
  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };
  
  // Debounced price change
  const debouncedPriceChange = debounce(handlePriceChange, 500);
  
  // Handle size toggle
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };
  
  // Handle rating change
  const handleRatingChange = (value: string) => {
    setMinRating(parseInt(value));
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCategory(category);
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setMinRating(0);
    setSortBy('newest');
    setFilter('');
    setTrending(false);
    setIsNew(false);
    setOnSale(false);
  };
  
  // Get title based on parameters
  const getTitle = () => {
    const categoryName = getCategoryDisplayName(category);
    const genderPrefix = gender === 'all' ? '' : (gender === 'men' ? "Men's" : "Women's");
    
    if (trending) return `Trending Products`;
    if (isNew) return `New Arrivals`;
    if (onSale) return `Sale Products`;
    
    if (filter) {
      if (filter === 'new') return `New Arrivals - ${genderPrefix} Fashion`;
      if (filter === 'trending') return `Trending - ${genderPrefix} Fashion`;
      if (filter === 'sale') return `Sale - ${genderPrefix} Fashion`;
    }
    
    return category ? `${genderPrefix} ${categoryName}` : (genderPrefix ? `${genderPrefix} Fashion` : 'All Products');
  };

  return (
    <>
      <Helmet>
        <title>{getTitle()} | Dripster</title>
        <meta name="description" content={
          gender === 'all'
            ? `Shop the latest ${category || (trending ? 'trending' : (isNew ? 'new arrivals' : (onSale ? 'sale items' : 'fashion')))} at Dripster. Find the best streetwear styles.`
            : `Shop the latest ${gender}'s ${category || (trending ? 'trending' : (isNew ? 'new arrivals' : (onSale ? 'sale items' : 'fashion')))} at Dripster. Find the best streetwear styles.`
        } />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold">{getTitle()}</h1>
            {products && (
              <p className="text-[#BBBBBB] mt-2">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <button 
              className="md:hidden flex items-center bg-[rgba(42,42,42,0.7)] hover:bg-[rgba(62,62,62,0.7)] px-4 py-2 rounded-full transition-colors mr-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="ri-filter-3-line mr-2"></i>
              Filters
            </button>
            
            <Select value={sortBy} onValueChange={handleSortChange}>
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
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div 
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block md:w-64 sticky top-32 self-start`}
          >
            <div 
              className="p-6 rounded-xl mb-4"
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-montserrat font-semibold">Filters</h3>
                <button 
                  className="text-primary text-sm hover:underline"
                  onClick={handleClearFilters}
                >
                  Clear All
                </button>
              </div>
              
              {/* Category filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <Select 
                  value={selectedCategory || 'all'} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {gender === 'men' ? (
                      <>
                        <SelectItem value="tshirts">T-Shirts</SelectItem>
                        <SelectItem value="hoodies">Hoodies</SelectItem>
                        <SelectItem value="sneakers">Sneakers</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                        <SelectItem value="sneakers">Sneakers</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={500}
                    minStepsBetweenThumbs={1}
                    onValueChange={debouncedPriceChange}
                    className="mb-4"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              
              {/* Size filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox 
                        checked={selectedSizes.includes(size)} 
                        onCheckedChange={() => handleSizeToggle(size)}
                        className="border-[rgba(255,255,255,0.3)]"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Rating filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">Rating</h4>
                <Select 
                  value={minRating.toString()} 
                  onValueChange={handleRatingChange}
                >
                  <SelectTrigger className="w-full bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)]">
                    <SelectValue placeholder="Minimum rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
                <i className="ri-search-line text-5xl text-[#BBBBBB] mb-4"></i>
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-[#BBBBBB] mb-4">Try adjusting your filters or explore our other categories.</p>
                <button 
                  className="px-6 py-2 bg-primary hover:bg-[#e03535] text-white rounded-full transition-colors"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
