"use client";

import { useState, useEffect } from 'react';

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  storeId: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mcf_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      try {
        localStorage.setItem('mcf_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoaded,
  };
}
