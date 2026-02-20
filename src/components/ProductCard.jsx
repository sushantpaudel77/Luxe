import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { gsap } from 'gsap';
import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(s => s.wishlist.items);
  const isWishlisted = wishlist.some(i => i.id === product.id);
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);
  const btnRef = useRef(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    setAdded(true);
    gsap.to(btnRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
    });
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      ref={cardRef}
      className="group block relative"
    >
      <div className="relative overflow-hidden rounded-sm bg-ink/5 aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-all duration-500" />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-medium tracking-wider px-2 py-1 ${
            product.badge === 'Sale' ? 'bg-red-600 text-paper' :
            product.badge === 'New' ? 'bg-ink text-paper' :
            'bg-accent text-paper'
          }`}>
            {product.badge === 'Sale' && discount ? `−${discount}%` : product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-paper/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-paper"
        >
          {isWishlisted ? (
            <AiFillHeart className="w-4 h-4 text-red-500" />
          ) : (
            <AiOutlineHeart className="w-4 h-4 text-ink/60" />
          )}
        </button>

        {/* Add to cart */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <button
            ref={btnRef}
            onClick={handleAddToCart}
            className={`w-full py-3 text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
              added
                ? 'bg-green-600 text-paper'
                : 'bg-paper text-ink hover:bg-accent hover:text-paper'
            }`}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <p className="text-[11px] text-muted uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="font-display text-base font-semibold text-ink group-hover:text-accent transition-colors duration-200 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-ink font-medium text-sm">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-muted text-xs line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) =>
              i < Math.floor(product.rating) ? (
                <AiFillStar key={i} className="w-3 h-3 text-accent" />
              ) : (
                <AiOutlineStar key={i} className="w-3 h-3 text-ink/20" />
              )
            )}
          </div>
          <span className="text-muted text-[11px]">({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
}