import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { FileText, TrendingUp, TrendingDown, ExternalLink, Bot } from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface AnnualReport {
  id: string
  stock_id: string
  symbol: string
  financial_year: string
  revenue: number
  net_profit: number
  total_assets: number
  total_liabilities: number
  equity: number
  eps: number
  roe: number
  roce: number
  debt_to_equity: number
  current_ratio: number
  key_highlights: string
  management_commentary: string
  future_outlook: string
  risk_factors: string
  ai_analysis: string
  report_url: string
}

const AnnualReports: React.FC = () => {
  const [reports, setReports] = useState<AnnualReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<AnnualReport | null>(null)

  const loadReports = useCallback(async () => {
    setLoading(true)
    try {
      const reportsData = await blink.db.annual_reports.list({
        orderBy: { financial_year: 'desc' },
        limit: 20
      })
      setReports(reportsData)
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Annual Reports</h1>
        <p className="text-gray-600">AI-powered analysis of company annual reports with key insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedReport(report)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{report.symbol}</CardTitle>
                  <p className="text-sm text-gray-600">FY {report.financial_year}</p>
                </div>
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium">₹{(report.revenue / 10000000).toFixed(1)}Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net Profit</span>
                  <span className={`font-medium ${report.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{(Math.abs(report.net_profit) / 10000000).toFixed(1)}Cr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">EPS</span>
                  <span className="font-medium">₹{report.eps.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ROE</span>
                  <span className="font-medium">{report.roe.toFixed(1)}%</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Bot className="h-3 w-3 mr-1" />
                      AI Analyzed
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedReport.symbol} - Annual Report FY {selectedReport.financial_year}
                </h2>
              </div>
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-medium">₹{(selectedReport.revenue / 10000000).toFixed(1)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Profit</span>
                    <span className={`font-medium ${selectedReport.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{(Math.abs(selectedReport.net_profit) / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Assets</span>
                    <span className="font-medium">₹{(selectedReport.total_assets / 10000000).toFixed(1)} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equity</span>
                    <span className="font-medium">₹{(selectedReport.equity / 10000000).toFixed(1)} Cr</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Ratios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">EPS</span>
                    <span className="font-medium">₹{selectedReport.eps.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROE</span>
                    <span className="font-medium">{selectedReport.roe.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROCE</span>
                    <span className="font-medium">{selectedReport.roce.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Debt to Equity</span>
                    <span className="font-medium">{selectedReport.debt_to_equity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Ratio</span>
                    <span className="font-medium">{selectedReport.current_ratio.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-600" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedReport.ai_analysis || 'AI analysis will be available soon.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedReport.key_highlights || 'Key highlights will be updated soon.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Future Outlook</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedReport.future_outlook || 'Future outlook analysis will be updated soon.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {selectedReport.report_url && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full" onClick={() => window.open(selectedReport.report_url, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Annual Report
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnnualReports