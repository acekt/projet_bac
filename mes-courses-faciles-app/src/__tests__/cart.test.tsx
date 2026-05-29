import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CartContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 'p1', name: 'Test Product', price: 1000, image: '', category: 'Test', unit: 'unit', storeId: 's1' };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].name).toBe('Test Product');
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(1000);
  });

  it('should increment quantity when adding the same product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 'p1', name: 'Test Product', price: 1000, image: '', category: 'Test', unit: 'unit', storeId: 's1' };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(2000);
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 'p1', name: 'Test Product', price: 1000, image: '', category: 'Test', unit: 'unit', storeId: 's1' };

    act(() => {
      result.current.addToCart(product);
    });

    act(() => {
      result.current.updateQuantity('p1', 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(5000);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { id: 'p1', name: 'Test Product', price: 1000, image: '', category: 'Test', unit: 'unit', storeId: 's1' };

    act(() => {
      result.current.addToCart(product);
    });

    act(() => {
      result.current.removeFromCart('p1');
    });

    expect(result.current.cart.length).toBe(0);
  });
});
