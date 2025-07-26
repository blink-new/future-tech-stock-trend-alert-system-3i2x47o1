import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Shield, AlertTriangle, CheckCircle, Phone, Mail, MessageSquare } from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface CyberFraudAlert {
  id: string
  alert_type: string
  title: string
  description: string
  severity: string
  affected_platforms: string
  prevention_tips: string
  reporting_mechanism: string
  is_active: boolean
}

const CyberSecurity: React.FC = () => {
  const [alerts, setAlerts] = useState<CyberFraudAlert[]>([])
  const [loading, setLoading] = useState(true)

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const alertsData = await blink.db.cyber_fraud_alerts.list({
        where: { is_active: "1" },
        orderBy: { created_at: 'desc' }
      })
      setAlerts(alertsData)
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Shield className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
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
        <h1 className="text-2xl font-bold text-gray-900">Cyber Security</h1>
        <p className="text-gray-600">Stay protected from financial cyber frauds and scams</p>
      </div>

      {/* Security Tips */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Finory Security Promise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-green-900">Bank-Grade Security</h3>
              <p className="text-sm text-green-700">256-bit SSL encryption</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-green-900">No Personal Data Sharing</h3>
              <p className="text-sm text-green-700">Your data stays private</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-green-900">Real-time Alerts</h3>
              <p className="text-sm text-green-700">Instant fraud notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Fraud Alerts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Current Fraud Alerts</h2>
        {alerts.map(alert => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{alert.title}</h3>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity} Risk
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Type: {alert.alert_type}</span>
                      <span>Platforms: {alert.affected_platforms}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🛡️ Prevention Tips</h4>
                  <p className="text-sm text-blue-700">{alert.prevention_tips}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">📞 Report Fraud</h4>
                  <p className="text-sm text-orange-700">{alert.reporting_mechanism}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Emergency Fraud Reporting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <Phone className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Cyber Crime Helpline</h3>
              <p className="text-lg font-bold text-red-600">1930</p>
              <p className="text-sm text-gray-600">24/7 Available</p>
            </div>
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <Mail className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Report Online</h3>
              <p className="text-sm font-medium text-red-600">cybercrime.gov.in</p>
              <p className="text-sm text-gray-600">File complaint online</p>
            </div>
            <div className="text-center p-4 border border-red-200 rounded-lg">
              <MessageSquare className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">WhatsApp</h3>
              <p className="text-lg font-bold text-red-600">8800-000-000</p>
              <p className="text-sm text-gray-600">Report via WhatsApp</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Safety Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">✅ Do's</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Verify broker SEBI registration</li>
                <li>• Use official trading apps only</li>
                <li>• Enable 2FA on all accounts</li>
                <li>• Check URLs before entering credentials</li>
                <li>• Keep software updated</li>
                <li>• Monitor account statements regularly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">❌ Don'ts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Never share OTP or PIN</li>
                <li>• Don't click suspicious links</li>
                <li>• Avoid guaranteed return schemes</li>
                <li>• Don't trade on unregistered platforms</li>
                <li>• Never give remote access to devices</li>
                <li>• Don't trust unsolicited investment tips</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CyberSecurity