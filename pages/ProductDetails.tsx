import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { ShoppingCart, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [product, setProduct] = useState(products.find(p => p.id === id));
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setProduct(products.find(p => p.id === id));
  }, [id, products]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-white">Produto não encontrado.</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    addToCart(product!, selectedSize, quantity);
    // Visual feedback could be added here
    navigate('/cart');
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev === product!.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? product!.images.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-brand-black pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white mb-6 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Voltar
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Gallery Section */}
        <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img 
                    src={product.images[currentImageIndex]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
                
                {product.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {product.images.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-brand-accent' : 'bg-white/50'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${idx === currentImageIndex ? 'border-brand-accent' : 'border-transparent'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col">
            <span className="text-brand-accent font-bold uppercase tracking-widest mb-2">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-white mb-6">{formatCurrency(product.price)}</p>
            
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-8">
                <p className="text-zinc-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
                <h3 className="text-white font-bold uppercase mb-3 text-sm">Selecione o Tamanho</h3>
                <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[50px] h-12 px-4 rounded-md font-bold transition-all border ${
                                selectedSize === size 
                                ? 'bg-brand-accent text-black border-brand-accent transform scale-105' 
                                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
                <h3 className="text-white font-bold uppercase mb-3 text-sm">Quantidade</h3>
                <div className="inline-flex items-center bg-zinc-900 rounded-lg border border-zinc-800">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-zinc-400 hover:text-white"><Minus /></button>
                    <span className="px-4 text-white font-mono text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-zinc-400 hover:text-white"><Plus /></button>
                </div>
            </div>

            {/* Action */}
            <button 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 rounded-full font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    selectedSize 
                    ? 'bg-brand-accent hover:bg-yellow-400 text-black shadow-lg hover:shadow-brand-accent/20' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
            >
                <ShoppingCart className="w-6 h-6" />
                {selectedSize ? 'Adicionar ao Carrinho' : 'Selecione um Tamanho'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;