import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  /* ── Open / Close animation ── */
  useEffect(() => {
    if (!overlayRef.current || !formRef.current) return;

    if (isOpen) {
      document.body.classList.add('search-open');

      gsap.set(overlayRef.current, { display: 'flex' });

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );

      gsap.fromTo(
        formRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', delay: 0.08 }
      );

      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      document.body.classList.remove('search-open');

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
        },
      });

      setQuery('');
    }
  }, [isOpen]);

  /* ── ESC close ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── Submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-full text-ink/70 hover:text-accent hover:bg-ink/5 transition-colors duration-200"
        aria-label="Open search"
      >
        <FiSearch className="w-5 h-5" />
      </button>

      {/* Overlay via Portal */}
      {createPortal(
        <>
          {/* Search Bar */}
          <div
            ref={overlayRef}
            style={{ display: 'none' }}
            className="fixed inset-x-0 top-9 z-9999 min-h-16 bg-paper/60 backdrop-blur-md border-b border-ink/10 shadow-md flex items-center px-4 sm:px-6 py-2"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="max-w-7xl mx-auto w-full flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap"
            >
              <FiSearch className="w-5 h-5 text-ink/35 shrink-0" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search furniture, decor, collections..."
                className="flex-1 bg-transparent text-base text-ink placeholder-ink/35 outline-none font-medium"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 rounded-full text-ink/35 hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
                  aria-label="Clear"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="shrink-0 bg-accent text-paper text-xs font-semibold uppercase tracking-widest px-3 sm:px-5 py-2 rounded-sm hover:bg-[#d4b87a] transition-colors duration-200"
              >
                <span className="hidden sm:inline">Search</span>
                <span className="sm:hidden">Go</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="shrink-0 p-1.5 rounded-full text-ink/40 hover:text-ink hover:bg-ink/5 transition-colors"
                aria-label="Close search"
              >
                <FiX className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Backdrop */}
          {isOpen && (
            <div className="fixed inset-0 z-[9998] bg-ink/10" onClick={() => setIsOpen(false)} />
          )}
        </>,
        document.body
      )}
    </>
  );
}
