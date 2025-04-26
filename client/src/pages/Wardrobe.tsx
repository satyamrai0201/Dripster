import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Product, ProductCategory } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function Wardrobe() {
  const { isAuthenticated, user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  
  // Fetch user's wardrobe items
  const { data: wardrobe, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/wardrobe'],
    enabled: isAuthenticated,
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      window.location.href = '/login?redirect=wardrobe';
    }
  }, [isAuthenticated, isLoading]);
  
  // Filter products by category
  const filteredProducts = wardrobe?.filter(product => 
    activeCategory === 'all' || product.category === activeCategory
  );
  
  // Group products by category for statistics
  const categoryStats = wardrobe?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Get total wardrobe value
  const totalValue = wardrobe?.reduce((sum, product) => sum + product.price, 0) || 0;
  
  // Get random outfit suggestion (one item from each major category)
  const getOutfitSuggestion = () => {
    if (!wardrobe || wardrobe.length === 0) return [];
    
    const outfit: Product[] = [];
    
    // Try to get one top (t-shirt or top)
    const tops = wardrobe.filter(p => p.category === 'tshirts' || p.category === 'tops');
    if (tops.length > 0) {
      outfit.push(tops[Math.floor(Math.random() * tops.length)]);
    }
    
    // Try to get one layering piece (hoodie or sweatshirt)
    const layers = wardrobe.filter(p => p.category === 'hoodies' || p.category === 'sweatshirts');
    if (layers.length > 0) {
      outfit.push(layers[Math.floor(Math.random() * layers.length)]);
    }
    
    // Try to get footwear
    const footwear = wardrobe.filter(p => p.category === 'sneakers');
    if (footwear.length > 0) {
      outfit.push(footwear[Math.floor(Math.random() * footwear.length)]);
    }
    
    // Try to get accessories
    const accessories = wardrobe.filter(p => p.category === 'accessories');
    if (accessories.length > 0) {
      outfit.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }
    
    return outfit;
  };
  
  const outfitSuggestion = getOutfitSuggestion();

  if (!isAuthenticated && !isLoading) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Your Wardrobe | Dripster</title>
        <meta name="description" content="View your virtual wardrobe of purchased items at Dripster." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">Your Virtual Wardrobe</h1>
        
        {isLoading ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-700 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/5"></div>
            </div>
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
            <h2 className="text-xl font-semibold mb-2">Failed to load your wardrobe</h2>
            <p className="text-[#BBBBBB] mb-4">Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary hover:bg-[#e03535] text-white rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (!wardrobe || wardrobe.length === 0) ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <i className="ri-t-shirt-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Your wardrobe is empty</h2>
            <p className="text-[#BBBBBB] mb-6">Items you purchase will appear in your virtual wardrobe.</p>
            <Link href="/category/all">
              <a className="px-6 py-3 bg-primary hover:bg-[#e03535] text-white rounded-full font-montserrat font-semibold transition-colors">
                Start Shopping
              </a>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wardrobe stats */}
            <div>
              <div 
                className="rounded-xl p-6 mb-6"
                style={{
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h2 className="text-xl font-montserrat font-semibold mb-4">Wardrobe Stats</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[#BBBBBB] mb-1">Total Items</p>
                    <p className="text-2xl font-montserrat font-semibold">{wardrobe.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-[#BBBBBB] mb-1">Total Value</p>
                    <p className="text-2xl font-montserrat font-semibold text-primary">{formatPrice(totalValue)}</p>
                  </div>
                  
                  <div>
                    <p className="text-[#BBBBBB] mb-2">Item Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(categoryStats).map(([category, count]) => (
                        <div key={category} className="flex justify-between">
                          <span className="capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Outfit suggestion */}
              {outfitSuggestion.length > 0 && (
                <div 
                  className="rounded-xl p-6"
                  style={{
                    background: 'rgba(30, 30, 30, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <h2 className="text-xl font-montserrat font-semibold mb-4">Outfit Suggestion</h2>
                  
                  <div className="space-y-3">
                    {outfitSuggestion.map(item => (
                      <Link key={item.id} href={`/product/${item.id}`}>
                        <a className="flex items-center p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded-md"
                          />
                          <div className="ml-3">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-[#BBBBBB]">{item.category}</p>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                  
                  <button 
                    className="w-full mt-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                    onClick={() => getOutfitSuggestion()}
                  >
                    Get New Suggestion
                  </button>
                </div>
              )}
            </div>
            
            {/* Wardrobe items */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-xl p-6"
                style={{
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as ProductCategory | 'all')}>
                  <TabsList className="mb-6 bg-[rgba(42,42,42,0.7)]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="tshirts">T-Shirts</TabsTrigger>
                    <TabsTrigger value="hoodies">Hoodies</TabsTrigger>
                    <TabsTrigger value="tops">Tops</TabsTrigger>
                    <TabsTrigger value="sweatshirts">Sweatshirts</TabsTrigger>
                    <TabsTrigger value="sneakers">Footwear</TabsTrigger>
                    <TabsTrigger value="accessories">Accessories</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts?.map(product => (
                        <Link key={product.id} href={`/product/${product.id}`}>
                          <a className="flex rounded-lg overflow-hidden bg-[rgba(40,40,40,0.5)] hover:bg-[rgba(50,50,50,0.5)] transition-colors">
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-24 h-24 object-cover"
                            />
                            <div className="p-3 flex-1">
                              <h3 className="font-montserrat font-medium mb-1">{product.name}</h3>
                              <p className="text-sm text-[#BBBBBB] mb-2">
                                {product.gender === 'men' ? "Men's" : "Women's"} {product.category}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                                <div className="flex items-center">
                                  <i className="ri-star-fill text-[#FFC107] text-xs"></i>
                                  <span className="text-xs ml-1">{product.rating}</span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {/* Other tab contents will match the filtered list since we're updating activeCategory */}
                  {['tshirts', 'hoodies', 'tops', 'sweatshirts', 'sneakers', 'accessories'].map(cat => (
                    <TabsContent key={cat} value={cat} className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProducts?.map(product => (
                          <Link key={product.id} href={`/product/${product.id}`}>
                            <a className="flex rounded-lg overflow-hidden bg-[rgba(40,40,40,0.5)] hover:bg-[rgba(50,50,50,0.5)] transition-colors">
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-24 h-24 object-cover"
                              />
                              <div className="p-3 flex-1">
                                <h3 className="font-montserrat font-medium mb-1">{product.name}</h3>
                                <p className="text-sm text-[#BBBBBB] mb-2">
                                  {product.gender === 'men' ? "Men's" : "Women's"} {product.category}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                                  <div className="flex items-center">
                                    <i className="ri-star-fill text-[#FFC107] text-xs"></i>
                                    <span className="text-xs ml-1">{product.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
