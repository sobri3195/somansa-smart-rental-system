import { useState, useEffect } from 'react';

export function useCompare() {
  const [compareList, setCompareList] = useState(() => {
    const stored = localStorage.getItem('somansa-compare');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('somansa-compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (propertyId) => {
    setCompareList(prev => {
      if (prev.length >= 3) {
        alert('You can only compare up to 3 properties');
        return prev;
      }
      if (!prev.includes(propertyId)) {
        return [...prev, propertyId];
      }
      return prev;
    });
  };

  const removeFromCompare = (propertyId) => {
    setCompareList(prev => prev.filter(id => id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (propertyId) => {
    return compareList.includes(propertyId);
  };

  return {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    count: compareList.length
  };
}
