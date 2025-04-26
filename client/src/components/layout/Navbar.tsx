import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/context/AuthContext';
import LoginPopup from '@/components/auth/LoginPopup';
import ProfileMenu from '@/components/auth/ProfileMenu';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout, showLoginPopup } = useAuth();
  const { getItemsCount } = useCart();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const handleOpenLoginPopup = () => {
    setIsLoginPopupOpen(true);
    console.log('handleOpenLoginPopup: isLoginPopupOpen is now', isLoginPopupOpen); // Correct placement
  };

  const handleCloseLoginPopup = () => {
    setIsLoginPopupOpen(false);
    console.log('handleCloseLoginPopup: isLoginPopupOpen is now', isLoginPopupOpen); // Correct placement
  };

  // Handle scroll effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = getItemsCount();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
      style={{
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <nav className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center">
          <Link href="/search">
            <div className="p-2 ml-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer">
              <i className="ri-search-line text-xl text-primary"></i>
            </div>
          </Link>

          <Link href="/wishlist">
            <div className="p-2 ml-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer">
              <i className="ri-heart-line text-xl text-primary"></i>
            </div>
          </Link>

          <Link href="/cart">
            <div className="p-2 ml-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer">
              <i className="ri-shopping-bag-line text-xl text-primary"></i>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                  {cartItemsCount}
                </Badge>
              )}
            </div>
          </Link>

          {currentUser ? (
            <div className="ml-2">
              <ProfileMenu user={currentUser} />
            </div>
          ) : (
            <div onClick={handleOpenLoginPopup}>
              <div className="p-2 ml-2 rounded-full hover:bg-[#2A2A2A] transition-colors cursor-pointer">
                <i className="ri-user-line text-xl text-primary"></i>
              </div>
            </div>
          )}
          {isLoginPopupOpen && (
            <LoginPopup isOpen={isLoginPopupOpen} onClose={handleCloseLoginPopup} />
          )}
        </div>
      </nav>

      {/* Categories */}
      <div className="container mx-auto px-4 pb-4 overflow-x-auto">
        <div className="flex space-x-6 text-sm font-medium">
          <Link href="/">
            <div className={location === '/' ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              Home
            </div>
          </Link>

          <Link href="/category/mensection">
            <div className={location.startsWith('/category/mensection') ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              Men
            </div>
          </Link>

          <Link href="/category/womensection">
            <div className={location.startsWith('/category/womensection') ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              Women
            </div>
          </Link>

          <Link href="/new-arrivals">
            <div className={location.includes('/new-arrivals') ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              New Arrivals
            </div>
          </Link>

          <Link href="/trending">
            <div className={location.includes('/trending') ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              Trending
            </div>
          </Link>

          <Link href="/sale">
            <div className={location.includes('/sale') ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              Sale
            </div>
          </Link>

          <Link href="/category/drips">
            <div className={location.includes('/accessories') ?
              'text-primary border-b-2 border-primary pb-2 cursor-pointer' :
              'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
              Accessories
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}