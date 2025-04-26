import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in INR format
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Format date
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Get random item from array
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Format category name for display
export const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Debounce function
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Get category image by gender and category
export const getCategoryImage = (gender: string, category: string): string => {
  const images: Record<string, Record<string, string>> = {
    men: {
      tshirts: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
      hoodies: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5',
      sneakers: 'https://images.unsplash.com/photo-1556048219-bb6978360b84',
      accessories: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083'
    },
    women: {
      tops: 'https://images.unsplash.com/photo-1616627561950-9f746e330187',
      sweatshirts: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      sneakers: 'https://images.unsplash.com/photo-1549298916-b21c5d38e6c2',
      accessories: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea'
    }
  };

  return images[gender]?.[category] || 'https://images.unsplash.com/photo-1556048219-bb6978360b84';
};

// Create a responsive glass background style
export const glassStyles = {
  background: 'rgba(30, 30, 30, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
};

// Create a custom scrollbar style
export const scrollbarStyles = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px'
  }
};
