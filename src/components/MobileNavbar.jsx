import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { mobileNavLinks } from '../assets/navLinks';

export default function MobileNavbar({ isOpen, onClose }) {
  const mobileRef = useRef(null);
  const linksRef = useRef([]);
  const metaRef = useRef(null);

  useEffect(() => {
    if (!mobileRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.set(mobileRef.current, { display: 'flex' });
      tl.fromTo(mobileRef.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.65, ease: 'power4.inOut' }
      );
      tl.fromTo(linksRef.current,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'power3.out' },
        '-=0.3'
      );
      tl.fromTo(metaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
        '-=0.2'
      );
    } else {
      document.body.style.overflow = '';
      const tl = gsap.timeline();
      tl.to(linksRef.current,
        { y: -30, opacity: 0, stagger: 0.04, duration: 0.2, ease: 'power2.in' }
      );
      tl.to(mobileRef.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0, duration: 0.45, ease: 'power4.inOut' },
        '-=0.05'
      );
      tl.set(mobileRef.current, { display: 'none' });
    }
  }, [isOpen]);

  return (
    <div
      ref={mobileRef}
      className="md:hidden fixed inset-0 z-40 bg-paper flex flex-col px-7 pt-[100px] pb-10"
      style={{ display: 'none', clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
    >
      <nav className="flex-1 flex flex-col justify-center gap-0 overflow-hidden">
        {mobileNavLinks.map(({ url, label }, i) => (
          <Link
            key={label}
            to={url}
            ref={el => (linksRef.current[i] = el)}
            onClick={onClose}
            className="font-display text-xl sm:text-2xl leading-snug font-semibold text-ink hover:text-accent transition-colors duration-200 tracking-tight py-3"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div ref={metaRef} className="pt-6 mt-4">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-1.5">Store</p>
            <p className="text-sm text-ink/80 leading-relaxed">
              Kathmandu<br />Pokhara · Nepalgunj
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-1.5">Contact</p>
            <p className="text-sm text-ink/80 leading-relaxed">
              hello@luxe.store
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-ink/60 uppercase tracking-widest">© 2026 LUXE<span className="font-tm text-accent text-[0.7em] align-top">™</span></p>
          <div className="flex gap-5">
            {['Instagram', 'Pinterest'].map(s => (
              <a key={s} href="#"
                className="text-[10px] uppercase tracking-widest font-semibold text-ink/70 hover:text-accent transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
