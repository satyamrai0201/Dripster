import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-primary text-3xl font-bold mb-4 font-montserrat">DRIPSTER</h2>
            <p className="text-gray-400 mb-6">
              The ultimate destination for streetwear fashion and urban style.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#2A2A2A] text-white p-2 rounded-full hover:bg-[#3A3A3A] transition-colors"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#2A2A2A] text-white p-2 rounded-full hover:bg-[#3A3A3A] transition-colors"
                aria-label="Twitter"
              >
                <i className="ri-twitter-x-line text-lg"></i>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#2A2A2A] text-white p-2 rounded-full hover:bg-[#3A3A3A] transition-colors"
                aria-label="Facebook"
              >
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#2A2A2A] text-white p-2 rounded-full hover:bg-[#3A3A3A] transition-colors"
                aria-label="YouTube"
              >
                <i className="ri-youtube-line text-lg"></i>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/mensection" className="text-gray-400 hover:text-white transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link href="/category/womensection" className="text-gray-400 hover:text-white transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-gray-400 hover:text-white transition-colors">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/category/drips" className="text-gray-400 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/customer-service" className="text-gray-400 hover:text-white transition-colors">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/find-a-store" className="text-gray-400 hover:text-white transition-colors">
                  Find a Store
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-400 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-400 hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">© {new Date().getFullYear()} Dripster. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
      
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-[#e03535] transition-colors"
          aria-label="Chat with us"
        >
          <i className="ri-customer-service-2-line text-xl"></i>
        </button>
      </div>
    </footer>
  );
}