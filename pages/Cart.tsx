import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartTotalItems, 
    cartSubtotal, 
    cartDiscountPercent, 
    cartDiscountAmount, 
    cartFinalTotal 
  } = useStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-black px-4">
        <ShoppingBag className="w-24 h-24 text-zinc-800 mb-6" />
        <h2 className="text-3xl font-black text-white mb-4 uppercase">Seu carrinho está vazio</h2>
        <p className="text-zinc-400 mb-8 text-center max-w-md">Parece que você ainda não escolheu seu kit. Volte para a loja e confira as novidades.</p>
        <Link to="/" className="bg-brand-accent hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors uppercase tracking-widest">
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 uppercase flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-brand-accent" />
            Carrinho de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedSize}`} className="bg-zinc-900 rounded-lg p-4 flex gap-4 border border-zinc-800 shadow-md">
                <div className="w-24 h-24 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white font-bold uppercase text-sm md:text-base">{item.name}</h3>
                        <p className="text-zinc-500 text-xs">{item.category}</p>
                        <div className="mt-1 inline-block bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded border border-zinc-700">
                            Tamanho: {item.selectedSize}
                        </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center bg-zinc-950 rounded border border-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, -1)} 
                        className="p-1 px-2 text-zinc-400 hover:text-white"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-2 text-white font-mono">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                         className="p-1 px-2 text-zinc-400 hover:text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-brand-accent font-bold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 sticky top-24 shadow-xl">
              <h3 className="text-xl font-black text-white uppercase mb-6 border-b border-zinc-800 pb-2">Resumo do Pedido</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal ({cartTotalItems} itens)</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                
                <div className="flex justify-between text-zinc-400">
                    <span>Desconto Progressivo</span>
                     {cartDiscountPercent > 0 ? (
                        <span className="text-green-500 font-bold">{(cartDiscountPercent * 100).toFixed(0)}% OFF</span>
                     ) : (
                        <span className="text-zinc-600">0%</span>
                     )}
                </div>

                {cartDiscountPercent > 0 && (
                    <div className="flex justify-between text-green-500 font-bold">
                        <span>Valor Economizado</span>
                        <span>- {formatCurrency(cartDiscountAmount)}</span>
                    </div>
                )}
                
                <div className="border-t border-zinc-800 pt-3 flex justify-between text-white text-lg font-black">
                  <span>Total Final</span>
                  <span className="text-brand-accent">{formatCurrency(cartFinalTotal)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-brand-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg uppercase tracking-widest"
                >
                  Finalizar Pedido <ArrowRight className="h-5 w-5" />
                </button>
                <Link to="/" className="block text-center text-zinc-500 text-sm hover:text-white mt-4">
                    Continuar Comprando
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;