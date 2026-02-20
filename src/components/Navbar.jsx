import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../store/cartSlice';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineShoppingCart, HiMenu, HiX } from 'react-icons/hi';
import { navLinks } from '../assets/navLinks';
import MobileNavbar from './MobileNavbar';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();

  const cartItems = useSelector((s) => s.cart.items);
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const cartCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isLight = scrolled || !isHome;

  return (
    <>
      <header
        ref={navRef}
        className={`main-navbar fixed top-9 left-0 right-0 z-50 transition-all duration-500 ${
          isLight && !menuOpen ? 'bg-paper/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-ink transition-colors duration-300 z-10"
          >
            LUXE<span className="font-tm text-accent text-[0.55em] align-top font-normal">™</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
            {navLinks.map(({ url, label }) => (
              <li key={label}>
                <Link
                  to={url}
                  className="hover:text-accent transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 z-10">
            <SearchBar />

            <Link
              to="/wishlist"
              className="relative hidden md:block p-1.5 rounded-full hover:bg-ink/5 transition-colors"
            >
              {wishlistItems.length > 0 ? (
                <AiFillHeart className="w-5 h-5 text-red-500" />
              ) : (
                <AiOutlineHeart className="w-5 h-5 text-ink/70 hover:text-accent transition-colors" />
              )}
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-paper text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-1.5 rounded-full text-ink/70 hover:text-accent hover:bg-ink/5 transition-colors"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-paper text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`md:hidden p-1.5 rounded-full text-ink/70 hover:text-accent hover:bg-ink/5 transition-colors 
                ${menuOpen ? 'text-accent' : ''} 
                `}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      <MobileNavbar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
