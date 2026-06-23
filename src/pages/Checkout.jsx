import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useCart } from '@/lib/CartContext';

function InputField({ label, id, type = 'text', required, placeholder, value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="font-mono text-[10px] tracking-[0.25em] text-white/40 block">
        {label}{required && <span className="text-pulse-blue ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white/[0.03] border px-4 py-3 font-body text-sm text-white placeholder-white/20 outline-none transition-all duration-200 ${
            error ? 'border-glitch-red/60 focus:border-glitch-red' : 'border-white/10 focus:border-pulse-blue/60'
          } focus:bg-white/[0.05]`}
          style={{ caretColor: 'var(--pulse-blue)' }}
        />
        {error && <p className="text-glitch-red font-mono text-[9px] tracking-widest mt-1">{error}</p>}
      </div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    order_notes: '',
  });
  const [errors, setErrors] = useState({});
  const slideRef = useRef(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const slideProgressRef = useRef(0);
  const [sliding, setSliding] = useState(false);
  const [slideComplete, setSlideComplete] = useState(false);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = 'REQUIRED';
    if (!form.customer_email.trim()) errs.customer_email = 'REQUIRED';
    else if (!/\S+@\S+\.\S+/.test(form.customer_email)) errs.customer_email = 'INVALID EMAIL';
    if (!form.delivery_address.trim()) errs.delivery_address = 'REQUIRED';
    return errs;
  };

  const submitOrder = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); setSlideComplete(false); setSlideProgress(0); return; }

    setSubmitting(true);
    const orderNumber = 'NXT-' + Date.now().toString().slice(-6);
    const line_items = items.map(i => ({
      product_id: i.product_id,
      product_name: i.product_name,
      size: i.size,
      quantity: i.quantity,
      unit_price: i.unit_price,
    }));

    const order = await base44.entities.Order.create({
      ...form,
      line_items,
      total_price: total,
      status: 'pending',
      order_number: orderNumber,
    });

    clearCart();
    navigate('/order-confirmation', { state: { order, orderNumber } });
  };

  // Slide-to-confirm gesture
  const handleSlideStart = (e) => {
    if (items.length === 0) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSliding(true);
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const containerWidth = slideRef.current?.offsetWidth || 300;
    const thumbWidth = 52;
    const maxTravel = containerWidth - thumbWidth - 8;

    const onMove = (moveE) => {
      const currentX = moveE.type === 'touchmove' ? moveE.touches[0].clientX : moveE.clientX;
      const progress = Math.max(0, Math.min(1, (currentX - startX) / maxTravel));
      slideProgressRef.current = progress;
      setSlideProgress(progress);
      if (progress >= 0.95) {
        setSlideComplete(true);
        onEnd();
      }
    };
    const onEnd = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      setSliding(false);
      if (slideProgressRef.current < 0.95) {
        setSlideProgress(0);
        slideProgressRef.current = 0;
        setSlideComplete(false);
      } else {
        submitOrder();
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="min-h-screen bg-void-black flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-xs text-white/30 tracking-widest">YOUR CART IS EMPTY</p>
        <Link to="/products" className="font-mono text-xs text-pulse-blue tracking-widest">← BROWSE PRODUCTS</Link>
      </div>
    );
  }

  return (
    <div className="bg-void-black min-h-screen pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="py-8 border-b border-white/5 mb-10">
          <Link to="/products" className="flex items-center gap-2 font-mono text-xs text-white/30 tracking-widest hover:text-white/60 transition-colors mb-6">
            <ArrowLeft size={12} /> BACK
          </Link>
          <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-3">// CHECKOUT</p>
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-white">FINALIZE</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-1">
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30">01 // CUSTOMER INFO</p>
              <div className="h-px bg-pulse-blue/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="FULL NAME" id="name" required
                value={form.customer_name} onChange={set('customer_name')}
                placeholder="Your name" error={errors.customer_name}
              />
              <InputField
                label="EMAIL" id="email" type="email" required
                value={form.customer_email} onChange={set('customer_email')}
                placeholder="your@email.com" error={errors.customer_email}
              />
              <InputField
                label="PHONE" id="phone"
                value={form.customer_phone} onChange={set('customer_phone')}
                placeholder="+44 7xxx xxxxxx"
              />
            </div>

            <div className="space-y-1 pt-4">
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30">02 // DELIVERY</p>
              <div className="h-px bg-pulse-blue/20" />
            </div>

            <div className="space-y-4">
              <InputField
                label="DELIVERY ADDRESS" id="address" required
                value={form.delivery_address} onChange={set('delivery_address')}
                placeholder="Street, City, Postcode, Country" error={errors.delivery_address}
              />
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] tracking-[0.25em] text-white/40 block">ORDER NOTES</label>
                <textarea
                  value={form.order_notes}
                  onChange={set('order_notes')}
                  rows={3}
                  placeholder="Any special instructions..."
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-pulse-blue/60 px-4 py-3 font-body text-sm text-white placeholder-white/20 outline-none resize-none transition-all duration-200 focus:bg-white/[0.05]"
                  style={{ caretColor: 'var(--pulse-blue)' }}
                />
              </div>
            </div>

            {/* Slide to confirm */}
            <div className="pt-4">
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 mb-4">03 // CONFIRM ORDER</p>
              <div
                ref={slideRef}
                className="slide-to-confirm relative h-14 bg-white/[0.03] border border-white/10 overflow-hidden cursor-pointer select-none"
                style={{ borderColor: slideComplete ? 'rgba(0,209,255,0.6)' : undefined }}
              >
                {/* Progress fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-pulse-blue/15 transition-none"
                  style={{ width: `${slideProgress * 100}%` }}
                />
                {/* Track label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-mono text-xs tracking-widest text-white/30">
                    {slideComplete ? '✓ INITIATING...' : 'SLIDE TO PRINT →'}
                  </span>
                </div>
                {/* Thumb */}
                <div
                  className="slide-thumb w-11 h-11 bg-pulse-blue flex items-center justify-center cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${4 + slideProgress * (((slideRef.current?.offsetWidth || 300) - 52 - 8))}px`,
                    boxShadow: '0 0 20px rgba(0,209,255,0.4)',
                  }}
                  onMouseDown={handleSlideStart}
                  onTouchStart={handleSlideStart}
                >
                  {submitting ? (
                    <Loader2 size={16} className="text-void-black animate-spin" />
                  ) : (
                    <ChevronRight size={16} className="text-void-black" />
                  )}
                </div>
              </div>
              <p className="font-mono text-[9px] text-white/20 tracking-widest mt-2">
                BY CONFIRMING YOU AGREE TO OUR TERMS. NO PAYMENT NOW — WE'LL CONTACT YOU TO ARRANGE.
              </p>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="relative border border-white/5 p-6 space-y-4">
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-pulse-blue/40" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-pulse-blue/40" />

                <p className="font-mono text-[10px] tracking-[0.3em] text-white/30">// ORDER SUMMARY</p>

                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-body text-sm text-white truncate">{item.product_name}</p>
                        <p className="font-mono text-xs text-static-grey">SIZE: {item.size} · QTY: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-sm text-white whitespace-nowrap">
                        £{(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-static-grey tracking-widest">SUBTOTAL</span>
                  <span className="font-mono text-sm text-white">£{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-static-grey tracking-widest">SHIPPING</span>
                  <span className="font-mono text-xs text-pulse-blue">TBC</span>
                </div>

                <div className="h-px bg-pulse-blue/20" />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50 tracking-widest">TOTAL</span>
                  <span className="font-mono font-bold text-2xl text-white glow-blue-text">£{total.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="font-mono text-[9px] text-white/20 leading-relaxed">
                    PAYMENT ARRANGED AFTER ORDER CONFIRMATION. WE'LL REACH OUT WITHIN 24HRS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
