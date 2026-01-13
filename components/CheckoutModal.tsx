import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateWhatsAppMessage, formatCurrency } from '../utils';
import { MessageCircle, ArrowLeft, ShieldCheck, X } from 'lucide-react';

const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    openCart,
    cart, 
    cartFinalTotal, 
    cartDiscountPercent, 
    cartDiscountAmount, 
    placeOrder 
  } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create Order
    const orderId = placeOrder(formData);

    // 2. Generate WhatsApp Link
    const message = generateWhatsAppMessage(
        orderId,
        formData,
        cart,
        cartDiscountPercent,
        cartDiscountAmount,
        cartFinalTotal
    );

    const phoneNumber = "11977809124";
    const link = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
    
    // 3. Redirect
    window.open(link, '_blank');
    
    // 4. Close Modals
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={closeCheckout}
      />

      {/* Modal Content */}
      <div className="relative bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md shadow-2xl animate-fade-in overflow-hidden">
        
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
            <button onClick={openCart} className="text-zinc-400 hover:text-white flex items-center gap-1 text-sm font-bold uppercase">
                <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button onClick={closeCheckout} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-8">
            <h1 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-2 justify-center">
                <ShieldCheck className="text-brand-accent" />
                Finalizar Pedido
            </h1>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800 mb-6 text-center">
                <span className="text-zinc-400 text-sm">Total a pagar</span>
                <div className="text-brand-accent font-black text-3xl">{formatCurrency(cartFinalTotal)}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nome Completo</label>
                    <input 
                        required
                        type="text" 
                        className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-brand-accent outline-none focus:ring-1 focus:ring-brand-accent"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: João da Silva"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">WhatsApp / Telefone</label>
                    <input 
                        required
                        type="tel" 
                        className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-brand-accent outline-none focus:ring-1 focus:ring-brand-accent"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">E-mail</label>
                    <input 
                        required
                        type="email" 
                        className="w-full bg-zinc-950 border border-zinc-700 text-white rounded p-3 focus:border-brand-accent outline-none focus:ring-1 focus:ring-brand-accent"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="seu@email.com"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-6 transition-all shadow-lg hover:shadow-green-500/20 active:scale-[0.98]"
                >
                    <MessageCircle className="w-5 h-5" />
                    Enviar Pedido via WhatsApp
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;