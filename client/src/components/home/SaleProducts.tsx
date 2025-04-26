import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/ui/product-card';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SaleProducts() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products?onSale=true&limit=4'],
  });
  
  // Render skeleton loading state
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        
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
      </section>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center p-8 rounded-xl glass-card">
          <p>Failed to load sale products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold mr-3">Sale</h2>
          <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">Up to 30% off</span>
        </div>
        <Link href="/sale" className="text-primary flex items-center hover:underline">
  View All <i className="ri-arrow-right-line ml-1"></i>
</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}