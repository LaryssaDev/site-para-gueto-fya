import React from 'react';
import { ShoppingCart, Menu, X, LogIn, Grid, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LOGO_URL } from '../constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { cartTotalItems, setCurrentView, openCart } = useStore();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNav = (view: 'home' | 'catalogo' | 'admin') => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 shadow-xl" style={{ backgroundColor: '#F2B705' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex-shrink-0 focus:outline-none">
            <img src={LOGO_URL} alt="GUETO FYA" className="h-16 w-auto object-contain" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => handleNav('home')} className="text-black hover:text-white px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black" /> Loja
              </button>
              <button onClick={() => handleNav('catalogo')} className="text-black hover:text-white px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <Grid className="w-5 h-5 text-black" /> Catálogo
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
             <button onClick={() => handleNav('admin')} className="text-black hover:text-white transition-colors" title="Área Admin">
              <LogIn className="h-6 w-6" />
            </button>

            <button onClick={openCart} className="relative text-black hover:text-white transition-colors p-2">
              <ShoppingCart className="h-7 w-7" />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {cartTotalItems}
                </span>
              )}
            </button>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-black/10 animate-fade-in" style={{ backgroundColor: '#F2B705' }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => handleNav('home')} className="w-full text-left text-black hover:text-white block px-3 py-4 rounded-md text-base font-bold uppercase flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" /> Loja
            </button>
            <button onClick={() => handleNav('catalogo')} className="w-full text-left text-black hover:text-white block px-3 py-4 rounded-md text-base font-bold uppercase flex items-center gap-3">
                <Grid className="w-5 h-5" /> Catálogo
            </button>
            <button onClick={() => { openCart(); setIsMenuOpen(false); }} className="w-full text-left text-black hover:text-white block px-3 py-4 rounded-md text-base font-bold uppercase flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" /> Carrinho ({cartTotalItems})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;