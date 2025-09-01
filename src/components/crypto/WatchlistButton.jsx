import React from "react";
import { Star } from "lucide-react";

export default function WatchlistButton({ crypto, isInWatchlist, onToggle }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    onToggle(crypto);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
      style={{ 
        color: isInWatchlist ? 'var(--highlight)' : 'var(--muted)'
      }}
    >
      <Star 
        className="w-4 h-4" 
        strokeWidth={1.5}
        fill={isInWatchlist ? 'currentColor' : 'none'}
      />
    </button>
  );
}