import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../store/cartSlice';
import { FiSearch, FiX } from 'react-icons/fi';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { navLinks } from '../assets/navLinks';
import MobileNavbar from './MobileNavbar';

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [query, setQuery]           = useState('');

  const navRef    = useRef(null);
  const searchRef = useRef(null);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const cartItems     = useSelector(s => s.cart.items);
  const wishlistItems = useSelector(s => s.wishlist.items);
  const cartCount     = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const isHome        = location.pathname === '/';

  /* ── scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── search focus ── */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  /* ── close mobile menu on route change ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const isLight = scrolled || !isHome;

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-500 ${
          isLight && !menuOpen ? 'bg-paper/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl font-bold tracking-tight text-ink transition-colors duration-300 z-10"
          >
            LUXE<span className="font-tm text-accent text-[0.55em] align-top font-normal">™</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
            {navLinks.map(({ url, label }) => (
              <li key={label}>
                <Link to={url} className="hover:text-accent transition-colors duration-200 relative group">
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4 z-10">

            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-0 bg-paper border border-ink/15 rounded-full pl-4 pr-1 py-1.5 shadow-sm min-w-[200px] md:min-w-[280px]">
                <FiSearch className="w-4 h-4 text-ink/40 shrink-0 mr-2" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-sm text-ink placeholder-ink/45 outline-none min-w-0"
                />
                <button type="submit" className="p-2 rounded-full text-ink/60 hover:text-accent hover:bg-ink/5 transition-colors" aria-label="Search">
                  <FiSearch className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 rounded-full text-ink/50 hover:text-ink hover:bg-ink/5 transition-colors" aria-label="Close search">
                  <FiX className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-ink/70 hover:text-accent transition-colors p-1.5 rounded-full hover:bg-ink/5"
                aria-label="Open search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            )}

            <Link to="/wishlist" className="relative hidden md:block">
              {wishlistItems.length > 0 ? (
                <AiFillHeart className="w-5 h-5 text-red-600 hover:text-red-500 transition-colors" />
              ) : (
                <AiOutlineHeart className="w-5 h-5 text-ink/70 hover:text-accent transition-colors" />
              )}
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => dispatch(toggleCart())}
              className="relative text-ink/70 hover:text-accent transition-colors"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-paper text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col justify-center items-end gap-[5px] w-8 h-8 z-10"
              aria-label="Toggle menu"
            >
              <span className={`block h-[1.5px] transition-all duration-400 origin-center ${
                menuOpen ? 'w-6 rotate-45 translate-y-[6.5px] bg-ink' : 'w-6 bg-ink'
              }`} />
              <span className={`block h-[1.5px] transition-all duration-300 ${
                menuOpen ? 'w-0 opacity-0 bg-ink' : 'w-4 bg-ink'
              }`} />
              <span className={`block h-[1.5px] transition-all duration-400 origin-center ${
                menuOpen ? 'w-6 -rotate-45 -translate-y-[6.5px] bg-ink' : 'w-6 bg-ink'
              }`} />
            </button>

          </div>
        </nav>
      </header>

      <MobileNavbar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
