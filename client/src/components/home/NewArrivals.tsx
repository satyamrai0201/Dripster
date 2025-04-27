import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';

// Import Supabase client
import { supabase } from '@/lib/supabaseClient';

export default function NewArrivals() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .order('id', { ascending: false })
        .limit(4);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  return (
    <section className="container mx-auto px-4 py-16 bg-accent/10 rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-montserrat font-bold">New Arrivals</h2>
        <Link href="/new-arrivals" className="text-primary flex items-center hover:underline">
          View All <i className="ri-arrow-right-line ml-1"></i>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      )}

      {/* Error */}
      {error && (
        <div className="flex justify-center items-center p-8 rounded-xl glass-card">
          <p className="text-red-400">Failed to load new arrivals. Please try again later.</p>
        </div>
      )}

      {/* Products */}
      {!isLoading && !error && Array.isArray(products) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}