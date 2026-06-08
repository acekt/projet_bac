"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { syncCartAction, fetchUserCartAction } from '@/actions/ecommerce';

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
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  deliveryFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const isInitialMount = useRef(true);
  const isSyncingFromServer = useRef(false);

  // Load cart from server if logged in, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        isSyncingFromServer.current = true;
        const res = await fetchUserCartAction(user.id);
        if (res.success && res.cart && res.cart.length > 0) {
          setCart(res.cart as CartItem[]);
          localStorage.setItem('mcf_cart', JSON.stringify(res.cart));
        } else {
           // If server cart is empty but local is not, we should probably sync local to server
           const savedCart = localStorage.getItem('mcf_cart');
           if (savedCart) {
              const parsed = JSON.parse(savedCart);
              setCart(parsed);
              if (parsed.length > 0) {
                 await syncCartAction(user.id, parsed);
              }
           }
        }
        setTimeout(() => { isSyncingFromServer.current = false; }, 100);
      } else {
        const savedCart = localStorage.getItem('mcf_cart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error("Failed to load cart", e);
          }
        }
      }
    };

    loadCart();
  }, [user]);

  // Sync to server and localStorage when cart changes
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    if (isSyncingFromServer.current) {
        return;
    }

    localStorage.setItem('mcf_cart', JSON.stringify(cart));

    if (user) {
        // Debounce or directly sync
        syncCartAction(user.id, cart).catch(e => console.error("Failed to sync cart", e));
    }
  }, [cart, user]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    // Handling store conflict before state update to avoid window.confirm in state updater
    const isDifferentStore = cart.length > 0 && product.storeId && cart[0].storeId !== product.storeId;

    if (isDifferentStore) {
      const shouldEmpty = window.confirm("Votre panier contient déjà des articles d'un autre magasin. Voulez-vous vider votre panier pour ajouter cet article ?");
      if (!shouldEmpty) return;

      setCart([{ ...product, quantity: 1 }]);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
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
  const deliveryFee = cart.length > 0 ? 2000 : 0;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      deliveryFee
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
