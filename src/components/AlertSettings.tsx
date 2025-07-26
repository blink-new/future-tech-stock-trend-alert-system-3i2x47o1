import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Checkbox } from './ui/checkbox'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { Bell, Mail, MessageCircle, Smartphone, Settings, Save } from 'lucide-react'
import type { UserSettings, Alert } from '../types'

export default function AlertSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sendTestNotifications = async () => {
    if (!settings) return

    try {
      // Send email notification
      if (settings.emailEnabled) {
        await blink.notifications.email({
          to: settings.email,
          subject: 'Stock Alert System - Settings Updated',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Stock Alert System</h2>
              <p>Your alert settings have been updated successfully!</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Current Settings:</h3>
                <ul>
                  <li>Email Alerts: ${settings.emailEnabled ? 'Enabled' : 'Disabled'}</li>
                  <li>Mobile Alerts: ${settings.mobileEnabled ? 'Enabled' : 'Disabled'}</li>
                  <li>WhatsApp Alerts: ${settings.whatsappEnabled ? 'Enabled' : 'Disabled'}</li>
                  <li>Alert Threshold: ${settings.alertThreshold}%</li>
                  <li>Market Caps: ${settings.preferredMarketCaps.join(', ').toUpperCase()}</li>
                </ul>
              </div>
              <p>You'll receive alerts when stocks meet your criteria. Stay informed about the best investment opportunities!</p>
              <p style="color: #666; font-size: 12px;">This is an automated message from your Stock Alert System.</p>
            </div>
          `,
          text: `Stock Alert System - Your settings have been updated. You'll receive alerts for ${settings.preferredMarketCaps.join(', ')} cap stocks with ${settings.alertThreshold}% threshold.`
        })
      }

      // Simulate WhatsApp notification (in real app, would integrate with WhatsApp Business API)
      if (settings.whatsappEnabled && settings.mobile) {
        console.log(`WhatsApp notification would be sent to: ${settings.mobile}`)
        // In production, integrate with WhatsApp Business API
      }

    } catch (error) {
      console.error('Error sending notifications:', error)
    }
  }

  const loadSettings = async () => {
    try {
      const user = await blink.auth.me()
      
      // Try to get existing settings
      const existingSettings = await blink.db.userSettings.list({ 
        where: { userId: user.id },
        limit: 1
      })

      if (existingSettings.length > 0) {
        const userSettings = existingSettings[0]
        setSettings({
          ...userSettings,
          preferredMarketCaps: userSettings.preferredMarketCaps.split(',') as ('large' | 'mid' | 'small')[]
        })
      } else {
        // Create default settings
        const defaultSettings = {
          id: `settings_${Date.now()}`,
          userId: user.id,
          email: user.email || 'heylipan@gmail.com',
          mobile: '',
          whatsappEnabled: true,
          emailEnabled: true,
          mobileEnabled: true,
          alertThreshold: 75,
          preferredMarketCaps: ['large', 'mid', 'small'] as ('large' | 'mid' | 'small')[],
          lastUpdated: new Date().toISOString()
        }

        await blink.db.userSettings.create({
          ...defaultSettings,
          preferredMarketCaps: defaultSettings.preferredMarketCaps.join(',')
        })
        
        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAlerts = async () => {
    try {
      const user = await blink.auth.me()
      const alertsData = await blink.db.alerts.list({ 
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 10
      })
      setAlerts(alertsData)
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  useEffect(() => {
    loadSettings()
    loadAlerts()
  }, [])

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      await blink.db.userSettings.update(settings.id, {
        email: settings.email,
        mobile: settings.mobile,
        whatsappEnabled: settings.whatsappEnabled ? "1" : "0",
        emailEnabled: settings.emailEnabled ? "1" : "0",
        mobileEnabled: settings.mobileEnabled ? "1" : "0",
        alertThreshold: settings.alertThreshold,
        preferredMarketCaps: settings.preferredMarketCaps.join(','),
        lastUpdated: new Date().toISOString()
      })

      // Send test notifications
      await sendTestNotifications()
      
      alert('Settings saved successfully! Test notifications sent.')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const markAlertAsRead = async (alertId: string) => {
    try {
      await blink.db.alerts.update(alertId, { isRead: "1" })
      await loadAlerts()
    } catch (error) {
      console.error('Error marking alert as read:', error)
    }
  }

  const handleMarketCapChange = (marketCap: 'large' | 'mid' | 'small', checked: boolean) => {
    if (!settings) return

    let newMarketCaps = [...settings.preferredMarketCaps]
    if (checked) {
      if (!newMarketCaps.includes(marketCap)) {
        newMarketCaps.push(marketCap)
      }
    } else {
      newMarketCaps = newMarketCaps.filter(cap => cap !== marketCap)
    }

    setSettings({ ...settings, preferredMarketCaps: newMarketCaps })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error loading settings. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert Settings</h2>
          <p className="text-gray-600">Configure your notification preferences</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Channels</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="email-toggle">Email Notifications</Label>
                </div>
                <Switch
                  id="email-toggle"
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Mobile Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-green-500" />
                  <Label htmlFor="mobile-toggle">Mobile Push Notifications</Label>
                </div>
                <Switch
                  id="mobile-toggle"
                  checked={settings.mobileEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, mobileEnabled: checked })}
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={settings.mobile}
                  onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* WhatsApp Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <Label htmlFor="whatsapp-toggle">WhatsApp Notifications</Label>
                </div>
                <Switch
                  id="whatsapp-toggle"
                  checked={settings.whatsappEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, whatsappEnabled: checked })}
                />
              </div>
              <p className="text-sm text-gray-600">
                WhatsApp notifications will be sent to your mobile number above
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alert Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Alert Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alert Threshold */}
            <div className="space-y-3">
              <Label>Alert Threshold: {settings.alertThreshold}%</Label>
              <Slider
                value={[settings.alertThreshold]}
                onValueChange={(value) => setSettings({ ...settings, alertThreshold: value[0] })}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Only receive alerts for stocks with future potential above this threshold
              </p>
            </div>

            {/* Market Cap Preferences */}
            <div className="space-y-3">
              <Label>Preferred Market Caps</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="large-cap"
                    checked={settings.preferredMarketCaps.includes('large')}
                    onCheckedChange={(checked) => handleMarketCapChange('large', checked as boolean)}
                  />
                  <Label htmlFor="large-cap">Large Cap Stocks</Label>
                  <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mid-cap"
                    checked={settings.preferredMarketCaps.includes('mid')}
                    onCheckedChange={(checked) => handleMarketCapChange('mid', checked as boolean)}
                  />
                  <Label htmlFor="mid-cap">Mid Cap Stocks</Label>
                  <Badge className="bg-green-100 text-green-800">Growth</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="small-cap"
                    checked={settings.preferredMarketCaps.includes('small')}
                    onCheckedChange={(checked) => handleMarketCapChange('small', checked as boolean)}
                  />
                  <Label htmlFor="small-cap">Small Cap Stocks</Label>
                  <Badge className="bg-purple-100 text-purple-800">High Risk/Reward</Badge>
                </div>
              </div>
            </div>

            {/* Notification Frequency */}
            <div className="space-y-3">
              <Label>Notification Schedule</Label>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Daily market analysis at 9:00 AM EST</p>
                <p>• Real-time alerts for high-confidence signals</p>
                <p>• Weekly portfolio performance summary</p>
                <p>• Monthly trend insights report</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border ${Number(alert.isRead) > 0 ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.symbol}</h4>
                        <Badge className={alert.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {alert.type.toUpperCase()}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-800">
                          {alert.marketCap.toUpperCase()}-CAP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.reasoning}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Price: ${alert.price}</span>
                        <span>Confidence: {alert.confidence}%</span>
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    {Number(alert.isRead) === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAlertAsRead(alert.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No alerts yet. Your first alerts will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}