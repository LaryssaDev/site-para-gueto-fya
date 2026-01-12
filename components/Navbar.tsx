import React from 'react';
import { ShoppingCart, Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LOGO_URL } from '../constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { cartTotalItems } = useStore();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={LOGO_URL} alt="GUETO FYA" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-gray-300 hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors">Loja</Link>
              <Link to="/#categorias" className="text-gray-300 hover:text-brand-accent px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors">Categorias</Link>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
             <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
              <LogIn className="h-6 w-6" />
            </Link>

            <Link to="/cart" className="relative text-gray-400 hover:text-brand-accent transition-colors p-2">
              <ShoppingCart className="h-7 w-7" />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 bg-brand-accent rounded-full">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">LOJA</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">CARRINHO ({cartTotalItems})</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">ADMIN</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;