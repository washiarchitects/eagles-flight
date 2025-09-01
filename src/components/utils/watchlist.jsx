// Utility functions for managing watchlist in localStorage
export const getWatchlist = () => {
  try {
    const watchlist = localStorage.getItem('crypto-watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

export const addToWatchlist = (crypto) => {
  try {
    const watchlist = getWatchlist();
    const exists = watchlist.find(item => item.id === crypto.id);
    if (!exists) {
      const newWatchlist = [...watchlist, crypto];
      localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    }
    return watchlist;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return getWatchlist();
  }
};

export const removeFromWatchlist = (cryptoId) => {
  try {
    const watchlist = getWatchlist();
    const newWatchlist = watchlist.filter(item => item.id !== cryptoId);
    localStorage.setItem('crypto-watchlist', JSON.stringify(newWatchlist));
    return newWatchlist;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return getWatchlist();
  }
};

export const isInWatchlist = (cryptoId) => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === cryptoId);
};