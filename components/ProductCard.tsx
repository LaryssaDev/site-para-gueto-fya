import React from 'react';
import { Product } from '../types';
import { Eye } from 'lucide-react';
import { formatCurrency } from '../utils';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal } = useStore();

  return (
    <div 
        onClick={() => openProductModal(product)}
        className="group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-brand-accent transition-all duration-300 shadow-lg flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <span className="bg-brand-accent text-black font-bold px-6 py-2 rounded-full flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Espiar
                </span>
            </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-1 block">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-brand-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-white">
            {formatCurrency(product.price)}
          </span>
          {product.sizes && product.sizes.length > 0 && (
             <div className="flex gap-1">
                {product.sizes.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] bg-zinc-800 text-zinc-400 px-1 rounded border border-zinc-700">{s}</span>
                ))}
                {product.sizes.length > 3 && <span className="text-[10px] text-zinc-500">+</span>}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;