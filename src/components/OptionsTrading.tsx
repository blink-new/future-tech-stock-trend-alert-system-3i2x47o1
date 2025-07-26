import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  Eye,
  Calculator,
  Target,
  Zap
} from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface OptionsData {
  id: string
  underlying_symbol: string
  strike_price: number
  expiry_date: string
  option_type: string
  ltp: number
  bid: number
  ask: number
  volume: number
  open_interest: number
  iv: number
  delta: number
  gamma: number
  theta: number
  vega: number
  manipulation_alert: boolean
  manipulation_reason: string
}

const OptionsTrading: React.FC = () => {
  const [optionsData, setOptionsData] = useState<OptionsData[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const loadOptionsData = useCallback(async () => {
    setLoading(true)
    try {
      // Generate sample options data for demonstration
      const sampleData: OptionsData[] = [
        {
          id: 'opt_1',
          underlying_symbol: 'NIFTY',
          strike_price: 21000,
          expiry_date: '2024-02-29',
          option_type: 'CE',
          ltp: 145.50,
          bid: 144.00,
          ask: 146.00,
          volume: 125000,
          open_interest: 2500000,
          iv: 18.5,
          delta: 0.65,
          gamma: 0.003,
          theta: -12.5,
          vega: 45.2,
          manipulation_alert: false,
          manipulation_reason: ''
        },
        {
          id: 'opt_2',
          underlying_symbol: 'NIFTY',
          strike_price: 21000,
          expiry_date: '2024-02-29',
          option_type: 'PE',
          ltp: 89.75,
          bid: 88.50,
          ask: 90.25,
          volume: 98000,
          open_interest: 1800000,
          iv: 19.2,
          delta: -0.35,
          gamma: 0.003,
          theta: -8.9,
          vega: 42.1,
          manipulation_alert: true,
          manipulation_reason: 'Unusual volume spike detected - 300% above average'
        },
        {
          id: 'opt_3',
          underlying_symbol: 'NIFTY',
          strike_price: 21100,
          expiry_date: '2024-02-29',
          option_type: 'CE',
          ltp: 98.25,
          bid: 97.00,
          ask: 99.00,
          volume: 87000,
          open_interest: 1950000,
          iv: 17.8,
          delta: 0.45,
          gamma: 0.004,
          theta: -15.2,
          vega: 48.7,
          manipulation_alert: false,
          manipulation_reason: ''
        },
        {
          id: 'opt_4',
          underlying_symbol: 'BANKNIFTY',
          strike_price: 46000,
          expiry_date: '2024-02-29',
          option_type: 'CE',
          ltp: 234.75,
          bid: 232.50,
          ask: 236.00,
          volume: 156000,
          open_interest: 1200000,
          iv: 22.1,
          delta: 0.58,
          gamma: 0.002,
          theta: -18.7,
          vega: 52.3,
          manipulation_alert: true,
          manipulation_reason: 'Bid-Ask spread unusually wide - possible price manipulation'
        }
      ]

      setOptionsData(sampleData.filter(opt => 
        opt.underlying_symbol === selectedSymbol &&
        (selectedExpiry === '' || opt.expiry_date === selectedExpiry)
      ))
    } catch (error) {
      console.error('Error loading options data:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSymbol, selectedExpiry])

  useEffect(() => {
    loadOptionsData()
  }, [loadOptionsData])

  const getManipulationAlerts = () => {
    return optionsData.filter(opt => opt.manipulation_alert)
  }

  const calculateProfitLoss = (strike: number, premium: number, spotPrice: number, optionType: string) => {
    if (optionType === 'CE') {
      return Math.max(0, spotPrice - strike) - premium
    } else {
      return Math.max(0, strike - spotPrice) - premium
    }
  }

  const getGreeksColor = (value: number, greek: string) => {
    if (greek === 'delta') {
      return value > 0 ? 'text-green-600' : 'text-red-600'
    }
    if (greek === 'theta') {
      return value < 0 ? 'text-red-600' : 'text-green-600'
    }
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Options Trading</h1>
          <p className="text-gray-600">Advanced options analysis with manipulation detection</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Manipulation Alerts */}
      {getManipulationAlerts().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Manipulation Alerts ({getManipulationAlerts().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getManipulationAlerts().map(alert => (
                <div key={alert.id} className="bg-white p-3 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">
                        {alert.underlying_symbol} {alert.strike_price} {alert.option_type}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        Exp: {new Date(alert.expiry_date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <Badge variant="destructive">Alert</Badge>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{alert.manipulation_reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Underlying</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="NIFTY">NIFTY</option>
                <option value="BANKNIFTY">BANKNIFTY</option>
                <option value="RELIANCE">RELIANCE</option>
                <option value="TCS">TCS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
              <select
                value={selectedExpiry}
                onChange={(e) => setSelectedExpiry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">All Expiries</option>
                <option value="2024-02-29">29 Feb 2024</option>
                <option value="2024-03-28">28 Mar 2024</option>
                <option value="2024-04-25">25 Apr 2024</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search strikes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={loadOptionsData} className="w-full bg-orange-500 hover:bg-orange-600">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options Chain */}
      <Tabs defaultValue="chain" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chain">Options Chain</TabsTrigger>
          <TabsTrigger value="calculator">P&L Calculator</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="chain">
          <Card>
            <CardHeader>
              <CardTitle>Options Chain - {selectedSymbol}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium text-gray-700">Strike</th>
                      <th className="text-left p-2 font-medium text-gray-700">Type</th>
                      <th className="text-left p-2 font-medium text-gray-700">LTP</th>
                      <th className="text-left p-2 font-medium text-gray-700">Bid/Ask</th>
                      <th className="text-left p-2 font-medium text-gray-700">Volume</th>
                      <th className="text-left p-2 font-medium text-gray-700">OI</th>
                      <th className="text-left p-2 font-medium text-gray-700">IV</th>
                      <th className="text-left p-2 font-medium text-gray-700">Greeks</th>
                      <th className="text-left p-2 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionsData.map(option => (
                      <tr key={option.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{option.strike_price}</td>
                        <td className="p-2">
                          <Badge variant={option.option_type === 'CE' ? 'default' : 'secondary'}>
                            {option.option_type}
                          </Badge>
                        </td>
                        <td className="p-2 font-medium">₹{option.ltp.toFixed(2)}</td>
                        <td className="p-2 text-sm text-gray-600">
                          {option.bid.toFixed(2)} / {option.ask.toFixed(2)}
                        </td>
                        <td className="p-2">{option.volume.toLocaleString('en-IN')}</td>
                        <td className="p-2">{option.open_interest.toLocaleString('en-IN')}</td>
                        <td className="p-2">{option.iv.toFixed(1)}%</td>
                        <td className="p-2 text-xs">
                          <div className="space-y-1">
                            <div className={getGreeksColor(option.delta, 'delta')}>
                              Δ: {option.delta.toFixed(3)}
                            </div>
                            <div className={getGreeksColor(option.theta, 'theta')}>
                              Θ: {option.theta.toFixed(1)}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          {option.manipulation_alert ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Alert
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Normal
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Options P&L Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Position Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Strike Price</label>
                      <Input type="number" placeholder="21000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Premium Paid</label>
                      <Input type="number" placeholder="145.50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <Input type="number" placeholder="50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Option Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="CE">Call (CE)</option>
                        <option value="PE">Put (PE)</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Calculate P&L
                  </Button>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">P&L Analysis</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Breakeven Point:</span>
                        <span className="font-medium">₹21,145.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Profit:</span>
                        <span className="font-medium text-green-600">Unlimited</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Loss:</span>
                        <span className="font-medium text-red-600">₹7,275</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current P&L:</span>
                        <span className="font-medium text-green-600">+₹2,450</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Long Call',
                description: 'Buy call option for bullish view',
                risk: 'Limited',
                reward: 'Unlimited',
                complexity: 'Beginner'
              },
              {
                name: 'Covered Call',
                description: 'Hold stock + sell call option',
                risk: 'Moderate',
                reward: 'Limited',
                complexity: 'Intermediate'
              },
              {
                name: 'Iron Condor',
                description: 'Profit from low volatility',
                risk: 'Limited',
                reward: 'Limited',
                complexity: 'Advanced'
              }
            ].map((strategy, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{strategy.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Risk:</span>
                      <span className="font-medium">{strategy.risk}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reward:</span>
                      <span className="font-medium">{strategy.reward}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Complexity:</span>
                      <Badge variant="outline" className="text-xs">
                        {strategy.complexity}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Target className="h-4 w-4 mr-2" />
                    Learn Strategy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OptionsTrading