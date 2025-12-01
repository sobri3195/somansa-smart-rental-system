import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('somansa-favorites');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('somansa-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (propertyId) => {
    setFavorites(prev => {
      if (!prev.includes(propertyId)) {
        return [...prev, propertyId];
      }
      return prev;
    });
  };

  const removeFavorite = (propertyId) => {
    setFavorites(prev => prev.filter(id => id !== propertyId));
  };

  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
