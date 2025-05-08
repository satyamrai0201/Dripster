import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/context/AuthContext';
import LoginPopup from '@/components/auth/LoginPopup';
import ProfileMenu from '@/components/auth/ProfileMenu';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

const categories = [
  { label: 'Home', href: '/' },
  { label: 'Men', href: '/category/mensection' },
  { label: 'Women', href: '/category/womensection' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Trending', href: '/trending' },
  { label: 'Sale', href: '/sale' },
  { label: 'Accessories', href: '/category/drips' },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout, showLoginPopup } = useAuth(); // Get logout function
  const { getItemsCount } = useCart();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const handleOpenLoginPopup = () => {
    setIsLoginPopupOpen(true);
    console.log('handleOpenLoginPopup: isLoginPopupOpen is now', isLoginPopupOpen);
  };

  const handleCloseLoginPopup = () => {
    setIsLoginPopupOpen(false);
    console.log('handleCloseLoginPopup: isLoginPopupOpen is now', isLoginPopupOpen);
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
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Empty flex-grow div to push icons to the very right */}
        <div className="flex-grow"></div>

        {/* Icons - pushed to the very right */}
        <div className="flex items-center space-x-2">
          <Link href="/search">
            <div className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer">
              <i className="ri-search-line text-xl text-primary"></i>
            </div>
          </Link>
          <Link href="/wishlist">
            <div className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer">
              <i className="ri-heart-line text-xl text-primary"></i>
            </div>
          </Link>
          <Link href="/cart">
            <div className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer">
              <i className="ri-shopping-bag-line text-xl text-primary"></i>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                  {cartItemsCount}
                </Badge>
              )}
            </div>
          </Link>
          {/* Hamburger for mobile categories dropdown - PASSING handleOpenLoginPopup AND logout */}
          <div className="block md:hidden">
            <MobileCategoriesDropdown
              location={location}
              currentUser={currentUser}
              onOpenLoginPopup={handleOpenLoginPopup} // <-- Pass the open popup function
              onSignOut={logout} // <-- Pass the logout function
            />
          </div>
          {/* ProfileMenu only on desktop */}
          {currentUser && (
            <div className="ml-2 hidden md:block">
              <ProfileMenu user={currentUser} />
            </div>
          )}
          {/* Login icon only on desktop when not logged in */}
          {!currentUser && (
            <div onClick={handleOpenLoginPopup} className="hidden md:block">
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
      {/* This section remains unchanged */}
      <div className="container mx-auto px-4 pb-4 overflow-x-auto hidden md:block">
        <div className="flex space-x-6 text-sm font-medium">
          {categories.map(cat => (
            <Link key={cat.href} href={cat.href}>
              <div className={
                (cat.href === '/' ? location === cat.href : location.startsWith(cat.href) || location.includes(cat.href))
                  ? 'text-primary border-b-2 border-primary pb-2 cursor-pointer'
                  : 'text-[#BBBBBB] hover:text-white pb-2 border-b-2 border-transparent cursor-pointer'
            }>
                {cat.label}
            </div>
          </Link>
          ))}
            </div>
            </div>
    </header>
  );
}

// MobileCategoriesDropdown component
// RECEIVE onOpenLoginPopup AND onSignOut props
function MobileCategoriesDropdown({ location, currentUser, onOpenLoginPopup, onSignOut }: { location: string, currentUser: any, onOpenLoginPopup: () => void, onSignOut: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 ml-2 rounded-full hover:bg-[#2A2A2A] transition-colors relative cursor-pointer flex items-center justify-center"
        onClick={() => setOpen(o => !o)}
        aria-label="Open categories menu"
      >
        <i className="ri-menu-line text-xl text-primary"></i>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-xl shadow-xl border border-zinc-700 py-2 z-50 animate-fade-in">
          {/* Profile option at the top - remains a Link */}
          <Link href="/profile">
            {/* The div content remains the same */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded font-semibold cursor-pointer mb-2 ${location === '/profile' ? 'text-primary bg-zinc-800' : 'text-[#BBBBBB] hover:text-white'}`} onClick={() => setOpen(false)}>
              {currentUser ? (
                <span className="w-8 h-8 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center">
                  <img src={currentUser.photoURL || ''} alt="avatar" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  {!currentUser.photoURL && (
                    <span className="text-white font-bold text-lg select-none">{(currentUser.displayName || currentUser.email || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                  )}
                </span>
              ) : (
                <i className="ri-user-line text-xl text-primary"></i>
              )}
              Profile
            </div>
          </Link>

          {/* Conditional Sign In or Sign Out option - ADDED BELOW PROFILE */}
          {currentUser ? (
            // Sign Out option when logged in
            <div
              className="text-[#BBBBBB] hover:text-white px-4 py-2 rounded cursor-pointer mt-2" // Added mt-2 for spacing
              onClick={() => {
                setOpen(false); // Close dropdown
                onSignOut(); // Call the logout function
              }}
            >
              Sign Out
            </div>
          ) : (
            // Sign In option when not logged in
            <div
              className="text-[#BBBBBB] hover:text-white px-4 py-2 rounded font-semibold cursor-pointer mt-2" // Added mt-2 for spacing
              onClick={() => {
                setOpen(false); // Close dropdown
                onOpenLoginPopup(); // Call the open login popup function
              }}
            >
              Sign In
            </div>
          )}


          <div className="border-b border-zinc-700 my-2"></div> {/* Adjusted margin for spacing */}

          {/* Other categories */}
          {categories.map(cat => (
            <Link key={cat.href} href={cat.href}>
              <div
                className={
                  (cat.href === '/' ? location === cat.href : location.startsWith(cat.href) || location.includes(cat.href))
                    ? 'text-primary bg-zinc-800 px-4 py-2 rounded font-semibold cursor-pointer'
                    : 'text-[#BBBBBB] hover:text-white px-4 py-2 rounded cursor-pointer'
                }
                onClick={() => setOpen(false)}
              >
                {cat.label}
            </div>
          </Link>
          ))}
        </div>
      )}
      </div>
  );
}