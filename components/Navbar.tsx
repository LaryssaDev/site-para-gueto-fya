import React from 'react';
import { ShoppingCart, Menu, X, LogIn, Grid, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LOGO_URL } from '../constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { cartTotalItems } = useStore();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Use a dark grey that is NOT black, with a bottom border for separation
  return (
    <nav className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-700 shadow-xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={LOGO_URL} alt="GUETO FYA" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-zinc-300 hover:text-brand-accent px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Loja
              </Link>
              <Link to="/catalogo" className="text-zinc-300 hover:text-brand-accent px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <Grid className="w-4 h-4" /> Catálogo
              </Link>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
             <Link to="/admin" className="text-zinc-400 hover:text-white transition-colors" title="Área Admin">
              <LogIn className="h-6 w-6" />
            </Link>

            <Link to="/cart" className="relative text-brand-accent hover:text-yellow-300 transition-colors p-2">
              <ShoppingCart className="h-7 w-7" />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 bg-white rounded-full">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-brand-accent hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-bold uppercase flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" /> Loja
            </Link>
            <Link to="/catalogo" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-brand-accent hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-bold uppercase flex items-center gap-3">
                <Grid className="w-5 h-5" /> Catálogo
            </Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-zinc-300 hover:text-brand-accent hover:bg-zinc-800 block px-3 py-4 rounded-md text-base font-bold uppercase flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" /> Carrinho ({cartTotalItems})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;