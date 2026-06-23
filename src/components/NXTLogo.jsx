import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Persistent glitch state — always slightly glitched, big burst every 3s
function useGlitchCycle() {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const run = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 400);
    };
    run(); // immediate first burst
    const id = setInterval(run, 3000);
    return () => clearInterval(id);
  }, []);

  return glitching;
}

export default function NXTLogo({ size = 'md', animate = false, className = '' }) {
  const sizes = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-8xl',
    xl: 'text-[13vw] md:text-[11vw]',
    hero: 'text-[22vw] md:text-[16vw] lg:text-[13vw]',
  };

  const letters = ['N', 'X', 'T'];
  const glitching = useGlitchCycle();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 40, skewX: 15 },
    visible: {
      opacity: 1, y: 0, skewX: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center leading-none select-none ${className}`}
      variants={containerVariants}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
    >
      {letters.map((letter, i) => (
        <motion.div
          key={letter}
          className={`nxt-letter font-heading font-black ${sizes[size]} text-white`}
          style={{ fontWeight: 900, letterSpacing: '-0.04em' }}
          variants={letterVariants}
          whileHover={{
            textShadow: '0 0 30px #00D1FF, 0 0 60px #00D1FF, 0 0 100px #00D1FF',
            transition: { duration: 0.1 }
          }}
        >
          <span className="relative inline-block">
            {letter}
            {/* Always-on subtle ghost — low opacity baseline */}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                color: '#FF0055',
                transform: glitching ? `translate(${4 + Math.random() * 4}px, ${-2}px)` : 'translate(2px, 0px)',
                opacity: glitching ? 0.75 : 0.25,
                transition: glitching ? 'none' : 'all 0.3s ease',
                clipPath: glitching
                  ? `polygon(0 ${10 + i * 15}%, 100% ${10 + i * 15}%, 100% ${35 + i * 10}%, 0 ${35 + i * 10}%)`
                  : 'none',
              }}
            >{letter}</span>
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                color: '#00D1FF',
                transform: glitching ? `translate(${-4 - Math.random() * 3}px, ${1}px)` : 'translate(-2px, 0px)',
                opacity: glitching ? 0.65 : 0.2,
                transition: glitching ? 'none' : 'all 0.3s ease',
                clipPath: glitching
                  ? `polygon(0 ${50 + i * 10}%, 100% ${50 + i * 10}%, 100% ${75 + i * 5}%, 0 ${75 + i * 5}%)`
                  : 'none',
              }}
            >{letter}</span>
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
