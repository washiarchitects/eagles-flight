import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CurrencyDropdown({ currency, onCurrencyChange, currencies }) {
  const handleChange = (value) => {
    const selectedCurrency = currencies.find(c => c.value === value);
    if (selectedCurrency) {
      onCurrencyChange({
        currency: value,
        symbol: selectedCurrency.symbol
      });
    }
  };

  return (
    <div className="outline-style bg-white p-2.5 flex items-center justify-between h-full">
      <span className="font-medium text-gray-900 text-sm">Currency</span>
      <Select value={currency} onValueChange={handleChange}>
        <SelectTrigger className="w-24 border-none bg-transparent focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.value} value={curr.value}>
              {curr.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}