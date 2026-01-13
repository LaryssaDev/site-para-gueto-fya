import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { generateWhatsAppMessage, formatCurrency } from '../utils';
import { MessageCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartFinalTotal, cartDiscountPercent, cartDiscountAmount, placeOrder } = useStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create Order
    const orderId = placeOrder(formData);

    // 2. Generate WhatsApp Link
    const message = generateWhatsAppMessage(
        orderId,
        formData,
        cart, // Note: Store clears cart on placeOrder, ensure logic handles this (in utils we pass the cart info explicitly)
              // Actually context logic might need adjustment or we trust the passed vars. 
              // Since `placeOrder` clears cart in context state update, `cart` here is still valid for this render cycle.
        cartDiscountPercent,
        cartDiscountAmount,
        cartFinalTotal
    );

    const phoneNumber = "11977809124";
    const link = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`;
    
    // 3. Redirect
    window.location.href = link;
  };

  return (
    <div className="min-h-screen bg-brand-black py-10 px-4">
      <div className="max-w-md mx-auto bg-zinc-900 rounded-xl border border-zinc-800 p-8 shadow-2xl">
        <button onClick={() => navigate('/cart')} className="flex items-center text-zinc-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Carrinho
        </button>

        <h1 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-2">
            <ShieldCheck className="text-brand-accent" />
            Finalizar Pedido
        </h1>

        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-6">
            <div className="flex justify-between text-zinc-400 mb-2">
                <span>Total a pagar:</span>
                <span className="text-white font-bold text-xl">{formatCurrency(cartFinalTotal)}</span>
            </div>
            <p className="text-xs text-zinc-500">Preencha seus dados para gerar a nota do pedido.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nome Completo</label>
                <input 
                    required
                    type="text" 
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-3 focus:border-brand-accent outline-none"
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
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-3 focus:border-brand-accent outline-none"
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
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded p-3 focus:border-brand-accent outline-none"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                />
            </div>

            <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-6 transition-all hover:scale-[1.02]"
            >
                <MessageCircle className="w-5 h-5" />
                Enviar Pedido via WhatsApp
            </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;