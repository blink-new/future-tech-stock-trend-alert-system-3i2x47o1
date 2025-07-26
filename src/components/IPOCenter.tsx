import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  IndianRupee,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface IPO {
  id: string
  company_name: string
  issue_size: number
  price_band_min: number
  price_band_max: number
  lot_size: number
  open_date: string
  close_date: string
  listing_date: string
  exchange: string
  sector: string
  lead_managers: string
  registrar: string
  issue_type: string
  listing_gains_expected: number
  subscription_status: string
  grey_market_premium: number
  recommendation: string
  recommendation_reason: string
  fundamentals_score: number
  risk_factors: string
  competitive_advantages: string
  financial_highlights: string
}

const IPOCenter: React.FC = () => {
  const [ipos, setIpos] = useState<IPO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null)

  const loadIPOs = useCallback(async () => {
    setLoading(true)
    try {
      const ipoData = await blink.db.ipos.list({
        orderBy: { open_date: 'desc' },
        limit: 20
      })
      setIpos(ipoData)
    } catch (error) {
      console.error('Error loading IPOs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIPOs()
  }, [loadIPOs])

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'subscribe': return 'bg-green-100 text-green-800 border-green-200'
      case 'avoid': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'subscribe': return <CheckCircle className="h-4 w-4" />
      case 'avoid': return <XCircle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getIPOStatus = (ipo: IPO) => {
    const now = new Date()
    const openDate = new Date(ipo.open_date)
    const closeDate = new Date(ipo.close_date)
    const listingDate = new Date(ipo.listing_date)

    if (now < openDate) return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' }
    if (now >= openDate && now <= closeDate) return { status: 'Open', color: 'bg-green-100 text-green-800' }
    if (now > closeDate && now < listingDate) return { status: 'Closed', color: 'bg-yellow-100 text-yellow-800' }
    return { status: 'Listed', color: 'bg-gray-100 text-gray-800' }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IPO Center</h1>
          <p className="text-gray-600">Comprehensive IPO analysis with hidden insights and fundamentals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Building2 className="h-3 w-3 mr-1" />
            {ipos.length} IPOs Tracked
          </Badge>
        </div>
      </div>

      {/* IPO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ipos.map(ipo => {
          const status = getIPOStatus(ipo)
          return (
            <Card key={ipo.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedIPO(ipo)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{ipo.company_name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={status.color}>{status.status}</Badge>
                      <Badge variant="outline" className="text-xs">{ipo.sector}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(ipo.fundamentals_score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{ipo.fundamentals_score}/100</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Price Band */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price Band</span>
                    <span className="font-medium">₹{ipo.price_band_min} - ₹{ipo.price_band_max}</span>
                  </div>

                  {/* Issue Size */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Issue Size</span>
                    <span className="font-medium">₹{ipo.issue_size.toLocaleString('en-IN')} Cr</span>
                  </div>

                  {/* Lot Size */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lot Size</span>
                    <span className="font-medium">{ipo.lot_size} shares</span>
                  </div>

                  {/* Dates */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Open</span>
                      <span>{new Date(ipo.open_date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Close</span>
                      <span>{new Date(ipo.close_date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Listing</span>
                      <span>{new Date(ipo.listing_date).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {/* GMP */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">GMP</span>
                    <span className={`font-medium ${ipo.grey_market_premium >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {ipo.grey_market_premium >= 0 ? '+' : ''}₹{ipo.grey_market_premium}
                    </span>
                  </div>

                  {/* Expected Listing Gains */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected Gains</span>
                    <span className={`font-medium ${ipo.listing_gains_expected >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {ipo.listing_gains_expected >= 0 ? '+' : ''}{ipo.listing_gains_expected}%
                    </span>
                  </div>

                  {/* Recommendation */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getRecommendationColor(ipo.recommendation)} flex items-center space-x-1`}>
                        {getRecommendationIcon(ipo.recommendation)}
                        <span>{ipo.recommendation}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* IPO Details Modal */}
      {selectedIPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedIPO.company_name}</h2>
                <div className="flex items-center space-x-2">
                  <Badge className={getIPOStatus(selectedIPO).color}>
                    {getIPOStatus(selectedIPO).status}
                  </Badge>
                  <Badge variant="outline">{selectedIPO.sector}</Badge>
                  <Badge className={getRecommendationColor(selectedIPO.recommendation)}>
                    {getRecommendationIcon(selectedIPO.recommendation)}
                    <span className="ml-1">{selectedIPO.recommendation}</span>
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedIPO(null)}>
                Close
              </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">IPO Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Band</span>
                        <span className="font-medium">₹{selectedIPO.price_band_min} - ₹{selectedIPO.price_band_max}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Size</span>
                        <span className="font-medium">₹{selectedIPO.issue_size.toLocaleString('en-IN')} Cr</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Size</span>
                        <span className="font-medium">{selectedIPO.lot_size} shares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Type</span>
                        <span className="font-medium">{selectedIPO.issue_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Exchange</span>
                        <span className="font-medium">{selectedIPO.exchange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lead Managers</span>
                        <span className="font-medium text-right text-sm">{selectedIPO.lead_managers}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grey Market Premium</span>
                        <span className={`font-medium ${selectedIPO.grey_market_premium >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedIPO.grey_market_premium >= 0 ? '+' : ''}₹{selectedIPO.grey_market_premium}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Listing Gains</span>
                        <span className={`font-medium ${selectedIPO.listing_gains_expected >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedIPO.listing_gains_expected >= 0 ? '+' : ''}{selectedIPO.listing_gains_expected}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscription Status</span>
                        <span className="font-medium">{selectedIPO.subscription_status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fundamentals Score</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{selectedIPO.fundamentals_score}/100</span>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(selectedIPO.fundamentals_score / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financials">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedIPO.financial_highlights || 'Financial highlights will be updated soon.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Our Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-3 mb-4">
                        <div className={`p-2 rounded-full ${getRecommendationColor(selectedIPO.recommendation)}`}>
                          {getRecommendationIcon(selectedIPO.recommendation)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">{selectedIPO.recommendation}</h3>
                          <p className="text-gray-700">{selectedIPO.recommendation_reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Competitive Advantages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">
                          {selectedIPO.competitive_advantages || 'Competitive analysis will be updated soon.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risks">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedIPO.risk_factors || 'Risk analysis will be updated soon.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}

export default IPOCenter