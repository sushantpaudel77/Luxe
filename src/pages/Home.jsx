import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AiFillStar } from 'react-icons/ai';
import { products, heroSlides } from '../assets/products';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [slide, setSlide] = useState(0);
  const heroRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const gridRef = useRef(null);
  const featuresRef = useRef(null);

  // Hero text animation on slide change
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    tl.fromTo(
      subRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );
    tl.fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );
  }, [slide]);

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll animations
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.product-card');
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.querySelectorAll('.feature-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const current = heroSlides[slide];
  const featured = products.slice(0, 4);
  const trending = products.slice(4, 8);

  return (
    <div className="bg-paper">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background image */}
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" />
          </div>
        ))}

        {/* Content — bit upper, laptop-friendly size, slightly larger */}
        <div className="relative h-full flex items-center justify-center pt-24 pb-28 md:pt-28 md:pb-36">
          <div className="max-w-7xl mx-auto px-6 w-full -translate-y-8 md:-translate-y-10">
            <div className="max-w-2xl">
              <p className="text-accent text-sm md:text-base uppercase tracking-[0.3em] mb-6 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Curated Collection 2024
              </p>
              <h1
                ref={headRef}
                className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-paper leading-[1.05] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
              >
                {current.headline} <em className="text-accent not-italic">{current.highlight}</em>
              </h1>
              <p ref={subRef} className="mt-6 text-paper text-xl md:text-2xl leading-relaxed max-w-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] [text-shadow:0_0_2px_rgba(0,0,0,0.9)]">
                {current.sub}
              </p>
              <div ref={ctaRef} className="flex items-center gap-5 mt-10 md:mt-12">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-accent text-paper px-10 py-4 md:px-12 md:py-4 text-base md:text-lg font-medium tracking-wide hover:bg-paper hover:text-ink transition-all duration-300 group shadow-lg"
                >
                  {current.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  to="/shop"
                  className="text-paper text-base md:text-lg font-medium border-b-2 border-paper/60 hover:border-accent hover:text-accent transition-all duration-300 pb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-0.5 transition-all duration-500 ${i === slide ? 'w-12 bg-accent' : 'w-4 bg-paper/40'}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center gap-2 text-paper/40">
          <span className="text-[10px] uppercase tracking-widest rotate-90 translate-y-6">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-paper/40 to-transparent" />
        </div>
      </section>

      {/* Features bar */}
      {/* <section ref={featuresRef} className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $500' },
            { icon: '♻️', title: 'Sustainably Made', sub: 'Ethically sourced materials' },
            { icon: '↩️', title: '60-Day Returns', sub: 'Hassle-free returns' },
            { icon: '🔒', title: 'Secure Payment', sub: 'Encrypted checkout' },
          ].map((f) => (
            <div key={f.title} className="feature-item flex items-center gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-medium text-ink">{f.title}</p>
                <p className="text-xs text-muted">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">Curated Picks</p>
            <h2 className="font-display text-4xl font-bold text-ink">Featured Pieces</h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors border-b border-muted/40 hover:border-accent pb-0.5"
          >
            Shop All <span>→</span>
          </Link>
        </div>
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <div key={p.id} className="product-card">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="relative overflow-hidden rounded-sm h-72 md:h-96">
          <img
            src="https://picsum.photos/seed/banner1/1400/600"
            alt="New Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-ink/80 via-ink/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-end pr-12 md:pr-20">
            <div className="text-right max-w-sm">
              <p className="text-accent text-xs tracking-widest uppercase mb-3">New Arrival</p>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-paper mb-4">
                The Lighting
                <br />
                Collection
              </h3>
              <Link
                to="/shop?cat=Lighting"
                className="inline-flex items-center gap-2 border border-paper/60 text-paper px-6 py-3 text-sm hover:bg-paper hover:text-ink transition-all duration-300"
              >
                Explore <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">What's Hot</p>
            <h2 className="font-display text-4xl font-bold text-ink">Trending Now</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      {/* 
      Testimonials
      <section className="max-w-7xl mx-auto px-6 py-20 mt-8">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">What People Say</p>
          <h2 className="font-display text-4xl font-bold text-ink">Loved by Thousands</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Priya S.', text: 'The quality of everything I ordered far exceeded my expectations. This is how online furniture shopping should feel.', rating: 5 },
            { name: 'Marcus T.', text: 'Arrived beautifully packaged, assembly was simple. The Slate Dining Table is exactly as pictured — stunning.', rating: 5 },
            { name: 'Léa R.', text: 'Incredible craftsmanship. Ordered the Cashmere Throw and I genuinely never want to leave my sofa.', rating: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-ink/[0.03] rounded-sm p-7 border border-ink/8">
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <AiFillStar key={j} className="w-4 h-4 text-accent" />
                ))}
              </div>
              <p className="text-sm text-ink/70 leading-relaxed mb-5 italic font-display">"{t.text}"</p>
              <p className="text-sm font-medium text-ink">{t.name}</p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
