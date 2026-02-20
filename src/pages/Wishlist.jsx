import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FiTrash2 } from 'react-icons/fi';
import { toggleWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';

export default function Wishlist() {
  const { items } = useSelector(s => s.wishlist);
  const dispatch = useDispatch();
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    if (gridRef.current && items.length > 0) {
      gsap.fromTo(gridRef.current.querySelectorAll('.wish-item'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, []);

  return (
    <div className="bg-paper min-h-screen">
      <div className="pt-16 max-w-7xl mx-auto px-6 py-14">
        <div ref={titleRef}>
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Saved Items</p>
          <h1 className="font-display text-5xl font-bold text-ink">Wishlist</h1>
          <p className="text-muted text-sm mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32">
            <AiOutlineHeart className="w-20 h-20 mx-auto text-ink/10 mb-6" />
            <p className="font-display text-2xl text-ink/30 mb-4">Nothing saved yet</p>
            <Link to="/shop" className="text-accent text-sm underline">Browse Products</Link>
          </div>
        ) : (
          <div ref={gridRef} className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="wish-item flex gap-5 border border-ink/10 rounded-sm p-4 hover:border-ink/25 transition-colors bg-white/50">
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-sm" />
                </Link>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <p className="text-[11px] text-muted uppercase tracking-widest">{item.category}</p>
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-display text-base font-semibold text-ink hover:text-accent transition-colors mt-0.5 leading-tight">{item.name}</h3>
                    </Link>
                    <p className="text-ink font-medium text-sm mt-1">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => dispatch(addToCart(item))}
                      className="flex-1 bg-ink text-paper py-2 text-xs font-medium tracking-wide uppercase hover:bg-accent transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => dispatch(toggleWishlist(item))}
                      className="p-2 border border-ink/20 hover:border-red-400 hover:text-red-400 text-ink/40 transition-colors rounded-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}