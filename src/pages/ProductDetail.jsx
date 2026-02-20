import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { products } from '../assets/products';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const dispatch = useDispatch();
  const wishlist = useSelector(s => s.wishlist.items);
  const isWishlisted = wishlist.some(i => i.id === product?.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const imgRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(imgRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo(infoRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  }, [id]);

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="font-display text-3xl text-ink/30">Product not found</p>
        <Link to="/shop" className="mt-4 text-accent text-sm underline inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  return (
    <div className="bg-paper">
      <div className="pt-16 max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-10">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?cat=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div ref={imgRef} className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-ink/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <span className={`absolute top-4 left-4 text-[11px] font-medium tracking-wider px-2.5 py-1 ${
                product.badge === 'Sale' ? 'bg-red-600 text-paper' :
                product.badge === 'New' ? 'bg-ink text-paper' :
                'bg-accent text-paper'
              }`}>
                {product.badge === 'Sale' && discount ? `−${discount}%` : product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div ref={infoRef} className="flex flex-col">
            <p className="text-xs uppercase tracking-widest text-muted mb-2">{product.category}</p>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) =>
                  i < Math.floor(product.rating) ? (
                    <AiFillStar key={i} className="w-4 h-4 text-accent" />
                  ) : (
                    <AiOutlineStar key={i} className="w-4 h-4 text-ink/20" />
                  )
                )}
              </div>
              <span className="text-sm text-muted">{product.rating} · {product.reviews} reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-3xl font-semibold text-ink">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-muted line-through text-lg">${product.originalPrice.toLocaleString()}</span>
                  <span className="text-red-600 text-sm font-medium">−{discount}%</span>
                </>
              )}
            </div>

            <p className="text-ink/60 text-sm leading-relaxed mt-6 border-t border-ink/10 pt-6">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-muted mb-3">Available Colors</p>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className="w-7 h-7 rounded-full border-2 border-paper shadow-md hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-muted mb-3">Quantity</p>
              <div className="flex items-center gap-0 border border-ink/20 w-fit">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
                >−</button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                  added ? 'bg-green-600 text-paper' : 'bg-ink text-paper hover:bg-accent'
                }`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className={`w-14 border transition-all duration-300 flex items-center justify-center ${
                  isWishlisted ? 'border-red-500 bg-red-50' : 'border-ink/20 hover:border-ink'
                }`}
              >
                {isWishlisted ? (
                  <AiFillHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <AiOutlineHeart className="w-5 h-5 text-ink/60" />
                )}
              </button>
            </div>

            {/* Trust */}
            <div className="mt-8 pt-6 border-t border-ink/10 space-y-2">
              {['🚚 Free shipping on this order', '↩️ 60-day hassle-free returns', '🔒 Secure, encrypted checkout'].map(line => (
                <p key={line} className="text-xs text-muted">{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-widest text-muted mb-2">More from {product.category}</p>
              <h2 className="font-display text-3xl font-bold text-ink">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}