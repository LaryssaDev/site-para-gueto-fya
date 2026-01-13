import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  return (
    <a 
      href="https://api.whatsapp.com/send/?phone=11977809124&text&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 border-2 border-green-600"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden md:inline">Fale com um vendedor</span>
    </a>
  );
};

export default WhatsAppFloat;