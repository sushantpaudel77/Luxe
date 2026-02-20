import { useRef } from 'react';

export default function BrandBlurb() {
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

  return (
    <div className="col-span-2 md:col-span-1">
      {/*
        The entire magic lives on this one element via CSS custom properties.
        --torch: 0 by default, set to 1 on hover via JS for smooth transition.
        --gx / --gy: cursor position relative to the container.
      */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block mb-2 cursor-default select-none brand-torch"
        style={{ '--torch': 0, '--gx': '50%', '--gy': '50%' }}
      >
        {/* ① Base layer — very dark, always visible */}
        <p className="text-[11px] font-display font-semibold tracking-wide text-white/12">
          LUXE<span className="font-tm text-[0.5em] align-top">™</span>
        </p>

        {/* ② Torch reveal layer — masked to cursor spotlight */}
        <p className="absolute inset-0 text-[11px] font-display font-semibold tracking-wide text-white pointer-events-none brand-torch__reveal">
          LUXE<span className="font-tm text-[0.5em] align-top text-accent">™</span>
        </p>
      </div>

      <p className="text-sm text-white/70 leading-relaxed max-w-[200px]">
        Curated furniture & decor for the modern home. Quality that outlasts trends.
      </p>

      {/* Scoped styles — no global pollution */}
      <style>{`
        .brand-torch__reveal {
          opacity: var(--torch);
          transition: opacity 0.35s ease;
          -webkit-mask-image: radial-gradient(
            circle 32px at var(--gx) var(--gy),
            black 0%,
            transparent 100%
          );
          mask-image: radial-gradient(
            circle 32px at var(--gx) var(--gy),
            black 0%,
            transparent 100%
          );
        }

        /* Warm ambient glow behind text, follows cursor via pseudo */
        .brand-torch::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: 4px;
          background: radial-gradient(
            circle 40px at var(--gx) var(--gy),
            rgba(200, 169, 110, 0.22) 0%,
            transparent 70%
          );
          opacity: var(--torch);
          transition: opacity 0.35s ease;
        }
      `}</style>
    </div>
  );
}
