import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { products, categories } from '../assets/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'All');
  const [sortBy, setSortBy] = useState('default');
  const [priceMax, setPriceMax] = useState(5000);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(gridRef.current.querySelectorAll('.product-card'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeCategory, sortBy, priceMax]);

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.price <= priceMax)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-paper">
      <div className="pt-16">
        {/* Header */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 pt-14 pb-10">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Our Collection</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-display text-5xl font-bold text-ink">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h1>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm bg-transparent border border-ink/20 rounded-sm px-3 py-2 text-ink outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
              </select>
              <span className="text-muted text-sm">{filtered.length} items</span>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-300 rounded-sm ${
                  activeCategory === cat
                    ? 'bg-ink text-paper'
                    : 'border border-ink/20 text-ink/60 hover:border-ink hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price range */}
          <div className="flex items-center gap-4 mt-5">
            <span className="text-xs text-muted uppercase tracking-wide">Max Price:</span>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-40 accent-accent"
            />
            <span className="text-sm font-medium text-ink">${priceMax.toLocaleString()}</span>
          </div>
        </div>

        {/* Products grid */}
        <div ref={gridRef} className="max-w-7xl mx-auto px-6 pb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl text-ink/30">No products found</p>
              <button onClick={() => { setActiveCategory('All'); setPriceMax(5000); }} className="mt-4 text-sm text-accent underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {filtered.map(p => (
                <div key={p.id} className="product-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}