import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar({ searchTerm, onSearchChange, placeholder = "Search coins..." }) {
  return (
    <div className="relative outline-style bg-white hover-shadow">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-11 pr-4 py-3 border-none focus:ring-0 text-gray-900 placeholder-gray-500 bg-transparent"
      />
    </div>
  );
}