import React from "react";

export default function ToggleSwitch({ isEnabled, onToggle, label }) {
  return (
    <div className="outline-style bg-white p-2.5 flex items-center justify-between h-full">
      <span className="font-medium text-gray-900 text-sm">{label}</span>
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          isEnabled ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}