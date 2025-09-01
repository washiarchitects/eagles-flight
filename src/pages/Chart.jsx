import React, { useState, useEffect } from "react";
import PriceChart from "../components/crypto/PriceChart";
import { getWatchlist } from "../components/utils/watchlist";
import { Star } from "lucide-react";

export default function Chart({ currency, currencySymbol }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  if (watchlist.length === 0) {
    return (
      <div className="space-y-4">
        <div className="outline-style bg-white p-4 text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Price Charts</h1>
        </div>
        <div className="outline-style bg-white p-8 text-center">
          <Star className="mx-auto w-12 h-12 text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="text-gray-600 font-medium mb-1">Your watchlist is empty.</p>
          <p className="text-gray-500 text-sm">Add coins to your watchlist to see their charts here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="outline-style bg-white p-4 text-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Watchlist Charts</h1>
        <p className="text-sm text-gray-600">Live charts for your favorite cryptocurrencies</p>
      </div>
      <div className="space-y-4">
        {watchlist.map(crypto => (
          <PriceChart 
            key={crypto.id}
            selectedCrypto={crypto} 
            currency={currency}
            currencySymbol={currencySymbol}
          />
        ))}
      </div>
    </div>
  );
}