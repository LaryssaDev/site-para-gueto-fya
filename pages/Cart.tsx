import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, generateWhatsAppMessage } from '../utils';
import { Trash2, Minus, Plus, MessageCircle, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    placeOrder,
    cartTotalItems, 
    cartSubtotal, 
    cartDiscountPercent, 
    cartDiscountAmount, 
    cartFinalTotal 
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');

  const handleWhatsAppCheckout = () => {
    if (!customerName.trim()) {
      setError('Por favor, informe seu nome para identificarmos o pedido.');
      return;
    }

    // 1. Create Pending Order in System
    const orderId = placeOrder(customerName);

    // 2. Generate Message with correct Data
    const phoneNumber = "11977809124"; 
    const message = generateWhatsAppMessage(
      orderId,
      customerName,
      cart, // Note: cart is cleared in Store, but we pass the current items before clear happens? 
            // Ideally placeOrder clears it. We need to capture state before. 
            // Actually, placeOrder clears it, so we need to use a local ref or pass the cart *before* calling placeOrder? 
            // In the implementation below, we use the `cart` from render scope which holds the items *before* the state update rerender.
      cartDiscountPercent, 
      cartDiscountAmount, 
      cartFinalTotal
    );

    // 3. Redirect
    const link = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
    window.location.href = link;
  };

  // We need to capture the current cart items because placeOrder will clear them from context
  const currentCartItems = [...cart];

  const safeHandleCheckout = () => {
     if (!customerName.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }

    // Capture values before clearing state
    const orderId = placeOrder(customerName);
    
    // Generate link
    const phoneNumber = "11977809124"; 
    const message = generateWhatsAppMessage(
      orderId,
      customerName,
      currentCartItems, 
      cartDiscountPercent, 
      cartDiscountAmount, 
      cartFinalTotal
    );

    const link = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
    window.location.href = link;
  }

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
            {cart.map(item => (
              <div key={item.id} className="bg-zinc-900 rounded-lg p-4 flex gap-4 border border-zinc-800 shadow-md">
                <div className="w-24 h-24 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white font-bold uppercase text-sm md:text-base">{item.name}</h3>
                        <p className="text-zinc-500 text-xs">{item.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center bg-zinc-950 rounded border border-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="p-1 px-2 text-zinc-400 hover:text-white"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-2 text-white font-mono">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, 1)}
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

              {/* Identification Input */}
              <div className="mb-6">
                <label htmlFor="name" className="block text-xs uppercase text-zinc-500 font-bold mb-2">Seu Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    id="name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setError('');
                    }}
                    placeholder="Digite seu nome..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-accent outline-none focus:ring-1 focus:ring-brand-accent transition-all"
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={safeHandleCheckout}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Finalizar via WhatsApp
                </button>
              </div>

              <p className="mt-4 text-xs text-center text-zinc-500 leading-relaxed">
                Ao finalizar, você será redirecionado para o WhatsApp com a nota do pedido. Aguarde a confirmação de disponibilidade pelo atendente.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;