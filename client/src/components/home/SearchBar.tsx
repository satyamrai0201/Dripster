import { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div 
        className="rounded-xl mx-auto max-w-3xl"
        style={{
          background: 'rgba(30, 30, 30, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem'
        }}
      >
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-center">Find Your Perfect Style</h2>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)] focus-visible:ring-primary"
            />
          </div>
          <Button 
            type="submit"
            className="bg-primary hover:bg-[#e03535] transition-colors"
          >
            Search
          </Button>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-2 justify-center text-sm text-[#BBBBBB]">
          <span>Popular:</span>
          {['T-shirts', 'Hoodies', 'Sneakers', 'Jeans', 'Summer'].map((term) => (
            <button
              key={term}
              className="hover:text-primary transition-colors"
              onClick={() => {
                setSearchQuery(term);
                navigate(`/search?q=${encodeURIComponent(term)}`);
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}