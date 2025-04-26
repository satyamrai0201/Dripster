import { Link } from "wouter";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Fits",
    subtitle: "Tshirts, Tops, Hoodies, Sweatshirts",
    href: '/category/fits',
    img: "https://images.unsplash.com/photo-1661110546899-732bffb4cb85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SG9vZGllcyUyMG1vZGVsfGVufDB8MnwwfHx8MA%3D%3D",
  },
  {
    title: "Kicks",
    subtitle: "Sneakers",
    href: '/category/kicks',
    img: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnN8ZW58MHwyfDB8fHww",
  },
  {
    title: "Drips",
    subtitle: "Accessories",
    href: '/category/drips',
    img: "https://images.unsplash.com/photo-1549113796-66008e8d0a4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bHV4dXJ5JTIwd2F0Y2h8ZW58MHwyfDB8fHww",
  },
  {
    title: "All",
    subtitle: "Everything we offer",
    href:  '/category/all',
    img: "https://images.unsplash.com/photo-1661111014018-8f9b8fd11952?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fEdlbiUyMFolMjBGYXNoaW9ufGVufDB8MnwwfHx8MA%3D%3D",
  },
];

const ExploreCategories = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-left">Explore Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <Link href={cat.href}>
                <div className="h-[300px] bg-center bg-cover flex items-center justify-center"
                  style={{ backgroundImage: `url(${cat.img})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="relative text-center z-10">
                    <h2 className="text-2xl font-bold mb-2">{cat.title}</h2>
                    <p className="text-sm text-gray-200">{cat.subtitle}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreCategories;