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
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/avatar';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  photoURL?: string;
  email?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { attemptPurchase, attemptWishlist } = useProtectedPurchase();
  const { currentUser } = useAuth();

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(id))
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
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

  // Pre-written Indian-style reviews for different product categories
  const preWrittenReviews: Record<string, any[]> = {
    tshirts: [
      { id: '1', name: 'Rahul Sharma', rating: 5, comment: 'Bahut badhiya quality hai! Material ekdum premium feel karta hai. Perfect fit mila.', date: '2024-03-15' },
      { id: '2', name: 'Priya Patel', rating: 4, comment: 'Color bilkul photos jaisa hai. Comfortable hai daily wear ke liye. Thoda pricey hai but worth it.', date: '2024-03-10' },
      { id: '3', name: 'Amit Kumar', rating: 5, comment: 'Stylish design hai, office wear ke liye perfect. Fabric quality bahut acchi hai.', date: '2024-03-05' },
      { id: '4', name: 'Neha Gupta', rating: 4, comment: 'Size chart accurate hai. Delivery time pe mila. Overall satisfied with purchase.', date: '2024-03-01' },
      { id: '5', name: 'Vikram Singh', rating: 5, comment: 'Washing ke baad bhi color fade nahi hua. Durability bahut acchi hai. Recommend karunga!', date: '2024-02-28' }
    ],
    hoodies: [
      { id: '1', name: 'Arjun Mehta', rating: 5, comment: 'Winter ke liye perfect hai! Bahut warm hai aur style bhi zabardast hai.', date: '2024-03-15' },
      { id: '2', name: 'Sneha Reddy', rating: 4, comment: 'Comfort level ekdum top notch hai. College ke liye best hai. Pocket space bhi accha hai.', date: '2024-03-12' },
      { id: '3', name: 'Raj Malhotra', rating: 5, comment: 'Premium feel hai material mein. Gym wear ke liye bhi perfect hai. Worth every penny!', date: '2024-03-08' },
      { id: '4', name: 'Ananya Joshi', rating: 4, comment: 'Color combination bahut stylish hai. Perfect for casual outings. Quality meets expectations.', date: '2024-03-05' },
      { id: '5', name: 'Karan Verma', rating: 5, comment: 'Hood quality bahut acchi hai. Rain protection bhi provide karta hai. Must buy!', date: '2024-03-01' }
    ],
    sneakers: [
      { id: '1', name: 'Vivek Nair', rating: 5, comment: 'Comfort level ekdum zabardast hai! Daily wear ke liye perfect. Cushioning bahut acchi hai.', date: '2024-03-15' },
      { id: '2', name: 'Divya Sharma', rating: 4, comment: 'Stylish design hai, office wear ke liye perfect. Thoda pricey hai but worth it.', date: '2024-03-12' },
      { id: '3', name: 'Rohan Kapoor', rating: 5, comment: 'Gym ke liye best hai! Grip bahut acchi hai. Quality premium hai.', date: '2024-03-10' },
      { id: '4', name: 'Pooja Patel', rating: 4, comment: 'Color combination bahut attractive hai. Perfect for casual outings. Comfortable for long hours.', date: '2024-03-08' },
      { id: '5', name: 'Aditya Singh', rating: 5, comment: 'Durability bahut acchi hai. Daily use ke baad bhi new jaisa dikhta hai. Highly recommended!', date: '2024-03-05' }
    ],
    accessories: [
      { id: '1', name: 'Meera Kapoor', rating: 5, comment: 'Design ekdum unique hai! Quality premium hai. Perfect for special occasions.', date: '2024-03-15' },
      { id: '2', name: 'Siddharth Gupta', rating: 4, comment: 'Stylish hai aur price bhi reasonable hai. Daily wear ke liye perfect.', date: '2024-03-12' },
      { id: '3', name: 'Riya Sharma', rating: 5, comment: 'Color combination bahut attractive hai. Perfect gift option hai.', date: '2024-03-10' },
      { id: '4', name: 'Aryan Patel', rating: 4, comment: 'Quality meets expectations. Worth the price. Delivery time pe mila.', date: '2024-03-08' },
      { id: '5', name: 'Zara Khan', rating: 5, comment: 'Design zabardast hai! Compliments milte hain. Must buy!', date: '2024-03-05' }
    ],
    tops: [
      { id: '1', name: 'Anjali Desai', rating: 5, comment: 'Fabric quality bahut acchi hai! Perfect for office wear. Fit bilkul sahi hai.', date: '2024-03-15' },
      { id: '2', name: 'Kavya Sharma', rating: 4, comment: 'Stylish design hai, casual wear ke liye perfect. Color bilkul photos jaisa hai.', date: '2024-03-12' },
      { id: '3', name: 'Pooja Mehta', rating: 5, comment: 'Comfortable hai daily wear ke liye. Quality premium hai. Worth every penny!', date: '2024-03-10' },
      { id: '4', name: 'Riya Patel', rating: 4, comment: 'Size chart accurate hai. Delivery time pe mila. Overall satisfied with purchase.', date: '2024-03-08' },
      { id: '5', name: 'Neha Gupta', rating: 5, comment: 'Washing ke baad bhi color fade nahi hua. Durability bahut acchi hai. Recommend karungi!', date: '2024-03-05' }
    ],
    sweatshirts: [
      { id: '1', name: 'Priya Singh', rating: 5, comment: 'Winter ke liye perfect hai! Bahut warm hai aur style bhi zabardast hai.', date: '2024-03-15' },
      { id: '2', name: 'Ananya Reddy', rating: 4, comment: 'Comfort level ekdum top notch hai. College ke liye best hai. Pocket space bhi accha hai.', date: '2024-03-12' },
      { id: '3', name: 'Divya Malhotra', rating: 5, comment: 'Premium feel hai material mein. Gym wear ke liye bhi perfect hai. Worth every penny!', date: '2024-03-10' },
      { id: '4', name: 'Riya Joshi', rating: 4, comment: 'Color combination bahut stylish hai. Perfect for casual outings. Quality meets expectations.', date: '2024-03-08' },
      { id: '5', name: 'Meera Verma', rating: 5, comment: 'Hood quality bahut acchi hai. Rain protection bhi provide karta hai. Must buy!', date: '2024-03-05' }
    ]
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState<{ name: string; rating: number; comment: string; editingId: string | null; photoURL: string; email: string }>({ name: '', rating: 5, comment: '', editingId: null, photoURL: '', email: '' });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Add a generic fallback demo reviews set
  const fallbackDemoReviews: Review[] = [
    { id: 'demo1', name: 'Demo User', rating: 5, comment: 'Great product! Highly recommended.', date: '2024-01-01' },
    { id: 'demo2', name: 'Sample Buyer', rating: 4, comment: 'Good quality and fast delivery.', date: '2024-01-02' },
    { id: 'demo3', name: 'Test Reviewer', rating: 5, comment: 'Exceeded my expectations!', date: '2024-01-03' },
    { id: 'demo4', name: 'Priya Example', rating: 4, comment: 'Nice fit and comfortable.', date: '2024-01-04' },
    { id: 'demo5', name: 'Amit Example', rating: 5, comment: 'Would buy again!', date: '2024-01-05' },
  ];

  // In the useEffect that loads reviews, ensure fallback demo reviews for any product
  useEffect(() => {
    if (!product) return;
    const reviewsKey = `dripster-reviews-${product.id}`;
    const stored = localStorage.getItem(reviewsKey);
    if (stored) {
      setReviews(JSON.parse(stored));
    } else {
      // Use category-specific demo reviews, or fallback to tshirts, or fallback to generic
      const pre = preWrittenReviews[product.category] || preWrittenReviews.tshirts || fallbackDemoReviews;
      setReviews(pre);
      localStorage.setItem(reviewsKey, JSON.stringify(pre));
    }
  }, [product]);

  // Save reviews to localStorage on change
  useEffect(() => {
    if (!product) return;
    const reviewsKey = `dripster-reviews-${product.id}`;
    localStorage.setItem(reviewsKey, JSON.stringify(reviews));
  }, [reviews, product]);

  // Helper to get initials from a name
  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  // Helper to get a color from a string (for avatar bg)
  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  // When opening the form, auto-fill name/photo from user
  function openReviewForm(editingReview: Review | null = null) {
    if (editingReview) {
      setReviewForm({
        name: editingReview.name,
        rating: editingReview.rating,
        comment: editingReview.comment,
        editingId: editingReview.id,
        photoURL: editingReview.photoURL || '',
        email: editingReview.email || ''
      });
    } else {
      setReviewForm({
        name: currentUser?.displayName || '',
        rating: 5,
        comment: '',
        editingId: null,
        photoURL: currentUser?.photoURL || '',
        email: currentUser?.email || ''
      });
    }
    setShowForm(true);
  }

  // Update handleReviewSubmit to include photoURL
  function handleReviewSubmit(e: any) {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    setSubmitting(true);
    setTimeout(() => { // Simulate async for animation
      if (reviewForm.editingId) {
        setReviews(reviews.map(r => r.id === reviewForm.editingId ? { ...r, ...reviewForm, date: new Date().toISOString().slice(0,10), editingId: undefined } : r));
      } else {
        setReviews([
          { id: uuidv4(), name: reviewForm.name, rating: reviewForm.rating, comment: reviewForm.comment, date: new Date().toISOString().slice(0,10), photoURL: reviewForm.photoURL, email: reviewForm.email },
          ...reviews
        ]);
      }
      setReviewForm({ name: '', rating: 5, comment: '', editingId: null, photoURL: '', email: '' });
      setShowForm(false);
      setSubmitting(false);
    }, 700); // 700ms for visible animation
  }

  // Only show Edit/Delete for reviews where the logged-in user's email matches the review's email
  function isOwnReview(r: Review) {
    if (!currentUser || !r.email) return false;
    return r.email === currentUser.email;
  }

  function handleEditReview(id: string) {
    const r = reviews.find(r => r.id === id);
    if (r) openReviewForm(r);
  }
  function handleDeleteReview(id: string) {
    setRemovingId(id);
    setTimeout(() => {
      setReviews(reviews.filter(r => r.id !== id));
      setRemovingId(null);
    }, 400); // 400ms for fade-out
  }

  const REVIEWS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);

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
                  {product.rating.toFixed(1)}
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
                <TabsList className="flex justify-center gap-2 bg-[rgba(42,42,42,0.5)] rounded-full p-1 w-full max-w-xl mx-auto mb-4">
                  <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
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

              {/* Reviews Section - full width */}
              <div className="mt-10 w-full">
                <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-4">
                  <h4 className="font-semibold text-lg">Customer Reviews</h4>
                  <button className="bg-primary text-white px-4 py-1 rounded-full text-sm" onClick={() => openReviewForm()}>Add Review</button>
                </div>
                {showForm && (
                  <form onSubmit={handleReviewSubmit} className="mb-6 bg-[rgba(255,255,255,0.05)] p-4 rounded-xl w-full">
                    <div className="mb-2 flex items-center gap-3">
                      {/* Avatar preview */}
                      {reviewForm.photoURL || reviewForm.name ? (
                        <Avatar 
                          photoURL={reviewForm.photoURL || undefined}
                          displayName={reviewForm.name || undefined}
                          email={reviewForm.email || undefined}
                          size={32}
                        />
                      ) : null}
                      <input className="w-full p-2 rounded bg-black/30 border border-[rgba(255,255,255,0.1)] text-white" placeholder="Your Name" value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))} disabled={!!currentUser?.displayName} />
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm">Rating:</span>
                      {[1,2,3,4,5].map(n => (
                        <button type="button" key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                          <i className={`ri-star-${reviewForm.rating >= n ? 'fill' : 'line'} text-[#FFC107] text-lg`}></i>
                        </button>
                      ))}
                    </div>
                    <div className="mb-2">
                      <textarea className="w-full p-2 rounded bg-black/30 border border-[rgba(255,255,255,0.1)] text-white" placeholder="Your Review" value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-primary text-white px-4 py-1 rounded-full text-sm flex items-center justify-center min-w-[80px]" disabled={submitting}>
                        {submitting ? (
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : null}
                        {reviewForm.editingId ? 'Update' : 'Submit'}
                      </button>
                      <button type="button" className="bg-gray-600 text-white px-4 py-1 rounded-full text-sm" onClick={() => { setShowForm(false); setReviewForm({ name: '', rating: 5, comment: '', editingId: null, photoURL: '', email: '' }); }} disabled={submitting}>Cancel</button>
                    </div>
                  </form>
                )}
                <div className="space-y-4 w-full">
                  {paginatedReviews.length === 0 && <div className="text-[#BBBBBB]">No reviews yet.</div>}
                  {paginatedReviews.map(r => (
                    <div key={r.id} className={`bg-[rgba(255,255,255,0.03)] p-4 rounded-xl flex gap-3 items-start w-full transition-all duration-400 ${removingId === r.id ? 'opacity-0 translate-x-8 pointer-events-none' : 'opacity-100'}`}>
                      {/* Avatar */}
                      <Avatar 
                        photoURL={r.photoURL || undefined}
                        displayName={r.name || undefined}
                        email={r.email || undefined}
                        size={36}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{r.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`ri-star-${i < r.rating ? 'fill' : 'line'} text-[#FFC107] text-xs`}></i>
                            ))}
                          </div>
                        </div>
                        <p className="text-textSecondary text-xs mb-1">{r.comment}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[rgba(255,255,255,0.4)]">{r.date}</span>
                          <div className="flex gap-2">
                            {isOwnReview(r) && <button className="text-primary text-xs" onClick={() => openReviewForm(r)}>Edit</button>}
                            {isOwnReview(r) && <button className="text-red-400 text-xs" onClick={() => handleDeleteReview(r.id)}>Delete</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      className="px-3 py-1 rounded bg-[rgba(255,255,255,0.08)] text-white disabled:opacity-40"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-[#BBBBBB]">Page {currentPage} of {totalPages}</span>
                    <button
                      className="px-3 py-1 rounded bg-[rgba(255,255,255,0.08)] text-white disabled:opacity-40"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {Array.isArray(similarProducts) && similarProducts.length > 0 && (
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