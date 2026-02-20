import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { FiSearch } from 'react-icons/fi';
import { products } from '../assets/products';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('.product-card'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  return (
    <div className="bg-paper">
      <div className="pt-16 max-w-7xl mx-auto px-3 py-14">
        <div ref={titleRef}>
          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="
            flex items-center 
            border-b border-ink/30 
            pb-2 sm:pb-3 
            w-full sm:max-w-lg 
            mb-6 sm:mb-10
          "
          >
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search products..."
              className="
              flex-1 
              bg-transparent 
              text-lg sm:text-xl md:text-2xl
              font-display font-semibold 
              text-ink 
              outline-none 
              placeholder-ink/30
              "
            />

            <button
              type="submit"
              className="ml-3 sm:ml-4 text-ink/50 hover:text-accent transition-colors"
            >
              <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>

          {query && (
            <div>
              <p className="text-muted text-sm">
                {results.length > 0
                  ? `${results.length} result${results.length !== 1 ? 's' : ''} for `
                  : 'No results for '}
                <strong className="text-ink">"{query}"</strong>
              </p>
            </div>
          )}
        </div>

        {/* Suggestions when no query */}
        {!query && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-muted mb-4">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Chair', 'Lamp', 'Sofa', 'Decor', 'Bedroom', 'Kitchen'].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/search?q=${term}`)}
                  className="px-4 py-2 border border-ink/20 text-sm text-ink/60 hover:border-accent hover:text-accent transition-colors rounded-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && query && (
          <div className="text-center py-24">
            <p className="font-display text-5xl text-ink/10 mb-4">∅</p>
            <p className="text-muted mb-6">No products match your search</p>
            <p className="text-xs text-muted mb-4">
              Try searching for: Chair, Sofa, Lamp, Decor...
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div ref={gridRef} className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {results.map((p) => (
              <div key={p.id} className="product-card">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
