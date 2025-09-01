
import React, { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import { getWatchlist, removeFromWatchlist } from "../components/utils/watchlist";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CryptoList from "../components/crypto/CryptoList";
import CryptoGrid from "../components/crypto/CryptoGrid";

export default function Watchlist({ simpleMode, currency, currencySymbol }) {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const loadAndFetchWatchlist = useCallback(async () => {
    const items = getWatchlist();
    if (items.length === 0) {
      setWatchlistItems([]);
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    try {
      const ids = items.map(item => item.id).join(',');
      const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&sparkline=false`;
      const response = await fetch(API_URL); // Changed from proxy to direct fetch
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // The API returns data in whatever order it wants, so we need to sort it back
      const dataMap = new Map(data.map(item => [item.id, item]));
      const sortedData = items.map(localItem => dataMap.get(localItem.id)).filter(Boolean);

      setWatchlistItems(sortedData);
      
    } catch (error) {
      console.error("Error fetching updated prices:", error);
      setApiError("⚠️ Unable to fetch updated prices.");
    } finally {
      setIsLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    loadAndFetchWatchlist();
  }, [loadAndFetchWatchlist]);

  const handleWatchlistToggle = (crypto) => {
    removeFromWatchlist(crypto.id);
    loadAndFetchWatchlist(); // Reload and re-fetch after removing
  };

  const handleCryptoSelect = (crypto) => {
    sessionStorage.setItem('selectedCrypto', JSON.stringify(crypto));
    navigate(createPageUrl('Chart'));
  };

  if (watchlistItems.length === 0 && !isLoading) {
    return (
      <div className="space-y-4">
        <div className="outline-style bg-white p-4 text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">My Watchlist</h1>
          <p className="text-sm text-gray-600">Track your favorite cryptocurrencies</p>
        </div>
        <div className="outline-style bg-white p-8 text-center">
          <Star className="mx-auto w-12 h-12 text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-gray-600 font-medium mb-4">⭐ Your watchlist is empty. Add coins to track them here!</p>
          <button onClick={() => navigate(createPageUrl('Home'))} className="outline-style bg-gray-50 px-6 py-2 text-gray-700 hover-shadow font-medium text-sm">
            Browse Cryptocurrencies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="outline-style bg-white p-4 text-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">My Watchlist</h1>
        <p className="text-sm text-gray-600">{watchlistItems.length} cryptocurrency{watchlistItems.length !== 1 ? 'ies' : 'y'} tracked</p>
      </div>
      {simpleMode ? (
        <CryptoGrid 
          cryptos={watchlistItems} 
          isLoading={isLoading} 
          apiError={apiError} 
          onCryptoSelect={handleCryptoSelect} 
          onWatchlistToggle={handleWatchlistToggle}
          currencySymbol={currencySymbol}
        />
      ) : (
        <CryptoList 
          cryptos={watchlistItems} 
          isLoading={isLoading} 
          apiError={apiError} 
          onCryptoSelect={handleCryptoSelect} 
          onWatchlistToggle={handleWatchlistToggle}
          currencySymbol={currencySymbol}
        />
      )}
    </div>
  );
}
