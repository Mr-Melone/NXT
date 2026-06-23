import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter } from 'lucide-react';
import SectionReveal from '@/components/SectionReveal';
import { base44 } from '@/api/base44Client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list('-created_date', 50)
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-void-black min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <SectionReveal>
          <div className="mb-16">
            <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-4">// PRODUCT CATALOG</p>
            <h1 className="font-heading font-bold text-6xl md:text-8xl text-white leading-none">
              THE<br />
              <span className="text-pulse-blue glow-blue-text">LINE-UP</span>
            </h1>
            <div className="mt-4 h-px w-24 bg-pulse-blue" style={{ boxShadow: '0 0 10px #00D1FF' }} />
          </div>
        </SectionReveal>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[3/4] bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="font-mono text-xs tracking-widest text-white/20">NO PRODUCTS LOADED</div>
            <div className="w-16 h-px bg-pulse-blue/30" />
            <p className="text-static-grey text-sm">Products coming soon.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, i) => (
              <motion.div key={product.id} variants={cardVariants}>
                <Link
                  to={`/product/${product.id}`}
                  className="product-card block relative bg-white/[0.02] border border-white/5 overflow-hidden group"
                >
                  {/* HUD corners */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-pulse-blue/40 z-10" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-pulse-blue/40 z-10" />

                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center voronoi-bg">
                        <motion.div
                          className="font-heading font-bold text-8xl text-white/5"
                          whileHover={{ scale: 1.1, rotateY: 15 }}
                        >
                          NXT
                        </motion.div>
                      </div>
                    )}

                    {/* Glow overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void-black via-transparent to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'radial-gradient(circle at center, rgba(0,209,255,0.08) 0%, transparent 70%)' }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.badge && (
                        <span className="font-mono text-[9px] tracking-widest bg-pulse-blue text-void-black px-2 py-0.5">
                          {product.badge}
                        </span>
                      )}
                      {product.stock_status === 'low_stock' && (
                        <span className="font-mono text-[9px] tracking-widest bg-glitch-red/80 text-white px-2 py-0.5">
                          LOW STOCK
                        </span>
                      )}
                      {product.stock_status === 'out_of_stock' && (
                        <span className="font-mono text-[9px] tracking-widest bg-white/10 text-white/60 px-2 py-0.5">
                          SOLD OUT
                        </span>
                      )}
                    </div>

                    {/* Watermark NXT */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <span className="font-heading font-bold text-[10rem] text-white/[0.03] select-none group-hover:-translate-x-4 transition-transform duration-700">NXT</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-heading font-bold text-xl text-white">{product.name}</h3>
                        {product.tagline && (
                          <p className="font-mono text-xs text-static-grey mt-0.5 truncate max-w-[200px]">{product.tagline}</p>
                        )}
                      </div>
                      {product.sku && (
                        <span className="font-mono text-[9px] text-white/20 tracking-widest shrink-0 ml-2 mt-1">
                          #{product.sku}
                        </span>
                      )}
                    </div>

                    <div className="h-px bg-white/5 my-3" />

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-static-grey">FROM</span>
                        <p className="font-mono font-bold text-2xl text-white">£{product.price.toFixed(2)}</p>
                      </div>
                      <motion.div
                        className="flex items-center gap-2 font-mono text-xs tracking-widest text-pulse-blue border border-pulse-blue/30 px-4 py-2"
                        whileHover={{ backgroundColor: 'rgba(0,209,255,0.1)' }}
                      >
                        CONFIGURE <ArrowRight size={10} />
                      </motion.div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex gap-1 mt-3">
                        {product.sizes.map(s => (
                          <span key={s} className="font-mono text-[9px] text-white/30 border border-white/10 px-1.5 py-0.5">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
