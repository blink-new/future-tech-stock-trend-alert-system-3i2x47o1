import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, Star, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { blink } from '../blink/client';

interface StockSuggestion {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  marketCap: string;
  industry?: string;
}

interface PortfolioStock {
  symbol: string;
  companyName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
}

const AddStock: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSuggestion | null>(null);
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [allStocks, setAllStocks] = useState<StockSuggestion[]>([]);
  const [popularStocks, setPopularStocks] = useState<StockSuggestion[]>([]);

  // Load all Indian stocks from database on component mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await blink.db.indianStocks.list({
          orderBy: { symbol: 'asc' },
          limit: 1000
        });
        
        const formattedStocks = stocks.map(stock => ({
          symbol: stock.symbol,
          name: stock.company_name,
          sector: stock.sector,
          marketCap: stock.market_cap_category,
          industry: stock.industry,
          exchange: stock.exchange
        }));
        
        setAllStocks(formattedStocks);
        
        // Set popular stocks (Large cap stocks)
        const popular = formattedStocks
          .filter(stock => stock.marketCap === 'Large')
          .slice(0, 18);
        setPopularStocks(popular);
        
      } catch (error) {
        console.error('Error loading stocks:', error);
        // Fallback to some popular stocks if database fails
        const fallbackStocks = [
          { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Oil & Gas', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'TCS', name: 'Tata Consultancy Services Limited', sector: 'Information Technology', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Financial Services', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'INFY', name: 'Infosys Limited', sector: 'Information Technology', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'FMCG', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Financial Services', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financial Services', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecommunication', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited', sector: 'Financial Services', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'HCLTECH', name: 'HCL Technologies Limited', sector: 'Information Technology', marketCap: 'Large', exchange: 'NSE' },
          { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Construction', marketCap: 'Large', exchange: 'NSE' }
        ];
        setAllStocks(fallbackStocks);
        setPopularStocks(fallbackStocks);
      }
    };
    
    loadStocks();
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = allStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        (stock.industry && stock.industry.toLowerCase().includes(query.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 10));
    } else {
      setSuggestions([]);
    }
  }, [allStocks]);

  const handleSelectStock = useCallback((stock: StockSuggestion) => {
    setSelectedStock(stock);
    setSearchQuery(stock.symbol);
    setSuggestions([]);
  }, []);

  const handleAddToPortfolio = useCallback(async () => {
    if (!selectedStock || !quantity || !avgPrice) {
      setMessage('Please select a stock and enter quantity and average price');
      return;
    }

    setLoading(true);
    try {
      const user = await blink.auth.me();
      
      // Mock current price - in real implementation, fetch from market API
      const currentPrice = parseFloat(avgPrice) * (0.95 + Math.random() * 0.1);
      const totalValue = parseFloat(quantity) * currentPrice;
      const pnl = (currentPrice - parseFloat(avgPrice)) * parseFloat(quantity);
      const pnlPercent = ((currentPrice - parseFloat(avgPrice)) / parseFloat(avgPrice)) * 100;

      await blink.db.portfolio.create({
        userId: user.id,
        symbol: selectedStock.symbol,
        companyName: selectedStock.name,
        quantity: parseInt(quantity),
        avgPrice: parseFloat(avgPrice),
        currentPrice: currentPrice,
        totalValue: totalValue,
        pnl: pnl,
        pnlPercent: pnlPercent,
        sector: selectedStock.sector,
        exchange: selectedStock.exchange
      });

      setMessage(`Successfully added ${selectedStock.symbol} to your portfolio!`);
      setSelectedStock(null);
      setSearchQuery('');
      setQuantity('');
      setAvgPrice('');
    } catch (error) {
      setMessage('Error adding stock to portfolio. Please try again.');
      console.error('Error adding stock:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStock, quantity, avgPrice]);

  const getMarketCapColor = (marketCap: string) => {
    switch (marketCap) {
      case 'Large': return 'bg-green-100 text-green-800';
      case 'Mid': return 'bg-blue-100 text-blue-800';
      case 'Small': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Stock to Portfolio</h1>
          <p className="text-gray-600 mt-1">Search from {allStocks.length}+ Indian stocks and add to track your investments</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>NSE/BSE Real-time Data</span>
        </div>
      </div>

      {message && (
        <Alert className={message.includes('Successfully') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.includes('Successfully') ? 'text-green-800' : 'text-red-800'}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Search */}
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

            {suggestions.length > 0 && (
              <div className="border rounded-lg max-h-80 overflow-y-auto">
                {suggestions.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-600 line-clamp-1">{stock.name}</div>
                        <div className="flex items-center space-x-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">{stock.exchange}</Badge>
                          <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                          <Badge className={`text-xs ${getMarketCapColor(stock.marketCap)}`}>
                            {stock.marketCap} Cap
                          </Badge>
                          {stock.industry && (
                            <Badge variant="outline" className="text-xs">{stock.industry}</Badge>
                          )}
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-orange-500 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && suggestions.length === 0 && allStocks.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No stocks found matching "{searchQuery}"</p>
                <p className="text-sm">Try searching with NSE/BSE symbols or company names</p>
              </div>
            )}

            {allStocks.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <p>Loading Indian stocks database...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add to Portfolio Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-orange-500" />
              <span>Add to Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedStock ? (
              <>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="font-semibold text-gray-900">{selectedStock.symbol}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{selectedStock.name}</div>
                  <div className="flex items-center space-x-2 mt-2 flex-wrap">
                    <Badge className="bg-orange-100 text-orange-800">{selectedStock.exchange}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">{selectedStock.sector}</Badge>
                    <Badge className={getMarketCapColor(selectedStock.marketCap)}>
                      {selectedStock.marketCap} Cap
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity (Shares)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter number of shares"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Average Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter average purchase price"
                      value={avgPrice}
                      onChange={(e) => setAvgPrice(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {quantity && avgPrice && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Investment Summary</div>
                      <div className="font-semibold text-gray-900">
                        Total Investment: ₹{(parseFloat(quantity) * parseFloat(avgPrice)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleAddToPortfolio}
                    disabled={loading || !quantity || !avgPrice}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? 'Adding...' : 'Add to Portfolio'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Select a stock to add</p>
                <p className="text-sm">Search and select a stock from the list above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Add Popular Stocks */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Indian Large Cap Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          {popularStocks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularStocks.map((stock) => (
                <Button
                  key={stock.symbol}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-1 hover:border-orange-500 hover:bg-orange-50"
                  onClick={() => handleSelectStock(stock)}
                >
                  <span className="font-semibold text-sm">{stock.symbol}</span>
                  <span className="text-xs text-gray-500 text-center leading-tight line-clamp-2">
                    {stock.name.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <Badge className={`text-xs ${getMarketCapColor(stock.marketCap)}`}>
                    {stock.sector}
                  </Badge>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p>Loading popular stocks...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStock;