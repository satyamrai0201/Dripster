// In your ProductDetail.tsx component
import useProtectedPurchase from '@/hooks/useProtectedPurchase';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product, Size } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ui/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { attemptPurchase, attemptWishlist } = useProtectedPurchase();

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  // Fetch similar products
  const { data: similarProducts } = useQuery<Product[]>({
    queryKey: [`/api/products/similar/${id}`],
    enabled: !!product,
  });

  // Local storage wishlist functionality
  const isInWishlist = (productId: number): boolean => {
    try {
      const wishlistString = localStorage.getItem('dripster-wishlist');
      if (!wishlistString) return false;

      const wishlist: Product[] = JSON.parse(wishlistString);
      return wishlist.some(item => item.id === productId);
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return false;
    }
  };

  const toggleWishlist = (productToToggle: Product) => {
    if (!attemptWishlist()) {
      return; // Login popup will appear automatically
    }
    try {
      // Get existing wishlist from local storage
      const wishlistString = localStorage.getItem('dripster-wishlist');
      let wishlist: Product[] = wishlistString ? JSON.parse(wishlistString) : [];

      const exists = wishlist.some(item => item.id === productToToggle.id);

      if (exists) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== productToToggle.id);
        setIsFavorite(false);
        toast({
          title: "Removed from wishlist",
          description: `${productToToggle.name} removed from your wishlist`,
        });
      } else {
        // Add to wishlist
        wishlist.push(productToToggle);
        setIsFavorite(true);
        toast({
          title: "Added to wishlist",
          description: `${productToToggle.name} added to your wishlist`,
        });
      }

      // Save updated wishlist back to local storage
      localStorage.setItem('dripster-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error managing wishlist:", error);
      toast({
        title: "Wishlist Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    }
  };

  // Local storage cart functionality
  const addToCart = (productToAdd: Product, qty: number, size: Size) => {
    try {
      if (!size) {
        toast({
          title: "Size required",
          description: "Please select a size before adding to cart",
          variant: "destructive"
        });
        return;
      }

      // Get existing cart from local storage
      const cartString = localStorage.getItem('dripster-cart');
      let cart = cartString ? JSON.parse(cartString) : [];

      // Check if product with same size already exists in cart
      const existingItemIndex = cart.findIndex(
        (item: any) => item.product.id === productToAdd.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        cart[existingItemIndex].quantity += qty;
      } else {
        // Add new item to cart
        cart.push({
          product: productToAdd,
          quantity: qty,
          size,
          color: undefined
        });
      }

      // Save updated cart back to local storage
      localStorage.setItem('dripster-cart', JSON.stringify(cart));

      toast({
        title: "Added to cart",
        description: `${productToAdd.name} (Size: ${size}) added to your cart`,
      });
    } catch (error) {
      console.error("Error managing cart:", error);
      toast({
        title: "Cart Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  // Update favorite status when product changes
  useEffect(() => {
    if (product) {
      setIsFavorite(isInWishlist(product.id));
    }
  }, [id, product]);

  // Handle adding to cart
  const handleAddToCart = () => {
    if (attemptPurchase()) {
      if (product && selectedSize) {
        addToCart(product, quantity, selectedSize);
      }
      // If not logged in, login popup will appear automatically
    }
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (attemptPurchase()) {
      if (product && selectedSize) {
        addToCart(product, quantity, selectedSize);
        navigate('/cart');
      }
      // If not logged in, login popup will appear automatically
    }
  };

  // Update quantity
  const updateQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="glass p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full rounded-xl" />
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-10 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-6" />
              <Skeleton className="h-6 w-full mb-6" />
              <div className="flex gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-32 w-full mb-8" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="glass p-6 rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-[#BBBBBB] mb-4">Sorry, we couldn't find the product you were looking for.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary hover:bg-[#e03535] rounded-full transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Dripster</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="rounded-xl overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === selectedImage ? 'bg-primary' : 'bg-[rgba(255,255,255,0.3)]'
                    }`}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    alt={`${product.name} view ${i + 1}`}
                    className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                      i === selectedImage ? 'border-2 border-primary' : 'border border-[rgba(255,255,255,0.1)]'
                    }`}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-primary text-sm font-medium">
                    {product.gender === 'men' ? "Men's" : "Women's"} {product.category}
                  </span>
                  <h1 className="text-3xl font-montserrat font-bold mt-1">{product.name}</h1>
                </div>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(42, 42, 42, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  onClick={() => toggleWishlist(product)}
                  aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isFavorite ? (
                    <i className="ri-heart-fill text-lg text-primary"></i>
                  ) : (
                    <i className="ri-heart-line text-lg"></i>
                  )}
                </button>
              </div>

              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`${
                        i < Math.floor(product.rating)
                          ? 'ri-star-fill'
                          : i < product.rating
                          ? 'ri-star-half-fill'
                          : 'ri-star-line'
                      } text-[#FFC107] ${i > 0 ? 'ml-1' : ''}`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm ml-2">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-end">
                  <span className="text-3xl font-montserrat font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-[#BBBBBB] line-through ml-3">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="ml-3 text-[#4CAF50] text-sm font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[#BBBBBB] text-sm mt-1">Inclusive of all taxes</p>
              </div>

              <div className="mt-6">
                <h3 className="font-montserrat font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                        selectedSize === size
                          ? 'bg-primary border-primary text-white'
                          : 'border border-[rgba(255,255,255,0.1)] hover:border-primary'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-red-500 text-xs mt-1">Please select a size</p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-montserrat font-semibold mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-primary transition-colors"
                    onClick={() => updateQuantity(-1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <i className="ri-subtract-line text-sm"></i>
                  </button>
                  <span className="mx-4 w-8 text-center">{quantity}</span>
                  <button
                    className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center hover:border-primary transition-colors"
                    onClick={() => updateQuantity(1)}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <i className="ri-add-line text-sm"></i>
                  </button>
                  <span className="ml-4 text-sm text-[#BBBBBB]">
                    {product.stock} items available
                  </span>
                </div>
              </div>

              <Tabs defaultValue="description" className="mt-6">
                <TabsList className="grid grid-cols-3 bg-[rgba(42,42,42,0.5)]">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-4 text-[#BBBBBB]">
                  {product.description}
                </TabsContent>
                <TabsContent value="details" className="py-4">
                  <ul className="space-y-2 text-[#BBBBBB]">
                    <li>Gender: {product.gender === 'men' ? 'Men' : 'Women'}</li>
                    <li>Category: {product.category}</li>
                    {product.subCategory && <li>Sub-category: {product.subCategory}</li>}
                    <li>Tags: {product.tags?.join(', ') || 'None'}</li>
                  </ul>
                </TabsContent>
                <TabsContent value="shipping" className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <i className="ri-truck-line text-lg text-primary"></i>
                      <span className="ml-2 text-sm">Delivery in {product.deliveryEta}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-refresh-line text-lg text-primary"></i>
                      <span className="ml-2 text-sm">30-day returns</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-secure-payment-line text-lg text-primary"></i>
                      <span className="ml-2 text-sm">Secure checkout</span>
                    </div>
                    <div className="flex items-center">
                      <i className="ri-stock-line text-lg text-primary"></i>
                      <span className="ml-2 text-sm">In stock: {product.stock} items</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button
                  className="px-8 py-3 rounded-full font-montserrat font-semibold flex-1 flex items-center justify-center bg-primary hover:bg-[#e03535] text-white disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  <i className="ri-shopping-cart-2-line mr-2"></i> Add to Cart
                </button>
                <button
                  className="px-8 py-3 rounded-full font-montserrat font-semibold flex-1 flex items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:-translate-y-1"
                  onClick={handleBuyNow}
                  disabled={!selectedSize}
                >
                  <i className="ri-flash-line mr-2"></i> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.slice(0, 4).map(similarProduct => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}