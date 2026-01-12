import React from 'react';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {!isAdmin && (
        <footer className="bg-zinc-950 border-t border-zinc-900 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">GUETO <span className="text-brand-accent">FYA</span></h2>
                        <p className="text-zinc-500 text-sm mt-2">Streetwear original. Da rua pra rua.</p>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <a href="https://wa.me/5511987458758" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-500 transition-colors">
                            WhatsApp: (11) 98745-8758
                        </a>
                        <a href="https://instagram.com/gueto.fya" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-pink-500 transition-colors">
                            @gueto.fya
                        </a>
                    </div>
                </div>
                <div className="mt-8 border-t border-zinc-900 pt-8 text-center text-zinc-600 text-xs">
                    &copy; {new Date().getFullYear()} GUETO FYA. Todos os direitos reservados.
                </div>
            </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;