
import React, { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle } from "lucide-react";

const timeRanges = [
  { label: "1H", days: 1/24 },
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "1Y", days: 365 }
];

export default function PriceChart({ selectedCrypto, currency = 'usd', currencySymbol = '$' }) {
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [livePrice, setLivePrice] = useState(selectedCrypto.current_price);

  const fetchChartData = useCallback(async (days) => {
    if (!selectedCrypto?.id) return;
    
    setIsLoading(true);
    setChartError(null);
    try {
      const API_URL = `https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart?vs_currency=${currency}&days=${days}`;
      const response = await fetch(API_URL); // Changed: Fetch directly from CoinGecko API
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const formattedData = data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
      }));
      setChartData(formattedData);
      if (formattedData.length > 0) {
        setLivePrice(formattedData[formattedData.length-1].price);
      }

    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartError("⚠️ Chart data unavailable.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCrypto, currency]);

  useEffect(() => {
    fetchChartData(selectedRange);
    const interval = setInterval(() => fetchChartData(selectedRange), 60000);
    return () => clearInterval(interval);
  }, [selectedCrypto, selectedRange, fetchChartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="outline-style bg-white p-3 shadow-lg">
          <p className="text-sm text-gray-600">{new Date(payload[0].payload.timestamp).toLocaleString()}</p>
          <p className="font-medium text-gray-900">
            {currencySymbol}{payload[0].value?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="outline-style bg-white hover-shadow">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 outline-style bg-gray-50 rounded-full flex items-center justify-center overflow-hidden">
              <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">{selectedCrypto.name}</h2>
              <p className="text-sm text-gray-500">
                {currencySymbol}{livePrice?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: livePrice >= 1 ? 2 : 6
                })}
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setSelectedRange(range.days)}
                className={`px-3 py-1 text-xs font-medium transition-all duration-200 rounded-md ${
                  selectedRange === range.days
                    ? "outline-style bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={{'--outline-width': '1px'}}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 pt-2">
        <div className="h-60">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Loading chart...</div>
            </div>
          ) : chartError ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" strokeWidth={1.5} />
              <p className="text-gray-600 text-sm font-medium">{chartError}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="timestamp" 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['dataMin', 'dataMax']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `${currencySymbol}${(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#111111" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#111111", strokeWidth: 2, fill: "#ffffff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
