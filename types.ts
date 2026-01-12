export type Category = 'Camisetas' | 'Bonés' | 'Moletons' | 'Bermudas' | 'Calças' | 'Toucas' | 'Cuecas' | 'Bags';

export type OrderStatus = 'pending' | 'approved' | 'rejected';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number; // Final value after discount
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  date: string;
  status: OrderStatus;
}

export interface SalesData {
  name: string;
  sales: number;
  revenue: number;
}

export const CATEGORIES: Category[] = [
  'Camisetas', 'Bonés', 'Moletons', 'Bermudas', 'Calças', 'Toucas', 'Cuecas', 'Bags'
];