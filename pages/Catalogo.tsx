import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';

const Catalogo = () => {
  const { products, openProductModal } = useStore();

  return (
    <div className="min-h-screen bg-brand-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter text-center">Catálogo Visual</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
                <div 
                    key={product.id} 
                    onClick={() => openProductModal(product)}
                    className="block group relative cursor-pointer"
                >
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900">
                        <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <p className="text-white font-bold">{product.name}</p>
                            <p className="text-brand-accent">{formatCurrency(product.price)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;