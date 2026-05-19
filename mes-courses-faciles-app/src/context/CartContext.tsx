"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  category: string;
  storeId?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity' | 'id'> & { name: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('mcf_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mcf_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Omit<CartItem, 'quantity' | 'id'> & { name: string }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.name); // Using name as ID for mock products
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, {
        id: product.name,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        unit: product.unit || 'unité',
        category: product.category || 'Général'
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
