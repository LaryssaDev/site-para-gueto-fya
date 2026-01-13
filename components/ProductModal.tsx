import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { ShoppingCart, Minus, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ProductModal = () => {
  const { selectedProduct, closeProductModal, addToCart } = useStore();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    addToCart(selectedProduct, selectedSize, quantity);
    closeProductModal();
    alert('Produto adicionado ao carrinho!');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={closeProductModal}
      />

      {/* Modal Content */}
      <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-fade-in">
        
        {/* Close Button */}
        <button 
            onClick={closeProductModal}
            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
        >
            <X className="w-6 h-6" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-black p-4 flex items-center justify-center relative min-h-[300px] md:min-h-full">
             <div className="relative w-full h-full max-h-[500px] flex items-center justify-center">
                <img 
                    src={selectedProduct.images[currentImageIndex]} 
                    alt={selectedProduct.name} 
                    className="max-w-full max-h-full object-contain"
                />
             </div>
             
             {selectedProduct.images.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-800/80 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-800/80 text-white p-2 rounded-full hover:bg-brand-accent hover:text-black">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedProduct.images.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-brand-accent' : 'bg-zinc-600'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
            <span className="text-brand-accent font-bold uppercase tracking-widest mb-2 text-sm">{selectedProduct.category}</span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">{selectedProduct.name}</h2>
            <p className="text-2xl font-bold text-white mb-6 bg-zinc-800 inline-block px-4 py-2 rounded-lg self-start">
                {formatCurrency(selectedProduct.price)}
            </p>

            <div className="flex-grow">
                 <p className="text-zinc-400 leading-relaxed mb-8 border-l-4 border-brand-accent pl-4">
                    {selectedProduct.description}
                </p>

                {/* Sizes */}
                <div className="mb-6">
                    <h3 className="text-white font-bold uppercase mb-3 text-xs tracking-wider">Tamanho</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`min-w-[48px] h-10 px-3 rounded font-bold transition-all border-2 ${
                                    selectedSize === size 
                                    ? 'bg-brand-accent text-black border-brand-accent' 
                                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                    <h3 className="text-white font-bold uppercase mb-3 text-xs tracking-wider">Quantidade</h3>
                    <div className="inline-flex items-center bg-zinc-950 rounded border border-zinc-800">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-zinc-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                        <span className="px-4 text-white font-mono">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-zinc-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <button 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    selectedSize 
                    ? 'bg-brand-accent hover:bg-yellow-400 text-black shadow-lg hover:shadow-brand-accent/20' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
            >
                <ShoppingCart className="w-5 h-5" />
                {selectedSize ? 'Adicionar' : 'Escolha o Tamanho'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;