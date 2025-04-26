import { Link } from 'wouter';

export default function HeroBanner() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1552573102-2b44b44d85b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Fashion banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 h-full relative z-10 flex items-end pb-16">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-4">
            The New <span className="text-primary">Street</span> Collection
          </h1>
          <p className="text-[#BBBBBB] text-lg mb-8">
            Discover the latest trends in streetwear fashion for your everyday style
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/category/all" 
              className="inline-block px-8 py-3 rounded-full font-montserrat font-semibold bg-primary hover:bg-[#e03535] text-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              Shop Now
            </Link>
            <Link href="/explore-categories" 
              className="inline-block px-8 py-3 rounded-full font-montserrat font-semibold bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-white transform transition-all duration-300 hover:-translate-y-1">
              Explore Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
