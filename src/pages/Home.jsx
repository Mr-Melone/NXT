import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Zap, Shield, Cpu, ChevronDown } from 'lucide-react';
import NXTLogo from '@/components/NXTLogo';
import ParticleField from '@/components/ParticleField';
import SectionReveal from '@/components/SectionReveal';
import ShinpadHologram from '@/components/ShinpadHologram';
import { base44 } from '@/api/base44Client';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [bootDone, setBootDone] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.88]);
  const hologramY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    base44.entities.Product.filter({ featured: true }, '-created_date', 3)
      .then(setProducts)
      .catch(() => {});
  }, []);

  const features = [
    { icon: Cpu, label: 'PRECISION PRINTED', desc: 'FDM lattice engineering with 0.1mm layer resolution' },
    { icon: Shield, label: 'IMPACT CERTIFIED', desc: 'Engineered geometry that disperses force across the entire structure' },
    { icon: Zap, label: 'ULTRA LIGHT', desc: 'Optimised infill patterns reduce weight without sacrificing strength' },
  ];

  return (
    <div className="bg-void-black">
      {/* Boot sequence */}
      <motion.div
        className="fixed inset-0 z-[100] bg-void-black flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: bootDone ? 0 : 1, pointerEvents: bootDone ? 'none' : 'all' }}
        transition={{ duration: 0.5, delay: bootDone ? 0 : 0 }}
      >
        <div className="w-48 space-y-1 mb-8">
          {['SYSTEM BOOT', 'LOADING NXT.EXE', 'CALIBRATING...'].map((text, i) => (
            <motion.div
              key={text}
              className="font-mono text-xs text-pulse-blue/60 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3 }}
            >
              {'> '}{text}
            </motion.div>
          ))}
          <motion.div
            className="h-px bg-pulse-blue/30 mt-2 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </div>
        <NXTLogo size="xl" animate />
      </motion.div>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden grid-bg voronoi-bg">
        <ParticleField count={50} />

        {/* Animated grid lines */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: heroOpacity }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px bg-pulse-blue/10"
              style={{ top: `${(i + 1) * 16}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`v${i}`}
              className="absolute top-0 bottom-0 w-px bg-pulse-blue/10"
              style={{ left: `${(i + 1) * 16}%` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
            />
          ))}
        </motion.div>

        {/* Hologram — right side */}
        <motion.div
          className="absolute right-[5%] md:right-[8%] top-1/2 -translate-y-1/2 hidden md:block z-10 pointer-events-auto"
          style={{ y: hologramY, opacity: heroOpacity }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShinpadHologram size={300} />
        </motion.div>

        {/* Center content */}
        <motion.div
          className="relative z-10 text-center flex flex-col items-center"
          style={{ y: heroY, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <NXTLogo size="hero" />
          </motion.div>

          <motion.div
            className="mt-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.6 }}
          >
            <motion.p
              className="font-display font-semibold text-xl md:text-3xl tracking-[0.5em] text-white/80 uppercase"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 2.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              WE GOT NEXT
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-2 h-px w-32 bg-pulse-blue mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.9, duration: 0.8 }}
            style={{ boxShadow: '0 0 10px #00D1FF' }}
          />

          <motion.p
            className="mt-6 font-mono text-xs tracking-[0.2em] text-static-grey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            3D PRINTED SHIN PADS // ENGINEERED TO DOMINATE
          </motion.p>

          <motion.div
            className="mt-10 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4, duration: 0.6 }}
          >
            <Link
              to="/products"
              className="btn-neon flex items-center gap-2 bg-pulse-blue text-void-black font-mono font-bold text-xs tracking-widest px-8 py-3 hover:shadow-[0_0_30px_rgba(0,209,255,0.5)] transition-all duration-300"
            >
              SHOP NOW <ArrowRight size={14} />
            </Link>
            <a
              href="#features"
              className="font-mono text-xs tracking-widest text-white/60 border border-white/10 px-8 py-3 hover:border-pulse-blue/40 hover:text-white transition-all duration-300"
            >
              LEARN MORE
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          <span className="font-mono text-[10px] tracking-widest text-white/20">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-pulse-blue/50 to-transparent scroll-indicator" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-20">
            <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-4">// ENGINEERED ADVANTAGE</p>
            <h2 className="font-heading font-bold text-5xl md:text-7xl text-white">
              BUILT<br />
              <span className="text-pulse-blue glow-blue-text">DIFFERENT</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {features.map((feat, i) => (
            <SectionReveal key={feat.label} delay={i * 0.1}>
              <div className="relative bg-void-black p-8 group hover:bg-white/[0.02] transition-colors hud-corner">
                <feat.icon size={24} className="text-pulse-blue mb-6 group-hover:animate-pulse" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-lg tracking-widest text-white mb-3">{feat.label}</h3>
                <p className="font-body text-sm text-static-grey leading-relaxed">{feat.desc}</p>
                <div className="mt-6 h-px bg-gradient-to-r from-pulse-blue/30 to-transparent group-hover:from-pulse-blue/60 transition-all duration-500" />
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Product teaser */}
      {products.length > 0 && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionReveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-3">// THE LINE-UP</p>
                  <h2 className="font-heading font-bold text-4xl md:text-6xl text-white">FEATURED</h2>
                </div>
                <Link to="/products" className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest text-white/40 hover:text-pulse-blue transition-colors nav-link">
                  VIEW ALL <ArrowRight size={12} />
                </Link>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product, i) => (
                <SectionReveal key={product.id} delay={i * 0.15}>
                  <Link to={`/product/${product.id}`} className="product-card block relative bg-white/[0.02] border border-white/5 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-pulse-blue/40" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-pulse-blue/40" />

                    <div className="aspect-square bg-white/5 relative overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center voronoi-bg">
                          <div className="font-heading font-bold text-6xl text-white/5">NXT</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 to-transparent" />
                      {product.badge && (
                        <div className="absolute top-3 left-3 font-mono text-[9px] tracking-widest bg-pulse-blue text-void-black px-2 py-0.5">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-heading font-bold text-lg text-white mb-1">{product.name}</h3>
                      {product.tagline && <p className="font-mono text-xs text-static-grey mb-3 truncate">{product.tagline}</p>}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg text-white">£{product.price.toFixed(2)}</span>
                        <span className="font-mono text-xs text-pulse-blue tracking-widest group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
                          SHOP <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to="/products" className="font-mono text-xs tracking-widest text-pulse-blue">
                VIEW ALL PRODUCTS →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pulse-blue to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <SectionReveal>
            <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-6">// CLAIM YOUR EDGE</p>
            <h2 className="font-heading font-bold text-5xl md:text-8xl text-white leading-none mb-8">
              WE GOT<br />
              <span className="text-pulse-blue glow-blue-text">NEXT.</span>
            </h2>
            <Link
              to="/products"
              className="btn-neon inline-flex items-center gap-3 bg-transparent border border-pulse-blue text-pulse-blue font-mono font-bold text-sm tracking-widest px-12 py-4 hover:bg-pulse-blue hover:text-void-black transition-all duration-400"
            >
              GET YOURS NOW <ArrowRight size={16} />
            </Link>
          </SectionReveal>
        </div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pulse-blue to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
      </section>
    </div>
  );
}
