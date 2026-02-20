import { AiFillInstagram, AiFillPinterest } from 'react-icons/ai';

export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-ink border-b border-white/10 h-9 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">

        {/* Left — social icons */}
        <div className="flex items-center gap-2">
          <a href="#" aria-label="Instagram" className="text-paper hover:text-accent transition-colors duration-200">
            <AiFillInstagram className="w-4 h-4" />
          </a>
          <a href="#" aria-label="Pinterest" className="text-paper hover:text-accent transition-colors duration-200">
            <AiFillPinterest className="w-4 h-4" />
          </a>
          <span className="text-[11px] text-accent font-medium tracking-wide">New season</span>
        </div>

        {/* Center — announcement */}
        <p className="text-[11px] sm:text-xs text-paper text-center flex-1 min-w-0 truncate sm:truncate-none tracking-wide px-2">
          <span className="text-accent font-medium">Free shipping</span> on orders over $500 · New arrivals every Friday
        </p>

        {/* Right — phone */}
        <div className="flex items-center gap-4">
          <a href="tel:+12120000000" className="text-[11px] text-paper hover:text-accent transition-colors tracking-wide whitespace-nowrap">
            +1 (212) 000-0000
          </a>
        </div>

      </div>
    </div>
  );
}