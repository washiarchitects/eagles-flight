

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrendingUp, Home, LineChart, Star } from "lucide-react";
import ToggleSwitch from "./components/crypto/ToggleSwitch";
import CurrencyDropdown from "./components/crypto/CurrencyDropdown";

const navigationTabs = [
  { title: "Home", path: "Home", icon: Home },
  { title: "Chart", path: "Chart", icon: LineChart },
  { title: "Watchlist", path: "Watchlist", icon: Star }
];

const currencies = [
  { label: "AUD", value: "aud", symbol: "A$" },
  { label: "USD", value: "usd", symbol: "$" },
  { label: "EUR", value: "eur", symbol: "€" },
  { label: "GBP", value: "gbp", symbol: "£" },
  { label: "JPY", value: "jpy", symbol: "¥" },
  { label: "CAD", value: "cad", symbol: "C$" },
  { label: "SGD", value: "sgd", symbol: "S$" },
  { label: "NZD", value: "nzd", symbol: "NZ$" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const [simpleMode, setSimpleMode] = useState(() => {
    try {
      const stored = localStorage.getItem('viewSwitch');
      return stored !== null ? JSON.parse(stored) : false;
    } catch { return false; }
  });

  const [currency, setCurrency] = useState(() => {
    try { return localStorage.getItem('currency') || 'aud'; }
    catch { return 'aud'; }
  });

  const [currencySymbol, setCurrencySymbol] = useState(() => {
    try { return localStorage.getItem('currencySymbol') || 'A$'; }
    catch { return 'A$'; }
  });
  
  useEffect(() => {
    localStorage.setItem('viewSwitch', JSON.stringify(simpleMode));
  }, [simpleMode]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
    localStorage.setItem('currencySymbol', currencySymbol);
  }, [currency, currencySymbol]);

  const handleCurrencyChange = ({ currency: newCurrency, symbol }) => {
    setCurrency(newCurrency);
    setCurrencySymbol(symbol);
    // Force reload to apply currency change everywhere
    window.location.reload();
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        simpleMode,
        currency,
        currencySymbol
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --background: #ffffff;
          --text: #111111;
          --outline: #222222;
          --hover-shadow: rgba(0, 0, 0, 0.15);
          --outline-width: 1.5px;
          --corner-radius: 12px;
          --padding: 12px;
          --spacing: 16px;
          --positive: #2ecc71;
          --negative: #e74c3c;
          --muted: #666666;
          --highlight: #d4af37;
          --watchlistOutline: #d4af37;
        }
        
        * {
          transition: all 0.2s ease;
        }
        
        .outline-style {
          border: var(--outline-width) solid var(--outline);
          border-radius: var(--corner-radius);
        }
        
        .hover-shadow:hover {
          box-shadow: 0 8px 32px var(--hover-shadow);
          transform: translateY(-1px);
        }
      `}</style>
      
      <header className="outline-style mx-3 mt-3 bg-white p-4 sticky top-3 z-20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 outline-style bg-white flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-medium text-gray-900 tracking-tight">
              Eagle's Flight
            </h1>
          </div>
          <nav className="flex items-center space-x-1 outline-style p-1 bg-gray-50/50">
            {navigationTabs.map((tab) => {
              const isActive = location.pathname === createPageUrl(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={createPageUrl(tab.path)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-white text-gray-900 outline-style shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{'--outline-width': '1px'}}
                >
                  <tab.icon className="w-4 h-4" strokeWidth={1.5} />
                  <span className="font-medium text-sm">{tab.title}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <div className="w-full md:w-44">
              <CurrencyDropdown currency={currency} onCurrencyChange={handleCurrencyChange} currencies={currencies} />
            </div>
             <div className="w-full md:w-44">
              <ToggleSwitch isEnabled={simpleMode} onToggle={setSimpleMode} label="Simple Mode" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-3 mt-4 mb-6">
        {childrenWithProps}
      </main>
    </div>
  );
}

