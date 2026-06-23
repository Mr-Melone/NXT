import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem, setIsCartOpen } = useCart();

  useEffect(() => {
    base44.entities.Product.list('-created_date', 50).then(all => {
        const found = all.filter(p => p.id === id);
        return found;
      })
      .then(results => {
        const p = results[0] || null;
        setProduct(p);
        if (p?.sizes?.length > 0) setSelectedSize(p.sizes[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    addItem(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => { setAdded(false); }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void-black flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border border-pulse-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-static-grey tracking-widest">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-void-black flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-xs text-white/30 tracking-widest">PRODUCT NOT FOUND</p>
        <Link to="/products" className="font-mono text-xs text-pulse-blue tracking-widest">← BACK TO CATALOG</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [null];

  return (
    <div className="bg-void-black min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-center gap-2 font-mono text-xs text-white/30 tracking-widest">
        <Link to="/" className="hover:text-white/60 transition-colors">HOME</Link>
        <ChevronRight size={10} />
        <Link to="/products" className="hover:text-white/60 transition-colors">PRODUCTS</Link>
        <ChevronRight size={10} />
        <span className="text-pulse-blue">{product.name.toUpperCase()}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Left: Image panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square bg-white/[0.02] border border-white/5 overflow-hidden group">
              {/* HUD corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-pulse-blue/60 z-10" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-pulse-blue/60 z-10" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-pulse-blue/60 z-10" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-pulse-blue/60 z-10" />

              <AnimatePresence mode="wait">
                {images[activeImage] ? (
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    className="absolute inset-0 flex items-center justify-center voronoi-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-center">
                      <div className="font-heading font-bold text-9xl text-white/5">NXT</div>
                      <div className="font-mono text-xs text-white/10 tracking-widest mt-2">3D PRINTED</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scan line effect */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(transparent 50%, rgba(0,209,255,0.01) 50%)',
                  backgroundSize: '100% 4px'
                }}
              />

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 40px rgba(0,209,255,0.08)' }}
              />

              {/* SKU */}
              {product.sku && (
                <div className="absolute bottom-3 left-3 font-mono text-[9px] text-white/20 tracking-widest">
                  SKU: {product.sku}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 bg-white/[0.02] border transition-colors overflow-hidden ${
                      activeImage === i ? 'border-pulse-blue' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div>
              {product.badge && (
                <span className="font-mono text-[10px] tracking-widest bg-pulse-blue text-void-black px-2 py-0.5 mb-3 inline-block">
                  {product.badge}
                </span>
              )}
              <h1 className="font-heading font-bold text-4xl md:text-6xl text-white leading-none mb-3">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="font-mono text-sm text-static-grey tracking-widest">{product.tagline}</p>
              )}

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-mono text-xs text-static-grey">PRICE</span>
                <span className="font-mono font-bold text-4xl text-white">£{product.price.toFixed(2)}</span>
              </div>

              <div className="mt-2 h-px bg-gradient-to-r from-pulse-blue/40 via-pulse-blue/10 to-transparent" />
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mb-3">// OVERVIEW</p>
                <p className="font-body text-sm text-white/70 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mb-3">// SPEC SHEET</p>
                <div className="space-y-2">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="font-mono text-xs text-static-grey tracking-widest">{spec.label}</span>
                      <span className="font-mono text-xs text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-white/30">// SELECT SIZE</p>
                  {sizeError && (
                    <motion.span
                      className="font-mono text-[9px] text-glitch-red tracking-widest"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      SELECT A SIZE
                    </motion.span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-btn px-4 py-2 ${selectedSize === size ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mb-3">// QUANTITY</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center font-mono text-sm text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-mono text-xs text-static-grey">
                  SUBTOTAL: <span className="text-white">£{(product.price * quantity).toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Add to cart */}
            <div className="space-y-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock_status === 'out_of_stock'}
                className={`btn-neon w-full flex items-center justify-center gap-3 font-mono font-bold text-sm tracking-widest py-4 transition-all duration-300 ${
                  added
                    ? 'bg-green-500/20 border border-green-500/60 text-green-400'
                    : product.stock_status === 'out_of_stock'
                    ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    : 'bg-pulse-blue text-void-black hover:shadow-[0_0_40px_rgba(0,209,255,0.4)]'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" className="flex items-center gap-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <Check size={16} /> ADDED TO CART
                    </motion.span>
                  ) : (
                    <motion.span key="add" className="flex items-center gap-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <ShoppingCart size={16} />
                      {product.stock_status === 'out_of_stock' ? 'SOLD OUT' : 'ADD TO CART'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {added && (
                <motion.button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full font-mono text-xs tracking-widest text-pulse-blue border border-pulse-blue/30 py-3 hover:bg-pulse-blue/10 transition-colors"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  VIEW CART →
                </motion.button>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                product.stock_status === 'in_stock' ? 'bg-pulse-blue animate-pulse' :
                product.stock_status === 'low_stock' ? 'bg-yellow-400 animate-pulse' :
                'bg-white/20'
              }`} />
              <span className="font-mono text-[10px] tracking-widest text-static-grey">
                {product.stock_status === 'in_stock' ? 'IN STOCK' :
                 product.stock_status === 'low_stock' ? 'LOW STOCK — ORDER SOON' :
                 'OUT OF STOCK'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
