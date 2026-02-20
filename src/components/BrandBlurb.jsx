import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function BrandBlurb({ logoRef }) {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--gx', `${x}px`);
    containerRef.current.style.setProperty('--gy', `${y}px`);
    containerRef.current.style.setProperty('--torch', '1');
  };

  const handleMouseLeave = () => {
    containerRef.current.style.setProperty('--torch', '0');
  };

  const sharedStyle = {
    fontSize: 'clamp(2.75rem, 14vw, 7rem)',
    letterSpacing: '-0.03em',
    minWidth: 'min-content',
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 95%' },
        delay: 0.7,
      }
    );
    return () => {
      anim.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === el)
        .forEach((t) => t.kill());
    };
  }, []);
  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (logoRef) logoRef.current = el;
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave} 
      className="relative inline-block select-none leading-none cursor-default wordmark-torch"
      style={{ '--torch': 0, '--gx': '50%', '--gy': '50%' }}
    >
      <h2 className="font-display font-bold leading-none text-white/20" style={sharedStyle}>
        LUXE<span className="font-tm text-[0.35em] align-top opacity-70">™</span>
      </h2>

      <h2
        className="absolute inset-0 font-display font-bold leading-none text-white pointer-events-none wordmark-torch__reveal"
        style={sharedStyle}
        aria-hidden="true"
      >
        LUXE<span className="font-tm text-accent text-[0.35em] align-top">™</span>
      </h2>

      <style>{`
        .wordmark-torch__reveal {
          opacity: var(--torch);
          transition: opacity 0.4s ease;
          -webkit-mask-image: radial-gradient(
            circle 90px at var(--gx) var(--gy),
            black 0%,
            black 25%,
            transparent 100%
          );
          mask-image: radial-gradient(
            circle 90px at var(--gx) var(--gy),
            black 0%,
            black 25%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
}
