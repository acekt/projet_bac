import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

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

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should start as unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const user = { id: '1', email: 'test@example.com', name: 'Test User', role: 'CLIENT' };

    act(() => {
      result.current.login(user);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(user);
  });

  it('should logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const user = { id: '1', email: 'test@example.com', name: 'Test User', role: 'CLIENT' };

    act(() => {
      result.current.login(user);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
