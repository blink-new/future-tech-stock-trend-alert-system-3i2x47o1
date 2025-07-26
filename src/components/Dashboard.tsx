import React, { useState, useEffect } from 'react'
import { createClient } from '../blink/client'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  AlertTriangle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface StockRecommendation {
  symbol: string
  companyName: string
  currentPrice: number
  targetPrice: number
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reasoning: string
  marketCap: 'Large' | 'Mid' | 'Small'
  sector: string
  change: number
  changePercent: number
}

interface MarketOverview {
  nifty50: { value: number; change: number; changePercent: number }
  sensex: { value: number; change: number; changePercent: number }
  bankNifty: { value: number; change: number; changePercent: number }
}

interface PortfolioSummary {
  totalValue: number
  totalInvestment: number
  totalPnL: number
  totalPnLPercent: number
  topGainer: { symbol: string; change: number }
  topLoser: { symbol: string; change: number }
}

function Dashboard() {
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([])
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null)
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const generateMockData = () => {
    const mockRecommendations: StockRecommendation[] = [
      {
        symbol: 'RELIANCE',
        companyName: 'Reliance Industries Ltd',
        currentPrice: 2456.75,
        targetPrice: 2800.00,
        recommendation: 'BUY',
        confidence: 85,
        reasoning: 'Strong fundamentals, expanding digital business, and robust petrochemical segment',
        marketCap: 'Large',
        sector: 'Oil & Gas',
        change: 45.30,
        changePercent: 1.88
      },
      {
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services',
        currentPrice: 3542.20,
        targetPrice: 4000.00,
        recommendation: 'BUY',
        confidence: 78,
        reasoning: 'Leading IT services company with strong order book and digital transformation focus',
        marketCap: 'Large',
        sector: 'IT',
        change: -23.45,
        changePercent: -0.66
      },
      {
        symbol: 'HDFCBANK',
        companyName: 'HDFC Bank Ltd',
        currentPrice: 1678.90,
        targetPrice: 1850.00,
        recommendation: 'BUY',
        confidence: 82,
        reasoning: 'Strong deposit growth, improving asset quality, and digital banking initiatives',
        marketCap: 'Large',
        sector: 'Banking',
        change: 12.75,
        changePercent: 0.77
      },
      {
        symbol: 'ZOMATO',
        companyName: 'Zomato Ltd',
        currentPrice: 89.45,
        targetPrice: 120.00,
        recommendation: 'BUY',
        confidence: 72,
        reasoning: 'Growing food delivery market, improving unit economics, and expansion into new verticals',
        marketCap: 'Mid',
        sector: 'Consumer Services',
        change: 3.20,
        changePercent: 3.71
      },
      {
        symbol: 'PAYTM',
        companyName: 'One 97 Communications Ltd',
        currentPrice: 425.60,
        targetPrice: 350.00,
        recommendation: 'HOLD',
        confidence: 65,
        reasoning: 'Regulatory challenges in lending business, but strong payment ecosystem',
        marketCap: 'Mid',
        sector: 'Fintech',
        change: -8.90,
        changePercent: -2.05
      }
    ]

    const mockMarketOverview: MarketOverview = {
      nifty50: { value: 21456.75, change: 125.30, changePercent: 0.59 },
      sensex: { value: 70234.56, change: 298.45, changePercent: 0.43 },
      bankNifty: { value: 45678.90, change: -89.25, changePercent: -0.19 }
    }

    const mockPortfolioSummary: PortfolioSummary = {
      totalValue: 2456789.50,
      totalInvestment: 2200000.00,
      totalPnL: 256789.50,
      totalPnLPercent: 11.67,
      topGainer: { symbol: 'RELIANCE', change: 15.45 },
      topLoser: { symbol: 'PAYTM', change: -8.90 }
    }

    setRecommendations(mockRecommendations)
    setMarketOverview(mockMarketOverview)
    setPortfolioSummary(mockPortfolioSummary)
  }

  useEffect(() => {
    generateMockData()
    setLoading(false)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    generateMockData()
    setRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)}Cr`
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)}L`
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(2)}K`
    }
    return `₹${num.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="paytm-card p-6">
              <div className="loading-shimmer h-4 w-24 mb-2 rounded"></div>
              <div className="loading-shimmer h-8 w-32 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your investments and discover new opportunities</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="paytm-button-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Market Overview */}
      {marketOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="paytm-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">NIFTY 50</h3>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {marketOverview.nifty50.value.toLocaleString('en-IN')}
              </span>
              <div className={`flex items-center gap-1 ${
                marketOverview.nifty50.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketOverview.nifty50.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {marketOverview.nifty50.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <p className={`text-sm mt-1 ${
              marketOverview.nifty50.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {marketOverview.nifty50.change >= 0 ? '+' : ''}{marketOverview.nifty50.change.toFixed(2)}
            </p>
          </div>

          <div className="paytm-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">SENSEX</h3>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {marketOverview.sensex.value.toLocaleString('en-IN')}
              </span>
              <div className={`flex items-center gap-1 ${
                marketOverview.sensex.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketOverview.sensex.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {marketOverview.sensex.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <p className={`text-sm mt-1 ${
              marketOverview.sensex.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {marketOverview.sensex.change >= 0 ? '+' : ''}{marketOverview.sensex.change.toFixed(2)}
            </p>
          </div>

          <div className="paytm-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">BANK NIFTY</h3>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {marketOverview.bankNifty.value.toLocaleString('en-IN')}
              </span>
              <div className={`flex items-center gap-1 ${
                marketOverview.bankNifty.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketOverview.bankNifty.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {marketOverview.bankNifty.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
            <p className={`text-sm mt-1 ${
              marketOverview.bankNifty.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {marketOverview.bankNifty.change >= 0 ? '+' : ''}{marketOverview.bankNifty.change.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Portfolio Summary */}
      {portfolioSummary && (
        <div className="paytm-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(portfolioSummary.totalValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Investment</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(portfolioSummary.totalInvestment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total P&L</p>
              <p className={`text-2xl font-bold ${
                portfolioSummary.totalPnL >= 0 ? 'paytm-profit' : 'paytm-loss'
              }`}>
                {portfolioSummary.totalPnL >= 0 ? '+' : ''}{formatNumber(portfolioSummary.totalPnL)}
              </p>
              <p className={`text-sm ${
                portfolioSummary.totalPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioSummary.totalPnLPercent >= 0 ? '+' : ''}{portfolioSummary.totalPnLPercent.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Change</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    {portfolioSummary.topGainer.symbol}: +{portfolioSummary.topGainer.change.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">
                    {portfolioSummary.topLoser.symbol}: {portfolioSummary.topLoser.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Stock Recommendations */}
      <div className="paytm-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Stock Recommendations</h2>
            <p className="text-sm text-gray-600 mt-1">Powered by advanced market analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">AI Powered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendations.map((stock, index) => (
            <div key={stock.symbol} className="stock-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                    <span className={`paytm-badge ${
                      stock.marketCap === 'Large' ? 'market-cap-large' :
                      stock.marketCap === 'Mid' ? 'market-cap-mid' : 'market-cap-small'
                    }`}>
                      {stock.marketCap} Cap
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{stock.companyName}</p>
                  <p className="text-xs text-gray-500">{stock.sector}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(stock.currentPrice)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    <span>{stock.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`paytm-badge ${
                    stock.recommendation === 'BUY' ? 'paytm-badge-success' :
                    stock.recommendation === 'SELL' ? 'paytm-badge-error' : 'paytm-badge-warning'
                  }`}>
                    {stock.recommendation}
                  </span>
                  <span className="text-sm text-gray-600">
                    {stock.confidence}% confidence
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="font-semibold text-blue-600">
                    {formatCurrency(stock.targetPrice)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{stock.reasoning}</p>

              <div className="flex gap-2">
                <button className="paytm-button-primary flex-1 text-sm py-2">
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Portfolio
                </button>
                <button className="paytm-button-secondary px-3 py-2">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="paytm-card p-4 hover:border-blue-200 text-center">
          <Plus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Add Stock</p>
          <p className="text-sm text-gray-600">Build your portfolio</p>
        </button>
        
        <button className="paytm-card p-4 hover:border-blue-200 text-center">
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Stock Analysis</p>
          <p className="text-sm text-gray-600">Research stocks</p>
        </button>
        
        <button className="paytm-card p-4 hover:border-blue-200 text-center">
          <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Set Alerts</p>
          <p className="text-sm text-gray-600">Price notifications</p>
        </button>
        
        <button className="paytm-card p-4 hover:border-blue-200 text-center">
          <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Market Trends</p>
          <p className="text-sm text-gray-600">Latest insights</p>
        </button>
      </div>
    </div>
  )
}

export default Dashboard