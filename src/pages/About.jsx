import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Shield, Cpu, Target, Users, Globe } from 'lucide-react';
import SectionReveal from '@/components/SectionReveal';
import NXTLogo from '@/components/NXTLogo';

const STATS = [
  { value: '0.1mm', label: 'Layer Resolution' },
  { value: '3D', label: 'Printed to Order' },
  { value: '2', label: 'Sizes Available' },
  { value: '100%', label: 'Custom Built' },
];

const VALUES = [
  { icon: Cpu, title: 'PRECISION OVER MASS', desc: 'Every pad is printed to order. No warehouses, no waste. Your pair is built the moment you order it, dialled to spec.' },
  { icon: Shield, title: 'ENGINEERED PROTECTION', desc: 'Mini shin pads designed with geometric lattice structures that disperse impact force — not just absorb it.' },
  { icon: Target, title: 'BUILT FOR THE NEXT GEN', desc: 'Street, cage, futsal, 5-a-side. NXT was made for players who play everywhere, all the time.' },
  { icon: Globe, title: 'MATERIAL INNOVATION', desc: 'From standard PLA to carbon fibre reinforced filament — we push the limits of what\'s possible in desktop manufacturing.' },
];

export default function About() {
  return (
    <div className="bg-void-black min-h-screen pt-20">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden grid-bg">
        {/* Animated horizontal lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-pulse-blue/5"
            style={{ top: `${(i + 1) * 12}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: i * 0.1, ease: 'easeOut' }}
          />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center">
          <motion.p
            className="font-mono text-xs tracking-[0.4em] text-pulse-blue mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            // WHO WE ARE
          </motion.p>
          <motion.h1
            className="font-heading font-black text-6xl md:text-9xl text-white leading-none mb-6"
            style={{ fontWeight: 900 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            WE GOT<br />
            <span className="text-pulse-blue glow-blue-text">NEXT.</span>
          </motion.h1>
          <motion.p
            className="font-body text-base md:text-lg text-static-grey max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            NXT is a new-generation shin pad brand, designing and 3D printing mini shin pads for players who refuse to be ordinary.
            Built from the ground up with engineering precision and a relentless focus on performance.
          </motion.p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-void-black to-transparent" />
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <SectionReveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-heading font-black text-4xl md:text-5xl text-pulse-blue glow-blue-text mb-2" style={{ fontWeight: 900 }}>
                    {s.value}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-static-grey">{s.label}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <SectionReveal direction="right">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-4">// THE ORIGIN</p>
              <h2 className="font-heading font-black text-5xl md:text-7xl text-white leading-none mb-8" style={{ fontWeight: 900 }}>
                BORN ON<br />THE PITCH
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <div className="space-y-5 text-white/70 font-body text-sm leading-relaxed">
              <p>
                NXT started with a simple problem: mini shin pads were either cheap, flimsy plastic — or non-existent. Street footballers, futsal players, and cage ballers needed something built for how they actually play.
              </p>
              <p>
                We took a 3D printer, a CAD program, and a lot of iteration. The result is a range of shin pads engineered with the same precision thinking you'd expect from aerospace-grade manufacturing — just pocket-sized and built for the beautiful game.
              </p>
              <p>
                Every NXT pad is printed to order. That means no compromises, no off-the-shelf moulding, and no two orders that aren't built specifically for you.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Values grid */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="mb-16 text-center">
              <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-4">// WHAT DRIVES US</p>
              <h2 className="font-heading font-black text-5xl md:text-7xl text-white" style={{ fontWeight: 900 }}>OUR VALUES</h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {VALUES.map((v, i) => (
              <SectionReveal key={v.title} delay={i * 0.1}>
                <div className="bg-void-black p-8 group hover:bg-white/[0.02] transition-colors hud-corner">
                  <v.icon size={22} className="text-pulse-blue mb-5" strokeWidth={1.5} />
                  <h3 className="font-display font-bold text-lg tracking-widest text-white mb-3">{v.title}</h3>
                  <p className="font-body text-sm text-static-grey leading-relaxed">{v.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Material breakdown */}
      <section className="py-24 px-4 md:px-8 max-w-5xl mx-auto">
        <SectionReveal>
          <p className="font-mono text-xs tracking-[0.3em] text-pulse-blue mb-4">// WHAT WE PRINT WITH</p>
          <h2 className="font-heading font-black text-4xl md:text-6xl text-white mb-12" style={{ fontWeight: 900 }}>THE MATERIALS</h2>
        </SectionReveal>

        <div className="space-y-px">
          {[
            { name: 'PLA', range: 'Core', desc: 'Standard polylactic acid. Rigid, accurate, accessible. The everyday workhorse of 3D printing — excellent for everyday protection without the premium tag.' },
            { name: 'PLA Carbon Fibre', range: 'Ghost', desc: 'Carbon fibre reinforced PLA filament. Dramatically increased rigidity and stiffness, reduced flex under impact, and a distinctive matte carbon finish. Reserved for our most premium tier.' },
          ].map((mat, i) => (
            <SectionReveal key={mat.name} delay={i * 0.15}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-white/5 group">
                <div className="md:w-48 shrink-0">
                  <span className="font-mono text-xs tracking-widest text-pulse-blue">{mat.range}</span>
                  <h3 className="font-heading font-bold text-xl text-white">{mat.name}</h3>
                </div>
                <p className="font-body text-sm text-static-grey leading-relaxed">{mat.desc}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <SectionReveal>
            <NXTLogo size="lg" className="mb-8 mx-auto" />
            <p className="font-body text-base text-static-grey mb-8">Ready to upgrade your game?</p>
            <Link
              to="/products"
              className="btn-neon inline-flex items-center gap-3 bg-pulse-blue text-void-black font-mono font-bold text-sm tracking-widest px-10 py-4 hover:shadow-[0_0_40px_rgba(0,209,255,0.5)] transition-all duration-300"
            >
              SHOP THE LINE-UP <ArrowRight size={16} />
            </Link>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
