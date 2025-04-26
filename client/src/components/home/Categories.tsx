// client/src/components/home/Categories.tsx

import { Link } from 'wouter';

const categories = [
  {
    title: 'Fits',
    description: 'Tshirts, Tops, Hoodies, Sweatshirts',
    image: 'https://images.unsplash.com/photo-1661110546899-732bffb4cb85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SG9vZGllcyUyMG1vZGVsfGVufDB8MnwwfHx8MA%3D%3D',
    href: '/category/fits',
  },
  {
    title: 'Kicks',
    description: 'Sneakers',
    image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnN8ZW58MHwyfDB8fHww',
    href: '/category/kicks',
  },
  {
    title: 'Drips',
    description: 'Accessories',
    image: 'https://images.unsplash.com/photo-1549113796-66008e8d0a4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bHV4dXJ5JTIwd2F0Y2h8ZW58MHwyfDB8fHww',
    href: '/category/drips',
  },
  {
    title: 'All',
    description: 'Everything we offer',
    image: 'https://images.unsplash.com/photo-1661111014018-8f9b8fd11952?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fEdlbiUyMFolMjBGYXNoaW9ufGVufDB8MnwwfHx8MA%3D%3D',
    href: '/category/all',
  },
];

export default function Categories() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold font-montserrat mb-8 text-left">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="relative overflow-hidden rounded-xl group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center text-center px-3">
              <div className="transform group-hover:scale-105 transition duration-300">
                <h3 className="text-white text-xl font-bold">{category.title}</h3>
                <p className="text-white text-sm mt-1">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}