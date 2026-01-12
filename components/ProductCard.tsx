import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus } from 'lucide-react';
import { formatCurrency } from '../utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-brand-accent transition-all duration-300 shadow-lg flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-1 block">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-white mb-2 leading-tight">
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
          <button 
            onClick={() => addToCart(product)}
            className="bg-zinc-100 hover:bg-brand-accent text-black p-3 rounded-full transition-colors duration-200 flex items-center justify-center shadow-lg"
            aria-label="Adicionar ao carrinho"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;