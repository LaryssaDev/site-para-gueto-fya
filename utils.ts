import { CartItem, CustomerInfo } from './types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const calculateDiscount = (totalItems: number) => {
  if (totalItems >= 7) return 0.15; // 15%
  if (totalItems >= 4) return 0.10; // 10%
  if (totalItems >= 2) return 0.05; // 5%
  return 0;
};

export const generateWhatsAppMessage = (
  orderId: string,
  customer: CustomerInfo,
  items: CartItem[], 
  discountPercent: number, 
  totalSavings: number, 
  finalTotal: number
) => {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  let itemsList = items.map(item => 
    `- ${item.name} | Tam: ${item.selectedSize} | ${item.quantity}x | ${formatCurrency(item.price)}`
  ).join('\n');

  const message = `
Olá! Gostaria de finalizar meu pedido na *GUETO FYA* 🔥

👤 *Nome:* ${customer.name}
📞 *Telefone:* ${customer.phone}
📧 *Email:* ${customer.email}

🛍️ *Itens:*
${itemsList}

📦 *Total de peças:* ${totalItems}
💸 *Desconto:* ${(discountPercent * 100).toFixed(0)}%
💰 *Valor final:* ${formatCurrency(finalTotal)}

🆔 ID: ${orderId}
🕒 *Status do pedido:* PENDENTE
Aguardo confirmação. Obrigado!
`.trim();

  return encodeURIComponent(message);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};