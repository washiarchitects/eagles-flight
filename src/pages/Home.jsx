
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/crypto/SearchBar";
import CryptoList from "../components/crypto/CryptoList";
import CryptoGrid from "../components/crypto/CryptoGrid";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { addToWatchlist, removeFromWatchlist, isInWatchlist, getWatchlist } from "../components/utils/watchlist";

export default function Home({ simpleMode, currency, currencySymbol }) {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [watchlistUpdated, setWatchlistUpdated] = useState(0);
  const navigate = useNavigate();

  const sortDataByWatchlist = useCallback((data) => {
    const watchlist = getWatchlist();
    const watchlistIds = watchlist.map(item => item.id);
    return [...data].sort((a, b) => {
      const aInWatchlist = watchlistIds.includes(a.id);
      const bInWatchlist = watchlistIds.includes(b.id);
      if (aInWatchlist && !bInWatchlist) return -1;
      if (!aInWatchlist && bInWatchlist) return 1;
      return 0;
    });
  }, []);

  const fetchCryptoData = useCallback(async () => {
    if (!currency) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setApiError("⚠️ Unable to fetch crypto data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  useEffect(() => {
    let processedData = sortDataByWatchlist(cryptos);
    if (searchTerm) {
      processedData = processedData.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCryptos(processedData);
  }, [searchTerm, cryptos, sortDataByWatchlist, watchlistUpdated]);
  
  const handleCryptoSelect = (crypto) => {
    sessionStorage.setItem('selectedCrypto', JSON.stringify(crypto));
    navigate(createPageUrl('Chart'));
  };

  const handleWatchlistToggle = (crypto) => {
    if (isInWatchlist(crypto.id)) {
      removeFromWatchlist(crypto.id);
    } else {
      addToWatchlist(crypto);
    }
    setWatchlistUpdated(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div className="mt-[-1rem]">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search coins..." />
      </div>

      {simpleMode ? (
        <CryptoGrid 
          cryptos={filteredCryptos} 
          isLoading={isLoading} 
          apiError={apiError} 
          onCryptoSelect={handleCryptoSelect} 
          onWatchlistToggle={handleWatchlistToggle}
          currencySymbol={currencySymbol}
        />
      ) : (
        <CryptoList 
          cryptos={filteredCryptos} 
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
