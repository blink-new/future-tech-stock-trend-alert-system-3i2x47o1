import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar, Gift, Scissors, IndianRupee, Users } from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface CorporateEvent {
  id: string
  stock_id: string
  symbol: string
  event_type: string
  event_date: string
  ex_date: string
  record_date: string
  details: string
  ratio: string
  amount: number
  impact_analysis: string
  price_impact_expected: number
}

const CorporateEvents: React.FC = () => {
  const [events, setEvents] = useState<CorporateEvent[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const eventsData = await blink.db.corporate_events.list({
        orderBy: { event_date: 'desc' },
        limit: 20
      })
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'bonus': return <Gift className="h-5 w-5 text-green-600" />
      case 'split': return <Scissors className="h-5 w-5 text-blue-600" />
      case 'dividend': return <IndianRupee className="h-5 w-5 text-orange-600" />
      default: return <Calendar className="h-5 w-5 text-gray-600" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'bonus': return 'bg-green-100 text-green-800 border-green-200'
      case 'split': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'dividend': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Corporate Events</h1>
        <p className="text-gray-600">Track bonus issues, stock splits, dividends, and other corporate actions</p>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{event.symbol}</h3>
                      <Badge className={getEventColor(event.event_type)}>
                        {event.event_type}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{event.details}</p>
                    {event.ratio && (
                      <p className="text-sm text-gray-600">Ratio: {event.ratio}</p>
                    )}
                    {event.amount && (
                      <p className="text-sm text-gray-600">Amount: ₹{event.amount}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Event Date</p>
                  <p className="font-medium">{new Date(event.event_date).toLocaleDateString('en-IN')}</p>
                  {event.ex_date && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">Ex-Date</p>
                      <p className="font-medium">{new Date(event.ex_date).toLocaleDateString('en-IN')}</p>
                    </>
                  )}
                </div>
              </div>
              {event.impact_analysis && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Impact Analysis</h4>
                  <p className="text-sm text-blue-700">{event.impact_analysis}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CorporateEvents