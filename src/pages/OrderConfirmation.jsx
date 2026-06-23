import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import NXTLogo from '@/components/NXTLogo';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const [count, setCount] = useState(0);
  const orderNumber = state?.orderNumber || state?.order?.order_number || 'NXT-XXXXXX';
  const order = state?.order;

  useEffect(() => {
    // Animate count-up for total
    if (order?.total_price) {
      let start = 0;
      const end = order.total_price;
      const duration = 1000;
      const step = (end / duration) * 16;
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(timer); }
        else setCount(start);
      }, 16);
      return () => clearInterval(timer);
    }
  }, [order]);

  return (
    <div className="min-h-screen bg-void-black flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Animated rings */}
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-pulse-blue/10"
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: i * 300, height: i * 300, opacity: 0 }}
          transition={{ duration: 2, delay: i * 0.3, ease: 'easeOut', repeat: Infinity, repeatDelay: 3 }}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      ))}

      <div className="relative z-10 max-w-lg w-full">
        {/* Check icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 border border-pulse-blue/40 rounded-full flex items-center justify-center relative"
            style={{ boxShadow: '0 0 40px rgba(0,209,255,0.3), inset 0 0 40px rgba(0,209,255,0.05)' }}
          >
            <CheckCircle size={36} className="text-pulse-blue" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="font-mono text-[10px] tracking-[0.4em] text-pulse-blue mb-4">// ORDER CONFIRMED</p>
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-white leading-none mb-2">
            PRINT<br />
            <span className="text-pulse-blue glow-blue-text">INITIATED</span>
          </h1>
          <div className="h-px w-20 bg-pulse-blue mx-auto mt-4" style={{ boxShadow: '0 0 10px #00D1FF' }} />
        </motion.div>

        {/* Order details card */}
        <motion.div
          className="relative border border-white/5 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-pulse-blue/40" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-pulse-blue/40" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest text-white/30">ORDER NUMBER</span>
              <span className="font-mono text-sm text-pulse-blue tracking-widest">{orderNumber}</span>
            </div>

            {order?.customer_name && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-white/30">CUSTOMER</span>
                <span className="font-mono text-sm text-white">{order.customer_name}</span>
              </div>
            )}

            {order?.customer_email && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-white/30">EMAIL</span>
                <span className="font-mono text-xs text-white/70">{order.customer_email}</span>
              </div>
            )}

            <div className="h-px bg-white/5" />

            {order?.line_items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-white">{item.product_name}</p>
                  <p className="font-mono text-[10px] text-static-grey">SIZE: {item.size} · QTY: {item.quantity}</p>
                </div>
                <span className="font-mono text-sm text-white">£{(item.unit_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            {order?.total_price && (
              <>
                <div className="h-px bg-pulse-blue/20" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50 tracking-widest">TOTAL</span>
                  <motion.span
                    className="font-mono font-bold text-2xl text-white"
                    animate={{ textShadow: ['0 0 0px #00D1FF', '0 0 20px #00D1FF', '0 0 0px #00D1FF'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    £{count.toFixed(2)}
                  </motion.span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          className="font-mono text-xs text-static-grey text-center leading-relaxed mb-8 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          WE'LL REACH OUT WITHIN 24HRS TO ARRANGE PAYMENT & SHIPPING.
          <br />CHECK YOUR EMAIL AT <span className="text-white">{order?.customer_email}</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            to="/products"
            className="btn-neon flex-1 flex items-center justify-center gap-2 border border-pulse-blue/30 text-pulse-blue font-mono text-xs tracking-widest py-4 hover:bg-pulse-blue/10 transition-all"
          >
            SHOP MORE <ArrowRight size={12} />
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 border border-white/10 text-white/40 font-mono text-xs tracking-widest py-4 hover:border-white/30 hover:text-white/60 transition-all"
          >
            <Home size={12} /> HOME
          </Link>
        </motion.div>

        {/* NXT logo bottom */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.2 }}
        >
          <NXTLogo size="md" />
        </motion.div>
      </div>
    </div>
  );
}
