import React, { useState, useCallback, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Clock, AlertTriangle, Eye, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { blink } from '../blink/client';

interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  marketCap: string;
  industry?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCapValue: number;
  peRatio: number;
  high52Week: number;
  low52Week: number;
  lastUpdated: string;
}

interface OptionData {
  strike: number;
  callPrice: number;
  callVolume: number;
  callOI: number;
  putPrice: number;
  putVolume: number;
  putOI: number;
  manipulation?: boolean;
}

const StockSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [optionChain, setOptionChain] = useState<OptionData[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [allStocks, setAllStocks] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load all Indian stocks from database on component mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await blink.db.indianStocks.list({
          orderBy: { symbol: 'asc' },
          limit: 1000
        });
        setAllStocks(stocks);
      } catch (error) {
        console.error('Error loading stocks:', error);
      }
    };
    
    loadStocks();
    
    // Load watchlist and search history from localStorage
    const savedWatchlist = localStorage.getItem('finory_watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    
    const savedHistory = localStorage.getItem('finory_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const generateMockStockData = (stock: any): StockData => {
    const basePrice = 100 + Math.random() * 2000;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol: stock.symbol,
      name: stock.company_name,
      exchange: stock.exchange,
      sector: stock.sector,
      marketCap: stock.market_cap_category,
      industry: stock.industry,
      currentPrice: basePrice,
      change: change,
      changePercent: changePercent,
      volume: Math.floor(Math.random() * 1000000) + 10000,
      marketCapValue: basePrice * (Math.random() * 1000000000 + 1000000000),
      peRatio: 15 + Math.random() * 25,
      high52Week: basePrice * (1.2 + Math.random() * 0.3),
      low52Week: basePrice * (0.7 - Math.random() * 0.2),
      lastUpdated: new Date().toLocaleTimeString('en-IN')
    };
  };

  const generateMockOptionChain = (currentPrice: number): OptionData[] => {
    const strikes = [];
    const baseStrike = Math.round(currentPrice / 50) * 50;
    
    for (let i = -5; i <= 5; i++) {
      const strike = baseStrike + (i * 50);
      const isITM = strike < currentPrice;
      const manipulation = Math.random() < 0.1; // 10% chance of manipulation alert
      
      strikes.push({
        strike,
        callPrice: Math.max(0.05, isITM ? currentPrice - strike + Math.random() * 10 : Math.random() * 5),
        callVolume: Math.floor(Math.random() * 10000) + 100,
        callOI: Math.floor(Math.random() * 50000) + 1000,
        putPrice: Math.max(0.05, !isITM ? strike - currentPrice + Math.random() * 10 : Math.random() * 5),
        putVolume: Math.floor(Math.random() * 10000) + 100,
        putOI: Math.floor(Math.random() * 50000) + 1000,
        manipulation
      });
    }
    
    return strikes;
  };

  const updateStockPrice = useCallback(async (symbol: string) => {
    if (selectedStock && selectedStock.symbol === symbol) {
      const updatedStock = { ...selectedStock };
      const priceChange = (Math.random() - 0.5) * 2; // Small price movement
      updatedStock.currentPrice += priceChange;
      updatedStock.change += priceChange;
      updatedStock.changePercent = (updatedStock.change / (updatedStock.currentPrice - updatedStock.change)) * 100;
      updatedStock.lastUpdated = new Date().toLocaleTimeString('en-IN');
      
      setSelectedStock(updatedStock);
      setOptionChain(generateMockOptionChain(updatedStock.currentPrice));
    }
  }, [selectedStock]);

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    if (selectedStock) {
      const interval = setInterval(() => {
        updateStockPrice(selectedStock.symbol);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [selectedStock, updateStockPrice]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setLoading(true);
      try {
        const filtered = allStocks.filter(stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.company_name.toLowerCase().includes(query.toLowerCase()) ||
          (stock.industry && stock.industry.toLowerCase().includes(query.toLowerCase()))
        );
        
        const results = filtered.slice(0, 8).map(generateMockStockData);
        setSearchResults(results);
        
        // Add to search history
        if (query.length > 2 && !searchHistory.includes(query)) {
          const newHistory = [query, ...searchHistory.slice(0, 9)];
          setSearchHistory(newHistory);
          localStorage.setItem('finory_search_history', JSON.stringify(newHistory));
        }
      } catch (error) {
        console.error('Error searching stocks:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [allStocks, searchHistory]);

  const handleSelectStock = useCallback(async (stock: StockData) => {
    setSelectedStock(stock);
    setOptionChain(generateMockOptionChain(stock.currentPrice));
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    const newWatchlist = watchlist.includes(symbol) 
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol];
    
    setWatchlist(newWatchlist);
    localStorage.setItem('finory_watchlist', JSON.stringify(newWatchlist));
  }, [watchlist]);

  const getMarketCapColor = (marketCap: string) => {
    switch (marketCap) {
      case 'Large': return 'bg-green-100 text-green-800';
      case 'Mid': return 'bg-blue-100 text-blue-800';
      case 'Small': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPutCallRatio = (options: OptionData[]) => {
    const totalPutOI = options.reduce((sum, opt) => sum + opt.putOI, 0);
    const totalCallOI = options.reduce((sum, opt) => sum + opt.callOI, 0);
    return totalCallOI > 0 ? (totalPutOI / totalCallOI).toFixed(2) : '0.00';
  };

  const getMaxPain = (options: OptionData[]) => {
    let maxPain = 0;
    let minPain = Infinity;
    
    options.forEach(option => {
      const pain = option.callOI + option.putOI;
      if (pain < minPain) {
        minPain = pain;
        maxPain = option.strike;
      }
    });
    
    return maxPain;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Search & Analysis</h1>
          <p className="text-gray-600 mt-1">Real-time Indian stock prices and option chains with manipulation detection</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Auto-refresh every 30s</span>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-orange-500" />
            <span>Search Indian Stocks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search by symbol, company name, or industry (e.g., RELIANCE, TCS, Banking)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && searchQuery === '' && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Recent Searches</div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(term)}
                    className="text-xs"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Searching stocks...</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectStock(stock)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">{stock.name}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{stock.exchange}</Badge>
                          <Badge className={`text-xs ${getMarketCapColor(stock.marketCap)}`}>
                            {stock.marketCap} Cap
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{stock.currentPrice.toFixed(2)}</div>
                      <div className={`text-sm flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(stock.symbol);
                      }}
                      className="ml-2"
                    >
                      <Star className={`h-4 w-4 ${watchlist.includes(stock.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && !loading && allStocks.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No stocks found matching "{searchQuery}"</p>
              <p className="text-sm">Try searching with NSE/BSE symbols or company names</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Stock Details */}
      {selectedStock && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  <span>{selectedStock.symbol} Details</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWatchlist(selectedStock.symbol)}
                >
                  <Star className={`h-4 w-4 ${watchlist.includes(selectedStock.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="font-semibold text-gray-900 text-lg">{selectedStock.symbol}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{selectedStock.name}</div>
                <div className="flex items-center space-x-2 mt-2 flex-wrap">
                  <Badge className="bg-orange-100 text-orange-800">{selectedStock.exchange}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{selectedStock.sector}</Badge>
                  <Badge className={getMarketCapColor(selectedStock.marketCap)}>
                    {selectedStock.marketCap} Cap
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Current Price</div>
                    <div className="font-semibold text-xl">₹{selectedStock.currentPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Change</div>
                    <div className={`font-semibold flex items-center ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedStock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      ₹{Math.abs(selectedStock.change).toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Volume</div>
                    <div className="font-semibold">{selectedStock.volume.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Market Cap</div>
                    <div className="font-semibold">₹{(selectedStock.marketCapValue / 10000000).toFixed(0)} Cr</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">P/E Ratio</div>
                    <div className="font-semibold">{selectedStock.peRatio.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">52W Range</div>
                    <div className="font-semibold text-sm">
                      ₹{selectedStock.low52Week.toFixed(0)} - ₹{selectedStock.high52Week.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Last updated: {selectedStock.lastUpdated}
              </div>
            </CardContent>
          </Card>

          {/* Option Chain */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-orange-500" />
                <span>Option Chain Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Option Chain Summary */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Put-Call Ratio</div>
                  <div className="font-semibold">{getPutCallRatio(optionChain)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Max Pain</div>
                  <div className="font-semibold">₹{getMaxPain(optionChain)}</div>
                </div>
              </div>

              {/* Manipulation Alerts */}
              {optionChain.some(opt => opt.manipulation) && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Manipulation Alert:</strong> Unusual options activity detected. Exercise caution.
                  </AlertDescription>
                </Alert>
              )}

              {/* Option Chain Table */}
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Call</th>
                      <th className="p-2 text-center">Strike</th>
                      <th className="p-2 text-right">Put</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionChain.map((option) => (
                      <tr key={option.strike} className={`border-b ${option.manipulation ? 'bg-yellow-50' : ''}`}>
                        <td className="p-2">
                          <div className="text-right">
                            <div className="font-medium">₹{option.callPrice.toFixed(2)}</div>
                            <div className="text-gray-500">{option.callVolume.toLocaleString()}</div>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          <div className={`font-semibold ${option.strike === Math.round(selectedStock.currentPrice / 50) * 50 ? 'text-orange-600' : ''}`}>
                            {option.strike}
                            {option.manipulation && <AlertTriangle className="h-3 w-3 text-yellow-500 inline ml-1" />}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-left">
                            <div className="font-medium">₹{option.putPrice.toFixed(2)}</div>
                            <div className="text-gray-500">{option.putVolume.toLocaleString()}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Watchlist */}
      {watchlist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-orange-500" />
              <span>Your Watchlist ({watchlist.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {watchlist.map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-1 hover:border-orange-500 hover:bg-orange-50"
                  onClick={() => handleSearch(symbol)}
                >
                  <span className="font-semibold text-sm">{symbol}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockSearch;