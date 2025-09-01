
import React from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import WatchlistButton from "./WatchlistButton";
import { isInWatchlist } from "../utils/watchlist";

const formatCurrency = (value, symbol = "$") => {
  if (value == null) return "N/A";
  if (value < 1) return `${symbol}${value.toFixed(6)}`;
  return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function CryptoList({ cryptos, isLoading, apiError, onCryptoSelect, onWatchlistToggle, currencySymbol = "$" }) {
  if (isLoading && cryptos.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="outline-style bg-white p-4">
            <div className="animate-pulse flex items-center justify-between">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="w-1/3 text-right space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
              </div>
              <div className="w-1/3 text-right space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-20 ml-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="outline-style bg-white p-8 text-center">
        <AlertTriangle className="mx-auto w-10 h-10 text-yellow-500 mb-4" strokeWidth={1.5} />
        <p className="text-gray-600 font-medium">{apiError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cryptos.map((crypto) => {
        const isWatchlisted = isInWatchlist(crypto.id);
        return (
          <div
            key={crypto.id}
            onClick={() => onCryptoSelect?.(crypto)}
            className="outline-style bg-white p-4 cursor-pointer hover-shadow"
            style={{ borderColor: isWatchlisted ? 'var(--watchlistOutline)' : 'var(--outline)' }}
          >
            <div className="grid grid-cols-4 md:grid-cols-5 items-center gap-4">
              <div className="flex items-center space-x-3 col-span-1">
                <div className="w-10 h-10 outline-style bg-gray-50 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {crypto.image ? <img src={crypto.image} alt={crypto.name} className="w-6 h-6" /> : <span className="text-xs font-medium text-gray-600">{crypto.symbol?.substring(0, 2).toUpperCase()}</span>}
                </div>
                <div className="truncate">
                  <h3 className="font-medium text-gray-900 truncate">{crypto.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{crypto.symbol?.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right col-span-1">
                <p className="font-medium text-gray-900">{formatCurrency(crypto.current_price, currencySymbol)}</p>
                <div className="flex items-center justify-end space-x-1 text-sm" style={{ color: crypto.price_change_percentage_24h >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                  {crypto.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" strokeWidth={1.5} /> : <TrendingDown className="w-3 h-3" strokeWidth={1.5} />}
                  <span>{Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%</span>
                </div>
              </div>
              <div className="hidden md:block text-right col-span-1">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Mkt Cap</p>
                <p className="font-medium text-gray-900">{formatCurrency(crypto.market_cap, currencySymbol)}</p>
              </div>
              <div className="text-right col-span-1">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Volume</p>
                <p className="font-medium text-gray-900">{formatCurrency(crypto.total_volume, currencySymbol)}</p>
              </div>
              <div className="flex justify-center col-span-1">
                <WatchlistButton crypto={crypto} isInWatchlist={isWatchlisted} onToggle={onWatchlistToggle} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
