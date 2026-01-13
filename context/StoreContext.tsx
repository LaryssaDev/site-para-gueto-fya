import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { Product, CartItem, Order, OrderStatus, CustomerInfo } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { calculateDiscount } from '../utils';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  selectedProduct: Product | null; // For Modal
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;
  placeOrder: (customer: CustomerInfo) => string; // Returns Order ID
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cartTotalItems: number;
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartFinalTotal: number;
  cartDiscountPercent: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: PropsWithChildren<{}>) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gueto_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gueto_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gueto_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('gueto_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gueto_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gueto_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Calculations
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartDiscountPercent = calculateDiscount(cartTotalItems);
  const cartDiscountAmount = cartSubtotal * cartDiscountPercent;
  const cartFinalTotal = cartSubtotal - cartDiscountAmount;

  const openProductModal = (product: Product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  const addToCart = (product: Product, size: string, quantity: number) => {
    setCart(prev => {
      // Find item with same ID AND Size
      const existing = prev.find(p => p.id === product.id && p.selectedSize === size);
      if (existing) {
        return prev.map(p => 
          (p.id === product.id && p.selectedSize === size) 
          ? { ...p, quantity: p.quantity + quantity } 
          : p
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(p => !(p.id === productId && p.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId && item.selectedSize === size) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  // Product Actions
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  // Order Actions
  const placeOrder = (customer: CustomerInfo): string => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customer,
      items: [...cart],
      totalAmount: cartFinalTotal,
      subtotal: cartSubtotal,
      discountAmount: cartDiscountAmount,
      discountPercent: cartDiscountPercent,
      date: new Date().toISOString(),
      status: 'pending' // ALWAYS PENDING
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      selectedProduct,
      openProductModal,
      closeProductModal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addProduct,
      removeProduct,
      updateProduct,
      placeOrder,
      updateOrderStatus,
      cartTotalItems,
      cartSubtotal,
      cartDiscountAmount,
      cartFinalTotal,
      cartDiscountPercent
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};