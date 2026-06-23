import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Wireframe 3D shin pad rendered on canvas — rotates continuously,
// tilts toward cursor on hover, snaps back when cursor leaves.
export default function ShinpadHologram({ size = 340 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const rotYRef = useRef(0);
  const rotXRef = useRef(0.3);
  const targetRotYRef = useRef(0);
  const targetRotXRef = useRef(0.3);
  const isHoveredRef = useRef(false);
  const autoRotSpeedRef = useRef(0.008);
  const [hovered, setHovered] = useState(false);

  // Build shin pad geometry — a rounded rectangular shell
  function buildGeometry() {
    const verts = [];
    const lines = [];

    // Main pad shape: front face (curved top)
    const w = 0.35, h = 0.55, d = 0.12;
    const rows = 8, cols = 5;

    // Front face — gently curved outward
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        const v = r / rows;
        const x = (u - 0.5) * w * 2;
        const y = (v - 0.5) * h * 2;
        // curve the front face
        const curve = d * (1 - Math.abs(x / w) * 0.5) * (1 - Math.pow(y / (h), 2) * 0.3);
        verts.push([x, y, curve]);
      }
    }
    // Edge lines grid
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        lines.push([r * (cols + 1) + c, r * (cols + 1) + c + 1]);
      }
    }
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r < rows; r++) {
        lines.push([r * (cols + 1) + c, (r + 1) * (cols + 1) + c]);
      }
    }

    const baseOffset = verts.length;
    // Back face — flat
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        const v = r / rows;
        const x = (u - 0.5) * w * 2;
        const y = (v - 0.5) * h * 2;
        verts.push([x, y, -d * 0.3]);
      }
    }
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c < cols; c++) {
        lines.push([baseOffset + r * (cols + 1) + c, baseOffset + r * (cols + 1) + c + 1]);
      }
    }
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r < rows; r++) {
        lines.push([baseOffset + r * (cols + 1) + c, baseOffset + (r + 1) * (cols + 1) + c]);
      }
    }

    // Connect front to back at edges
    const edgeCs = [0, cols];
    const edgeRs = [0, rows];
    for (const c of edgeCs) {
      for (let r = 0; r <= rows; r++) {
        lines.push([r * (cols + 1) + c, baseOffset + r * (cols + 1) + c]);
      }
    }
    for (const r of edgeRs) {
      for (let c = 0; c <= cols; c++) {
        lines.push([r * (cols + 1) + c, baseOffset + r * (cols + 1) + c]);
      }
    }

    // Ankle ridge detail lines
    const ridgeY = Math.floor(rows * 0.75);
    for (let c = 0; c <= cols; c++) {
      lines.push([ridgeY * (cols + 1) + c, ridgeY * (cols + 1) + c]); // noop — just marker
    }

    return { verts, lines };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { verts, lines } = buildGeometry();
    const S = size;
    canvas.width = S;
    canvas.height = S;
    const scale = S * 0.72;

    function project(v, rx, ry) {
      let [x, y, z] = v;
      // Rotate Y
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      // Rotate X
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      // Perspective
      const fov = 2.2;
      const pz = z2 + fov;
      return [x1 / pz * scale + S / 2, -y2 / pz * scale + S / 2, z2];
    }

    function draw() {
      ctx.clearRect(0, 0, S, S);

      const rx = rotXRef.current;
      const ry = rotYRef.current;
      const projected = verts.map(v => project(v, rx, ry));

      // Draw lines with depth-based opacity
      for (const [a, b] of lines) {
        if (a === b) continue;
        const pa = projected[a];
        const pb = projected[b];
        const avgZ = (pa[2] + pb[2]) / 2;
        const opacity = Math.max(0.05, Math.min(0.9, (avgZ + 1.2) / 2.4));

        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.strokeStyle = `rgba(0, 209, 255, ${opacity * 0.85})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw vertex dots
      for (const p of projected) {
        const opacity = Math.max(0.05, Math.min(1, (p[2] + 1.2) / 2.4));
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 209, 255, ${opacity * 0.6})`;
        ctx.fill();
      }

      // Glow center
      const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.45);
      grad.addColorStop(0, 'rgba(0,209,255,0.04)');
      grad.addColorStop(1, 'rgba(0,209,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);
    }

    function tick() {
      if (!isHoveredRef.current) {
        // Auto rotate
        targetRotYRef.current += autoRotSpeedRef.current;
      }
      // Smooth lerp toward target
      rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.06;
      rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.06;
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetRotYRef.current = dx * 1.2;
    targetRotXRef.current = 0.3 - dy * 0.6;
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setHovered(false);
    targetRotXRef.current = 0.3;
    // keep targetRotY at current so it resumes from where it was
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-pulse-blue/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-pulse-blue/20"
        style={{ inset: '8%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glow base */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,209,255,0.07) 0%, transparent 65%)',
          filter: hovered ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s',
        }}
      />

      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: 'crosshair',
          filter: hovered
            ? 'drop-shadow(0 0 18px rgba(0,209,255,0.7)) drop-shadow(0 0 40px rgba(0,209,255,0.3))'
            : 'drop-shadow(0 0 8px rgba(0,209,255,0.4))',
          transition: 'filter 0.4s ease',
        }}
      />

      {/* Corner HUD brackets */}
      {[['top-2 left-2', 'border-t border-l'], ['top-2 right-2', 'border-t border-r'],
        ['bottom-2 left-2', 'border-b border-l'], ['bottom-2 right-2', 'border-b border-r']].map(([pos, border], i) => (
        <div key={i} className={`absolute w-5 h-5 border-pulse-blue/50 ${pos} ${border}`} />
      ))}

      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-pulse-blue/50">
        {hovered ? 'INTERACTIVE' : 'NXT SHIN PAD'}
      </div>
    </div>
  );
}
