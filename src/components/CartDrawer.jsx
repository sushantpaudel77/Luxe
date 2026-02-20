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

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [isOpen]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={() => dispatch(closeCart())}
        className="absolute inset-0 bg-ink/30 opacity-0"
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-paper shadow-2xl flex flex-col translate-x-full"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <h2 className="font-display text-xl font-semibold">Your Cart</h2>
          <button onClick={() => dispatch(closeCart())} className="text-ink/50 hover:text-ink transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted">
            <HiOutlineShoppingCart className="w-16 h-16 opacity-20" />
            <p className="text-sm">Your cart is empty</p>
            <button onClick={() => dispatch(closeCart())}>
              <Link to="/shop" className="text-sm text-accent underline">Start shopping</Link>
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                    <p className="text-accent text-sm mt-0.5">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}
                        className="w-6 h-6 border border-ink/20 rounded flex items-center justify-center text-ink/60 hover:border-accent hover:text-accent transition-colors"
                      >−</button>
                      <span className="text-sm w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
                        className="w-6 h-6 border border-ink/20 rounded flex items-center justify-center text-ink/60 hover:border-accent hover:text-accent transition-colors"
                      >+</button>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-ink/30 hover:text-ink/70 transition-colors self-start mt-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-ink/10 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-green-600 text-xs font-medium">Free over $500</span>
              </div>
              <button className="w-full bg-ink text-paper py-3.5 text-sm font-medium tracking-wide hover:bg-accent transition-colors duration-300 rounded-sm">
                Checkout — ${total.toLocaleString()}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}