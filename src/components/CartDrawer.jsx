import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeCart, removeFromCart, updateQty } from '../store/cartSlice';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { HiOutlineShoppingCart } from 'react-icons/hi';

export default function CartDrawer() {
  const { isOpen, items } = useSelector(s => s.cart);
  const dispatch = useDispatch();
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const itemsRef = useRef([]);
  const footerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;

    if (isOpen) {
      // Kill any running tweens on these elements
      gsap.killTweensOf([drawer, overlay]);

      // Overlay fade in
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      // Drawer slide in — weighted, physical feel
      gsap.fromTo(
        drawer,
        { x: '100%' },
        { x: '0%', duration: 0.75, ease: 'power4.out' }
      );

      // Stagger header, items, footer after drawer lands
      const tl = gsap.timeline({ delay: 0.1 });

      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: -6 },
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
        );
      }

      const visibleItems = itemsRef.current.filter(Boolean);
      if (visibleItems.length > 0) {
        tl.fromTo(
          visibleItems,
          { opacity: 0, x: 16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.25,
            ease: 'power2.out',
            stagger: 0.05,
          },
          '-=0.1'
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
          '-=0.1'
        );
      }
    } else {
      gsap.killTweensOf([drawer, overlay, ...itemsRef.current.filter(Boolean)]);

      gsap.to(overlay, { opacity: 0, duration: 0.45, ease: 'power2.in' });
      gsap.to(drawer, {
        x: '100%',
        duration: 0.5,
        ease: 'power4.in',
      });
    }
  }, [isOpen]);

  // Animate new items when they're added while drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const visibleItems = itemsRef.current.filter(Boolean);
    if (visibleItems.length === 0) return;

    // Only animate the last item (newly added)
    const lastItem = visibleItems[visibleItems.length - 1];
    gsap.fromTo(
      lastItem,
      { opacity: 0, x: 24, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
    );
  }, [items.length]);

  const handleRemove = (id, index) => {
    const el = itemsRef.current[index];
    if (el) {
      gsap.to(el, {
        opacity: 0,
        x: 30,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => dispatch(removeFromCart(id)),
      });
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={() => dispatch(closeCart())}
        className="absolute inset-0 bg-ink/30 opacity-0 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-paper shadow-2xl flex flex-col translate-x-full will-change-transform"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between px-6 py-5 border-b border-ink/10"
        >
          <h2 className="font-display text-xl font-semibold">Your Cart</h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="text-ink/50 hover:text-ink transition-colors duration-200 hover:rotate-90 transform"
            style={{ transition: 'color 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
            <HiOutlineShoppingCart className="w-16 h-16 opacity-20" />
            <p className="text-sm">Your cart is empty</p>
            <button onClick={() => dispatch(closeCart())}>
              <Link to="/shop" className="text-sm text-accent underline">
                Start shopping
              </Link>
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  ref={el => (itemsRef.current[index] = el)}
                  className="flex gap-4 will-change-transform"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    style={{ transition: 'transform 0.2s ease' }}
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.25, ease: 'power2.out' })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: 'power2.out' })}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-accent text-sm mt-0.5">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
                        className="w-6 h-6 border border-ink/20 rounded flex items-center justify-center text-ink/60 hover:border-accent hover:text-accent transition-colors duration-150"
                      >
                        −
                      </button>
                      <span className="text-sm w-4 text-center tabular-nums">{item.qty}</span>
                      <button
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                        className="w-6 h-6 border border-ink/20 rounded flex items-center justify-center text-ink/60 hover:border-accent hover:text-accent transition-colors duration-150"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id, index)}
                    className="text-ink/30 hover:text-ink/70 transition-colors duration-200 self-start mt-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div ref={footerRef} className="px-6 py-5 border-t border-ink/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium tabular-nums">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-green-600 text-xs font-medium">Free over $500</span>
              </div>
              <button
                className="w-full bg-ink text-paper py-3.5 text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300 rounded-sm active:scale-[0.98]"
                style={{ transition: 'background-color 0.3s ease, transform 0.1s ease' }}
                onMouseEnter={e => gsap.to(e.currentTarget, { y: -1, duration: 0.2, ease: 'power2.out' })}
                onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: 'power2.out' })}
                onMouseDown={e => gsap.to(e.currentTarget, { scale: 0.98, duration: 0.1, ease: 'power2.out' })}
                onMouseUp={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.15, ease: 'back.out(2)' })}
              >
                Checkout — ${total.toLocaleString()}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}