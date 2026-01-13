import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-brand-accent transition-all duration-300 shadow-lg flex flex-col h-full">
      {/* Image Carousel Area */}
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-500"
        />
        
        {/* Navigation Arrows */}
        {product.images.length > 1 && (
            <>
                <button 
                    onClick={prevImage} 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-accent hover:text-black text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={nextImage} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-accent hover:text-black text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.images.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentImageIndex ? 'bg-brand-accent' : 'bg-white/50'}`} 
                        />
                    ))}
                </div>
            </>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-1 block">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-white mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex justify-between items-center">
             <span className="text-xl font-bold text-white">
                {formatCurrency(product.price)}
             </span>
             {product.stock <= 0 && <span className="text-xs text-red-500 font-bold uppercase">Esgotado</span>}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-3 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                product.stock > 0
                ? 'bg-brand-accent hover:bg-yellow-400 text-black'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;