import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-void-black border-l border-pulse-blue/20 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div>
                <h2 className="font-mono text-xs tracking-[0.3em] text-static-grey mb-1">COMMAND CENTER</h2>
                <p className="font-heading font-bold text-xl text-white">
                  CART <span className="text-pulse-blue">[{itemCount}]</span>
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scan line accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-pulse-blue/50 to-transparent" />

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full gap-4 py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-static-grey font-mono text-xs tracking-widest">NO LINE ITEMS</div>
                    <div className="w-16 h-px bg-pulse-blue/30" />
                    <p className="text-white/30 text-sm text-center">Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 font-mono text-xs tracking-widest text-pulse-blue border border-pulse-blue/30 px-6 py-2 hover:bg-pulse-blue/10 transition-colors"
                    >
                      BROWSE PRODUCTS →
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                      className="relative border border-white/5 p-4 group hover:border-pulse-blue/20 transition-colors"
                    >
                      {/* HUD corners */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-pulse-blue/40" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-pulse-blue/40" />

                      <div className="flex gap-3">
                        {item.product_image && (
                          <div className="w-16 h-16 bg-white/5 flex-shrink-0 overflow-hidden">
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-sm text-white truncate">{item.product_name}</p>
                          <p className="font-mono text-xs text-static-grey mt-0.5">SIZE: {item.size}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="w-6 h-6 border border-white/20 hover:border-pulse-blue/60 flex items-center justify-center text-white/60 hover:text-pulse-blue transition-colors"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="font-mono text-xs text-white w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="w-6 h-6 border border-white/20 hover:border-pulse-blue/60 flex items-center justify-center text-white/60 hover:text-pulse-blue transition-colors"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-white">
                                £{(item.unit_price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-white/20 hover:text-glitch-red transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 px-6 py-5 space-y-4">
                <div className="h-px bg-gradient-to-r from-transparent via-pulse-blue/30 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-static-grey">TOTAL</span>
                  <span className="font-heading font-bold text-2xl text-white glow-blue-text">
                    £{total.toFixed(2)}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-neon w-full flex items-center justify-center gap-3 bg-pulse-blue text-void-black font-mono font-bold text-sm tracking-widest py-4 hover:shadow-[0_0_30px_rgba(0,209,255,0.4)] transition-all duration-300"
                >
                  PROCEED TO CHECKOUT <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
