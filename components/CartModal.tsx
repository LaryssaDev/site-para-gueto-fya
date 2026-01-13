import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, X, AlertTriangle } from 'lucide-react';

const CartModal = () => {
  const { 
    isCartOpen,
    closeCart,
    openCheckout,
    cart, 
    updateQuantity, 
    updateItemSize,
    removeFromCart, 
    cartTotalItems, 
    cartSubtotal, 
    cartDiscountPercent, 
    cartDiscountAmount, 
    cartFinalTotal 
  } = useStore();

  const allSizesSelected = useMemo(() => {
    return cart.every(item => item.selectedSize && item.selectedSize !== '');
  }, [cart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-lg bg-zinc-900 h-full shadow-2xl animate-slide-in-right flex flex-col border-l border-zinc-800">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
            <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                <ShoppingBag className="text-brand-accent" /> Carrinho ({cartTotalItems})
            </h2>
            <button onClick={closeCart} className="text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p>Seu carrinho está vazio.</p>
                    <button onClick={closeCart} className="mt-4 text-brand-accent hover:underline font-bold">Voltar para a loja</button>
                </div>
            ) : (
                cart.map((item) => (
                    <div key={item.cartItemId} className={`bg-zinc-800/50 rounded-lg p-3 border ${!item.selectedSize ? 'border-red-500/50' : 'border-zinc-800'} transition-colors`}>
                        <div className="flex gap-3 mb-3">
                            <div className="w-20 h-20 bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-white font-bold text-sm line-clamp-2">{item.name}</h4>
                                    <button onClick={() => removeFromCart(item.cartItemId)} className="text-zinc-600 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center bg-zinc-900 rounded border border-zinc-700">
                                        <button onClick={() => updateQuantity(item.cartItemId, -1)} disabled={item.quantity <= 1} className="p-1 px-2 text-zinc-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                                        <span className="px-2 text-white text-xs font-mono">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 px-2 text-zinc-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                                    </div>
                                    <p className="text-brand-accent font-bold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Size Selection inside Cart */}
                        <div className="pt-2 border-t border-zinc-700/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold uppercase ${!item.selectedSize ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`}>
                                    {!item.selectedSize ? 'Selecione o Tamanho:' : 'Tamanho Selecionado:'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {item.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => updateItemSize(item.cartItemId, size)}
                                        className={`text-xs font-bold px-2 py-1 rounded border transition-colors ${
                                            item.selectedSize === size
                                            ? 'bg-brand-accent text-black border-brand-accent'
                                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
            <div className="p-6 bg-zinc-950 border-t border-zinc-800">
                {!allSizesSelected && (
                    <div className="mb-4 bg-red-900/20 border border-red-900/50 rounded p-3 flex items-start gap-2 text-red-200 text-xs">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <p>Por favor, selecione o tamanho de todos os itens antes de finalizar.</p>
                    </div>
                )}
                
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cartSubtotal)}</span>
                    </div>
                    {cartDiscountPercent > 0 && (
                        <div className="flex justify-between text-green-500 font-bold">
                            <span>Desconto ({(cartDiscountPercent * 100).toFixed(0)}%)</span>
                            <span>- {formatCurrency(cartDiscountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-white font-black text-lg pt-2 border-t border-zinc-800">
                        <span>Total</span>
                        <span className="text-brand-accent">{formatCurrency(cartFinalTotal)}</span>
                    </div>
                </div>
                <button 
                    onClick={openCheckout}
                    disabled={!allSizesSelected}
                    className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg transition-all ${
                        allSizesSelected 
                        ? 'bg-brand-accent hover:bg-yellow-400 text-black active:scale-95' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                >
                    Finalizar Pedido <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;