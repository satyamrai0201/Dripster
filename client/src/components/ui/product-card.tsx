import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Product, Size } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductCardProps {
  product: Product;
}

// Pre-written Indian-style reviews for different product categories
const preWrittenReviews: Record<string, Review[]> = {
  tshirts: [
    {
      id: "1",
      name: "Rahul Sharma",
      rating: 5,
      comment: "Bahut badhiya quality hai! Material ekdum premium feel karta hai. Perfect fit mila.",
      date: "2024-03-15"
    },
    {
      id: "2",
      name: "Priya Patel",
      rating: 4,
      comment: "Color bilkul photos jaisa hai. Comfortable hai daily wear ke liye. Thoda pricey hai but worth it.",
      date: "2024-03-10"
    },
    {
      id: "3",
      name: "Amit Kumar",
      rating: 5,
      comment: "Stylish design hai, office wear ke liye perfect. Fabric quality bahut acchi hai.",
      date: "2024-03-05"
    },
    {
      id: "4",
      name: "Neha Gupta",
      rating: 4,
      comment: "Size chart accurate hai. Delivery time pe mila. Overall satisfied with purchase.",
      date: "2024-03-01"
    },
    {
      id: "5",
      name: "Vikram Singh",
      rating: 5,
      comment: "Washing ke baad bhi color fade nahi hua. Durability bahut acchi hai. Recommend karunga!",
      date: "2024-02-28"
    }
  ],
  hoodies: [
    {
      id: "1",
      name: "Arjun Mehta",
      rating: 5,
      comment: "Winter ke liye perfect hai! Bahut warm hai aur style bhi zabardast hai.",
      date: "2024-03-15"
    },
    {
      id: "2",
      name: "Sneha Reddy",
      rating: 4,
      comment: "Comfort level ekdum top notch hai. College ke liye best hai. Pocket space bhi accha hai.",
      date: "2024-03-12"
    },
    {
      id: "3",
      name: "Raj Malhotra",
      rating: 5,
      comment: "Premium feel hai material mein. Gym wear ke liye bhi perfect hai. Worth every penny!",
      date: "2024-03-08"
    },
    {
      id: "4",
      name: "Ananya Joshi",
      rating: 4,
      comment: "Color combination bahut stylish hai. Perfect for casual outings. Quality meets expectations.",
      date: "2024-03-05"
    },
    {
      id: "5",
      name: "Karan Verma",
      rating: 5,
      comment: "Hood quality bahut acchi hai. Rain protection bhi provide karta hai. Must buy!",
      date: "2024-03-01"
    }
  ],
  sneakers: [
    {
      id: "1",
      name: "Vivek Nair",
      rating: 5,
      comment: "Comfort level ekdum zabardast hai! Daily wear ke liye perfect. Cushioning bahut acchi hai.",
      date: "2024-03-15"
    },
    {
      id: "2",
      name: "Divya Sharma",
      rating: 4,
      comment: "Stylish design hai, office wear ke liye perfect. Thoda pricey hai but worth it.",
      date: "2024-03-12"
    },
    {
      id: "3",
      name: "Rohan Kapoor",
      rating: 5,
      comment: "Gym ke liye best hai! Grip bahut acchi hai. Quality premium hai.",
      date: "2024-03-10"
    },
    {
      id: "4",
      name: "Pooja Patel",
      rating: 4,
      comment: "Color combination bahut attractive hai. Perfect for casual outings. Comfortable for long hours.",
      date: "2024-03-08"
    },
    {
      id: "5",
      name: "Aditya Singh",
      rating: 5,
      comment: "Durability bahut acchi hai. Daily use ke baad bhi new jaisa dikhta hai. Highly recommended!",
      date: "2024-03-05"
    }
  ],
  accessories: [
    {
      id: "1",
      name: "Meera Kapoor",
      rating: 5,
      comment: "Design ekdum unique hai! Quality premium hai. Perfect for special occasions.",
      date: "2024-03-15"
    },
    {
      id: "2",
      name: "Siddharth Gupta",
      rating: 4,
      comment: "Stylish hai aur price bhi reasonable hai. Daily wear ke liye perfect.",
      date: "2024-03-12"
    },
    {
      id: "3",
      name: "Riya Sharma",
      rating: 5,
      comment: "Color combination bahut attractive hai. Perfect gift option hai.",
      date: "2024-03-10"
    },
    {
      id: "4",
      name: "Aryan Patel",
      rating: 4,
      comment: "Quality meets expectations. Worth the price. Delivery time pe mila.",
      date: "2024-03-08"
    },
    {
      id: "5",
      name: "Zara Khan",
      rating: 5,
      comment: "Design zabardast hai! Compliments milte hain. Must buy!",
      date: "2024-03-05"
    }
  ],
  tops: [
    {
      id: "1",
      name: "Anjali Desai",
      rating: 5,
      comment: "Fabric quality bahut acchi hai! Perfect for office wear. Fit bilkul sahi hai.",
      date: "2024-03-15"
    },
    {
      id: "2",
      name: "Kavya Sharma",
      rating: 4,
      comment: "Stylish design hai, casual wear ke liye perfect. Color bilkul photos jaisa hai.",
      date: "2024-03-12"
    },
    {
      id: "3",
      name: "Pooja Mehta",
      rating: 5,
      comment: "Comfortable hai daily wear ke liye. Quality premium hai. Worth every penny!",
      date: "2024-03-10"
    },
    {
      id: "4",
      name: "Riya Patel",
      rating: 4,
      comment: "Size chart accurate hai. Delivery time pe mila. Overall satisfied with purchase.",
      date: "2024-03-08"
    },
    {
      id: "5",
      name: "Neha Gupta",
      rating: 5,
      comment: "Washing ke baad bhi color fade nahi hua. Durability bahut acchi hai. Recommend karungi!",
      date: "2024-03-05"
    }
  ],
  sweatshirts: [
    {
      id: "1",
      name: "Priya Singh",
      rating: 5,
      comment: "Winter ke liye perfect hai! Bahut warm hai aur style bhi zabardast hai.",
      date: "2024-03-15"
    },
    {
      id: "2",
      name: "Ananya Reddy",
      rating: 4,
      comment: "Comfort level ekdum top notch hai. College ke liye best hai. Pocket space bhi accha hai.",
      date: "2024-03-12"
    },
    {
      id: "3",
      name: "Divya Malhotra",
      rating: 5,
      comment: "Premium feel hai material mein. Gym wear ke liye bhi perfect hai. Worth every penny!",
      date: "2024-03-10"
    },
    {
      id: "4",
      name: "Riya Joshi",
      rating: 4,
      comment: "Color combination bahut stylish hai. Perfect for casual outings. Quality meets expectations.",
      date: "2024-03-08"
    },
    {
      id: "5",
      name: "Meera Verma",
      rating: 5,
      comment: "Hood quality bahut acchi hai. Rain protection bhi provide karta hai. Must buy!",
      date: "2024-03-05"
    }
  ]
};

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Local storage wishlist functionality
  const toggleWishlist = (product: Product) => {
    try {
      // Get existing wishlist from local storage
      const wishlistString = localStorage.getItem('dripster-wishlist');
      let wishlist: Product[] = wishlistString ? JSON.parse(wishlistString) : [];
      
      // Check if product is already in wishlist
      const isInWishlist = wishlist.some(item => item.id === product.id);
      
      if (isInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.id !== product.id);
        setIsFavorite(false);
        toast({
          title: "Removed from wishlist",
          description: `${product.name} removed from your wishlist`,
        });
      } else {
        // Add to wishlist
        wishlist.push(product);
        setIsFavorite(true);
        toast({
          title: "Added to wishlist",
          description: `${product.name} added to your wishlist`,
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
  
  // Check if product is in wishlist on component mount
  useEffect(() => {
    try {
      const wishlistString = localStorage.getItem('dripster-wishlist');
      if (wishlistString) {
        const wishlist: Product[] = JSON.parse(wishlistString);
        setIsFavorite(wishlist.some(item => item.id === product.id));
      }
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  }, [product.id]);
  
  // Local storage cart functionality
  const addToCart = (product: Product, quantity: number, size: Size) => {
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
          // Use a default color (assuming the product doesn't have colors property)
          color: undefined
        });
      }
      
      // Save updated cart back to local storage
      localStorage.setItem('dripster-cart', JSON.stringify(cart));
      
      toast({
        title: "Added to cart",
        description: `${product.name} (Size: ${size}) added to your cart`,
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to the first available size when adding from card
    addToCart(product, 1, product.sizes[0]);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="glass-card rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-80 object-cover transition-transform duration-300 ease-in-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <button 
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-[rgba(30,30,30,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] transition-colors hover:bg-[rgba(40,40,40,0.8)]"
            onClick={handleToggleWishlist}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isFavorite ? (
              <i className="ri-heart-fill text-primary"></i>
            ) : (
              <i className="ri-heart-line"></i>
            )}
          </button>
          
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
              New
            </div>
          )}
          
          {typeof product.discount === 'number' && product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-full">
              {product.discount}% Off
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-montserrat font-semibold">{product.name}</h3>
            <div className="flex items-center">
              <i className="ri-star-fill text-[#FFC107] text-sm"></i>
              <span className="text-sm ml-1">{product.rating}</span>
            </div>
          </div>
          
          <p className="text-textSecondary text-sm mb-3">
            {product.gender === 'men' ? "Men's" : "Women's"} {product.category}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-lg font-montserrat font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-textSecondary line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <button 
              className="p-2 rounded-full bg-primary hover:bg-[#e03535] transition-colors"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <i className="ri-shopping-bag-line"></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
