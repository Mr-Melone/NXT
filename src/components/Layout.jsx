import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import { CartProvider } from '@/lib/CartContext';

export default function Layout() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-void-black">
        {/* Scanlines overlay */}
        <div className="scanlines pointer-events-none" />
        <Navbar />
        <CartDrawer />
        <main>
          <Outlet />
        </main>
        <footer className="border-t border-white/5 py-10 mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center leading-none">
                <span className="font-heading font-bold text-xl text-white">N</span>
                <span className="font-heading font-bold text-xl text-white">X</span>
                <span className="font-heading font-bold text-xl text-white">T</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <span className="font-mono text-xs tracking-widest text-static-grey">WE GOT NEXT</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-xs text-white/20">3D PRINTED SHIN PADS</span>
              <div className="w-1 h-1 rounded-full bg-pulse-blue" />
              <span className="font-mono text-xs text-white/20">© 2026 NXT</span>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
