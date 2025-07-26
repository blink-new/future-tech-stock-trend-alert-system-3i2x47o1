import React, { useState, useEffect } from 'react'
import { createClient } from '../blink/client'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Calendar, 
  Trash2,
  Eye,
  RefreshCw,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface PortfolioStock {
  id: string
  symbol: string
  company_name: string
  quantity: number
  avg_price: number
  current_price: number
  total_value: number
  pnl: number
  pnl_percent: number
  sector: string
  exchange: string
  purchase_date: string
  last_updated: string
}

function PortfolioTracker() {
  const [stocks, setStocks] = useState<PortfolioStock[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadPortfolio = async () => {
    try {
      const user = await blink.auth.me()
      if (!user) return

      const portfolioStocks = await blink.db.portfolio.list({
        where: { user_id: user.id },
        orderBy: { last_updated: 'desc' }
      })

      // Update current prices and calculate P&L
      const updatedStocks = portfolioStocks.map(stock => {
        // Simulate real-time price updates
        const priceChange = (Math.random() - 0.5) * 0.1 // ±5% random change
        const currentPrice = stock.avg_price * (1 + priceChange)
        const totalValue = currentPrice * stock.quantity
        const pnl = totalValue - (stock.avg_price * stock.quantity)
        const pnlPercent = (pnl / (stock.avg_price * stock.quantity)) * 100

        return {
          ...stock,
          current_price: currentPrice,
          total_value: totalValue,
          pnl: pnl,
          pnl_percent: pnlPercent,
          last_updated: new Date().toISOString()
        }
      })

      setStocks(updatedStocks)
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPortfolio()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (!refreshing) {
        loadPortfolio()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshing])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadPortfolio()
    setRefreshing(false)
  }

  const handleDeleteStock = async (stockId: string) => {
    try {
      await blink.db.portfolio.delete(stockId)
      setStocks(stocks.filter(stock => stock.id !== stockId))
    } catch (error) {
      console.error('Error deleting stock:', error)
    }
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

  // Calculate portfolio summary
  const portfolioSummary = stocks.reduce(
    (acc, stock) => ({
      totalInvestment: acc.totalInvestment + (stock.avg_price * stock.quantity),
      totalValue: acc.totalValue + stock.total_value,
      totalPnL: acc.totalPnL + stock.pnl,
      stockCount: acc.stockCount + 1
    }),
    { totalInvestment: 0, totalValue: 0, totalPnL: 0, stockCount: 0 }
  )

  const totalPnLPercent = portfolioSummary.totalInvestment > 0 
    ? (portfolioSummary.totalPnL / portfolioSummary.totalInvestment) * 100 
    : 0

  if (loading) {
    return (
      <div className="p-6">
        <div className="paytm-card p-6 mb-6">
          <div className="loading-shimmer h-6 w-48 mb-4 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="loading-shimmer h-4 w-24 mb-2 rounded"></div>
                <div className="loading-shimmer h-8 w-32 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor your investments and track performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="paytm-button-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="paytm-button-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Stock
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="paytm-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Overview</h2>
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">{portfolioSummary.stockCount} Holdings</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 mb-1">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(portfolioSummary.totalInvestment)}
            </p>
          </div>
          
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 mb-1">Current Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(portfolioSummary.totalValue)}
            </p>
          </div>
          
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 mb-1">Total P&L</p>
            <p className={`text-2xl font-bold ${
              portfolioSummary.totalPnL >= 0 ? 'paytm-profit' : 'paytm-loss'
            }`}>
              {portfolioSummary.totalPnL >= 0 ? '+' : ''}{formatNumber(portfolioSummary.totalPnL)}
            </p>
            <div className={`flex items-center justify-center lg:justify-start gap-1 mt-1 ${
              totalPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalPnLPercent >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span className="text-sm font-semibold">
                {totalPnLPercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 mb-1">Day's Change</p>
            <div className="space-y-1">
              <div className="flex items-center justify-center lg:justify-start gap-1 text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-sm font-medium">+₹12,450</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1 text-green-600">
                <span className="text-sm">+0.85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      {stocks.length === 0 ? (
        <div className="paytm-card p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Holdings Yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your portfolio by adding your first stock investment
          </p>
          <button className="paytm-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Stock
          </button>
        </div>
      ) : (
        <div className="paytm-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Holdings</h2>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString('en-IN')}
            </div>
          </div>

          <div className="space-y-4">
            {stocks.map((stock) => (
              <div key={stock.id} className="stock-card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Stock Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                          <span className="paytm-badge paytm-badge-info text-xs">
                            {stock.exchange}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{stock.company_name}</p>
                        <p className="text-xs text-gray-500">{stock.sector}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(stock.current_price)}
                        </p>
                        <div className={`flex items-center gap-1 text-sm ${
                          stock.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.pnl >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          <span>{stock.pnl_percent.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium text-gray-900">{stock.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Price</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(stock.avg_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Investment</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(stock.avg_price * stock.quantity)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Value</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(stock.total_value)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* P&L and Actions */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="text-center lg:text-right">
                      <p className="text-sm text-gray-600 mb-1">P&L</p>
                      <p className={`text-lg font-bold ${
                        stock.pnl >= 0 ? 'paytm-profit' : 'paytm-loss'
                      }`}>
                        {stock.pnl >= 0 ? '+' : ''}{formatCurrency(stock.pnl)}
                      </p>
                      <p className={`text-sm ${
                        stock.pnl_percent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.pnl_percent >= 0 ? '+' : ''}{stock.pnl_percent.toFixed(2)}%
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="paytm-button-secondary px-3 py-2">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStock(stock.id)}
                        className="paytm-button-secondary px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Purchase Date */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Purchased on {new Date(stock.purchase_date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {stocks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="paytm-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {stocks
                .sort((a, b) => b.pnl_percent - a.pnl_percent)
                .slice(0, 3)
                .map((stock) => (
                  <div key={stock.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.company_name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        stock.pnl >= 0 ? 'paytm-profit' : 'paytm-loss'
                      }`}>
                        {stock.pnl >= 0 ? '+' : ''}{stock.pnl_percent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(stock.pnl)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="paytm-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Allocation</h3>
            <div className="space-y-3">
              {Object.entries(
                stocks.reduce((acc, stock) => {
                  const sector = stock.sector || 'Others'
                  acc[sector] = (acc[sector] || 0) + stock.total_value
                  return acc
                }, {} as Record<string, number>)
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([sector, value]) => {
                  const percentage = (value / portfolioSummary.totalValue) * 100
                  return (
                    <div key={sector} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-900">{sector}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {percentage.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatNumber(value)}
                        </p>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioTracker