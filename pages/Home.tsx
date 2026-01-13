import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { DISCOUNT_BANNER_URL, HERO_IMAGE_URL } from '../constants';
import { CATEGORIES, Category } from '../types';

const Home = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-black pb-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Specific Hero Image as requested */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        ></div>
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase drop-shadow-2xl">
            Gueto <span className="text-brand-accent">FYA</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 font-medium tracking-wide max-w-2xl mx-auto drop-shadow-lg">
            A rua é nossa passarela. Autenticidade, exclusividade e estilo urbano de verdade.
          </p>
          <a href="#produtos" className="inline-block bg-brand-accent hover:bg-yellow-400 text-black font-black py-4 px-10 rounded-none transform skew-x-[-10deg] transition-transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <span className="block transform skew-x-[10deg] text-lg uppercase tracking-widest">
              Comprar Agora
            </span>
          </a>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="py-8 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                    <img src={DISCOUNT_BANNER_URL} alt="Tabela de Descontos" className="w-full h-auto rounded-lg shadow-lg border border-zinc-800" />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-black text-brand-accent mb-4 uppercase">Desconto Progressivo</h2>
                    <p className="text-gray-300 text-lg mb-4">
                        Quanto mais você leva, mais você economiza. Monte seu kit e garanta até <span className="text-white font-bold">15% OFF</span> no final da compra.
                    </p>
                    <ul className="space-y-2 text-zinc-400 font-medium">
                        <li className="flex items-center justify-center md:justify-start gap-2"><span className="w-2 h-2 bg-zinc-600 rounded-full"></span> 2 a 3 peças: <span className="text-brand-accent">5% OFF</span></li>
                        <li className="flex items-center justify-center md:justify-start gap-2"><span className="w-2 h-2 bg-zinc-600 rounded-full"></span> 4 a 6 peças: <span className="text-brand-accent">10% OFF</span></li>
                        <li className="flex items-center justify-center md:justify-start gap-2"><span className="w-2 h-2 bg-zinc-600 rounded-full"></span> 7+ peças: <span className="text-brand-accent">15% OFF</span></li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                Drop Atual <span className="w-12 h-1 bg-brand-accent block ml-2"></span>
            </h2>
            
            <div className="flex items-center bg-zinc-900 rounded-lg p-1 overflow-x-auto max-w-full no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('Todos')}
                    className={`px-4 py-2 rounded-md text-sm font-bold uppercase whitespace-nowrap transition-colors ${selectedCategory === 'Todos' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                    Todos
                </button>
                {CATEGORIES.map(cat => (
                     <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-md text-sm font-bold uppercase whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20">
                <p className="text-2xl text-zinc-500 font-bold">Nenhum produto encontrado nesta categoria.</p>
            </div>
        )}
      </section>

    </div>
  );
};

export default Home;