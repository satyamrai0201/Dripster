import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { formatPrice } from '@/lib/utils';
import { Size } from '@/types';
import { Helmet } from 'react-helmet';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  // Use localStorage for wishlist
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [filteredWishlist, setFilteredWishlist] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Get wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const wishlistString = localStorage.getItem('dripster-wishlist');
      if (wishlistString) {
        const parsedWishlist = JSON.parse(wishlistString);
        setWishlist(parsedWishlist);
        setFilteredWishlist(parsedWishlist);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      setIsLoading(false);
    }
  }, []);
  
  // Filter wishlist items when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWishlist(wishlist);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = wishlist.filter((item) => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
      setFilteredWishlist(filtered);
    }
  }, [searchQuery, wishlist]);
  
  // Function to remove item from wishlist
  const removeFromWishlist = (productId: number) => {
    try {
      const newWishlist = wishlist.filter(item => item.id !== productId);
      setWishlist(newWishlist);
      localStorage.setItem('dripster-wishlist', JSON.stringify(newWishlist));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };
  
  // Function to add item to cart
  const addToCart = (product: any, quantity: number, size: Size) => {
    try {
      // Get existing cart from local storage
      const cartString = localStorage.getItem('dripster-cart');
      let cart = cartString ? JSON.parse(cartString) : [];
      
      // Check if product with same size already exists in cart
      const existingItemIndex = cart.findIndex(
        (item: any) => item.product.id === product.id && item.size === size
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.push({
          product,
          quantity,
          size,
          color: undefined
        });
      }
      
      // Save updated cart back to local storage
      localStorage.setItem('dripster-cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  const [selectedSizes, setSelectedSizes] = useState<Record<number, Size>>({});

  // Handle adding item to cart
  const handleAddToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    const size = selectedSizes[productId];
    
    if (product && size) {
      addToCart(product, 1, size);
      removeFromWishlist(productId);
    }
  };

  // Handle size selection for a product
  const handleSizeSelect = (productId: number, size: Size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  return (
    <>
      <Helmet>
        <title>Your Wishlist | Dripster</title>
        <meta name="description" content="View and manage your wishlist items at Dripster." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-6">Your Wishlist</h1>
        
        {/* Search Component */}
        {wishlist.length > 0 && (
          <div className="mb-8" 
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search your wishlist items"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)] focus-visible:ring-primary"
                />
              </div>
              <Button 
                variant="outline" 
                className="bg-transparent border-[rgba(255,255,255,0.1)] hover:bg-[rgba(80,80,80,0.3)]"
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            </div>
            
            {searchQuery && (
              <div className="mt-4 text-sm text-muted-foreground">
                Found {filteredWishlist.length} {filteredWishlist.length === 1 ? 'item' : 'items'} matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
        
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
        ) : wishlist.length === 0 ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <i className="ri-heart-line text-5xl text-[#BBBBBB] mb-4"></i>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-[#BBBBBB] mb-6">Discover and save your favorite items while browsing.</p>
            <Link href="/category/all">
              <a className="px-6 py-3 bg-primary hover:bg-[#e03535] text-white rounded-full font-montserrat font-semibold transition-colors">
                Start Shopping
              </a>
            </Link>
          </div>
        ) : filteredWishlist.length === 0 && searchQuery ? (
          <div 
            className="p-8 rounded-xl text-center"
            style={{
              background: 'rgba(30, 30, 30, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Search className="w-12 h-12 text-[#BBBBBB] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No matching items found</h2>
            <p className="text-[#BBBBBB] mb-6">Try adjusting your search term or browse your other wishlist items.</p>
            <Button
              variant="outline"
              className="bg-transparent border-[rgba(255,255,255,0.1)] hover:bg-[rgba(80,80,80,0.3)]"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWishlist.map(product => (
              <div 
                key={product.id} 
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(30, 30, 30, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <a>
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-60 object-cover"
                      />
                    </a>
                  </Link>
                  <button 
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(30,30,30,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(40,40,40,0.8)] transition-colors"
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
                
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <a className="block mb-2">
                      <h3 className="font-montserrat font-semibold hover:text-primary transition-colors">{product.name}</h3>
                    </a>
                  </Link>
                  
                  <p className="text-[#BBBBBB] text-sm mb-3">
                    {product.gender === 'men' ? "Men's" : "Women's"} {product.category}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-lg font-montserrat font-semibold">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-[#BBBBBB] line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <i className="ri-star-fill text-[#FFC107] text-sm"></i>
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Select 
                      onValueChange={(value) => handleSizeSelect(product.id, value as Size)} 
                      value={selectedSizes[product.id]}
                    >
                      <SelectTrigger className="w-full bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size: Size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <button 
                      className="w-full py-2 rounded-full bg-primary hover:bg-[#e03535] text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!selectedSizes[product.id]}
                    >
                      <i className="ri-shopping-cart-2-line mr-2"></i> Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
