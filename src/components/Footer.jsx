import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  footerShopLinks,
  footerHelpLinks,
  socialLinks,
} from '../assets/navLinks';

gsap.registerPlugin(ScrollTrigger);

/* ── Browse Collection Button ── */
function BrowseButton({ to }) {
  const btnRef = useRef(null);
  const fillRef = useRef(null);

  const handleEnter = () => {
    gsap.to(fillRef.current, { scaleX: 1, duration: 0.35, ease: 'power3.out' });
    gsap.to(btnRef.current, { color: '#0D0D0D', duration: 0.25, delay: 0.08 });
  };
  const handleLeave = () => {
    gsap.to(fillRef.current, { scaleX: 0, duration: 0.3, ease: 'power3.in' });
    gsap.to(btnRef.current, { color: 'rgba(255,255,255,0.9)', duration: 0.2 });
  };

  return (
    <Link
      ref={btnRef}
      to={to}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="shrink-0 self-start relative inline-flex items-center gap-2.5 border border-white/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest overflow-hidden rounded-sm"
      style={{ color: 'rgba(255,255,255,0.9)' }}
    >
      {/* Animated fill layer */}
      <span
        ref={fillRef}
        className="absolute inset-0 bg-accent origin-left"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />
      <span className="relative z-10">Browse Collection</span>
      <span className="relative z-10 text-[1.1em]">→</span>
    </Link>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const ctaRef = useRef(null);
  const gridRef = useRef(null);
  const logoRef = useRef(null);
  const bottomRef = useRef(null);
  const arrowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate only transform (y) on scroll — keep opacity 1 so footer is always visible on navigation
      gsap.fromTo(
        ctaRef.current,
        { y: 40 },
        {
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
        }
      );

      gsap.fromTo(
        gridRef.current?.children,
        { y: 30 },
        {
          y: 0,
          stagger: 0.1,
          duration: 0.55,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 87%' },
        }
      );

      gsap.fromTo(
        logoRef.current,
        { y: 30 },
        {
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: logoRef.current, start: 'top 95%' },
        }
      );

      gsap.fromTo(
        bottomRef.current,
        { y: 12 },
        {
          y: 0,
          duration: 0.5,
          scrollTrigger: { trigger: bottomRef.current, start: 'top 98%' },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  /* Arrow hover pulse */
  const handleArrowEnter = () => {
    gsap.to(arrowRef.current, {
      scale: 1.08,
      duration: 0.25,
      ease: 'power2.out',
    });
  };
  const handleArrowLeave = () => {
    gsap.to(arrowRef.current, { scale: 1, duration: 0.2, ease: 'power2.in' });
  };

  const scrollToTop = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="bg-[#0D0D0D] mt-20 overflow-hidden">
      {/* ── CTA strip ── */}
      <div
        ref={ctaRef}
        className="max-w-7xl mx-auto px-6 pt-14 pb-8 border-b border-white/20"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-3">
          Discover our collection
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <a
            href="mailto:hello@luxe.store"
            className="font-display text-[clamp(1.6rem,4.5vw,3.5rem)] font-bold leading-none text-accent hover:text-white transition-colors duration-400 tracking-tight"
          >
            hello@luxe.store
          </a>
          <BrowseButton to="/shop" />
        </div>
      </div>

      {/* ── Link grid ── */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {/* Brand blurb */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-[11px] font-display font-semibold text-white mb-2 tracking-wide">
            LUXE
            <span className="font-tm text-[0.5em] align-top opacity-80">™</span>
          </p>
          <p className="text-sm text-white/70 leading-relaxed max-w-[200px]">
            Curated furniture & decor for the modern home. Quality that outlasts
            trends.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-4">
            Navigate
          </p>
          <ul className="space-y-2.5">
            {[
              { url: '/', label: 'Home' },
              { url: '/shop', label: 'Shop All' },
              { url: '/wishlist', label: 'Wishlist' },
            ].map(({ url, label }) => (
              <li key={label}>
                <Link
                  to={url}
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-4">
            Collections
          </p>
          <ul className="space-y-2.5">
            {footerShopLinks.map(({ url, label }) => (
              <li key={label}>
                <Link
                  to={url}
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help + Social */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-4">
            Help
          </p>
          <ul className="space-y-2.5 mb-6">
            {footerHelpLinks.map(({ url, label }) => (
              <li key={label}>
                <a
                  href={url}
                  className="text-sm text-white/80 hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-4">
            Follow
          </p>
          <ul className="space-y-2.5">
            {socialLinks.map(({ url, label }) => (
              <li key={label}>
                <a
                  href={url}
                  className="text-sm text-white/80 hover:text-accent transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Wordmark + bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-4 flex items-end justify-between gap-4">
        {/* Wordmark — visible on all screens, heart of footer */}
        <h2
          ref={logoRef}
          className="font-display font-bold select-none leading-none text-white/60 sm:text-white/50"
          style={{
            fontSize: 'clamp(2.75rem, 14vw, 7rem)',
            letterSpacing: '-0.03em',
            minWidth: 'min-content',
          }}
        >
          LUXE
          <span className="font-tm text-[0.35em] align-top opacity-90">™</span>
        </h2>

        {/* Bottom right — copyright + scroll arrow */}
        <div ref={bottomRef} className="flex flex-col items-end gap-3 pb-1">
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms'].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[10px] text-white/55 uppercase tracking-widest hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-[10px] text-white/55 uppercase tracking-widest">
            © 2026 Luxe
            <span className="font-tm text-[0.55em] align-top">™</span>. All
            rights reserved.
          </p>

          {/* Scroll-to-top arrow */}
          <button
            ref={arrowRef}
            onClick={scrollToTop}
            onMouseEnter={handleArrowEnter}
            onMouseLeave={handleArrowLeave}
            className="group w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300 mt-1"
            aria-label="Back to top"
          >
            <svg
              className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
