import React from "react";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import WatchlistButton from "./WatchlistButton";
import { isInWatchlist } from "../utils/watchlist";

const formatPrice = (price, symbol = "$") => {
  if (price == null) return "N/A";
  return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price > 1 ? 2 : 6 })}`;
};

export default function CryptoGrid({ cryptos, isLoading, apiError, onCryptoSelect, onWatchlistToggle, currencySymbol = "$" }) {
  if (isLoading && cryptos.length === 0) {
    return (
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="outline-style bg-white p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
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
    <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
      {cryptos.map((crypto) => {
        const isWatchlisted = isInWatchlist(crypto.id);
        return (
          <div
            key={crypto.id}
            onClick={() => onCryptoSelect?.(crypto)}
            className="outline-style bg-white p-4 cursor-pointer hover-shadow text-center relative"
            style={{ borderColor: isWatchlisted ? 'var(--highlight)' : 'var(--outline)' }}
          >
            <div className="absolute top-1 right-1">
              <WatchlistButton crypto={crypto} isInWatchlist={isWatchlisted} onToggle={onWatchlistToggle} />
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto outline-style bg-gray-50 rounded-full flex items-center justify-center overflow-hidden mb-2">
                <img src={crypto.image} alt={crypto.name} className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900 truncate">{crypto.symbol.toUpperCase()}</h3>
              <div className="text-lg font-medium text-gray-900">{formatPrice(crypto.current_price, currencySymbol)}</div>
              <div className="flex items-center justify-center space-x-1 text-sm font-medium" style={{ color: crypto.price_change_percentage_24h >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                {crypto.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={2} />}
                <span>{Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}