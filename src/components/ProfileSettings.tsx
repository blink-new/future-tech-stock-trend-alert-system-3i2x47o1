import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { User, Mail, Phone, Save, Shield, Bell, Smartphone } from 'lucide-react'
import type { UserSettings } from '../types'

export default function ProfileSettings() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tempSettings, setTempSettings] = useState({
    email: '',
    mobile: ''
  })

  const loadUserData = useCallback(async () => {
    try {
      const userData = await blink.auth.me()
      setUser(userData)

      // Load user settings
      const existingSettings = await blink.db.userSettings.list({ 
        where: { userId: userData.id },
        limit: 1
      })

      if (existingSettings.length > 0) {
        const userSettings = existingSettings[0]
        setSettings(userSettings)
        setTempSettings({
          email: userSettings.email,
          mobile: userSettings.mobile || ''
        })
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          id: `settings_${Date.now()}`,
          userId: userData.id,
          email: userData.email || 'heylipan@gmail.com',
          mobile: '',
          whatsappEnabled: true,
          emailEnabled: true,
          mobileEnabled: true,
          alertThreshold: 75,
          preferredMarketCaps: 'large,mid,small',
          lastUpdated: new Date().toISOString()
        }

        await blink.db.userSettings.create(defaultSettings)
        setSettings(defaultSettings)
        setTempSettings({
          email: defaultSettings.email,
          mobile: defaultSettings.mobile
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  const saveProfile = async () => {
    if (!settings || !user) return

    setSaving(true)
    try {
      // Update settings in database
      await blink.db.userSettings.update(settings.id, {
        email: tempSettings.email,
        mobile: tempSettings.mobile,
        lastUpdated: new Date().toISOString()
      })

      // Update local state
      setSettings({
        ...settings,
        email: tempSettings.email,
        mobile: tempSettings.mobile
      })

      // Send confirmation email
      await blink.notifications.email({
        to: tempSettings.email,
        subject: 'Profile Updated - Stock Alert System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Profile Updated Successfully</h2>
            <p>Your profile information has been updated in the Stock Alert System.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Updated Information:</h3>
              <p><strong>Email:</strong> ${tempSettings.email}</p>
              <p><strong>Mobile:</strong> ${tempSettings.mobile || 'Not provided'}</p>
              <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>You'll continue to receive stock alerts and market insights at your updated contact information.</p>
            <p style="color: #666; font-size: 12px;">This is an automated message from your Stock Alert System.</p>
          </div>
        `,
        text: `Profile Updated - Your contact information has been updated in the Stock Alert System. Email: ${tempSettings.email}, Mobile: ${tempSettings.mobile || 'Not provided'}`
      })

      alert('Profile updated successfully! Confirmation email sent.')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = () => {
    if (!settings) return false
    return tempSettings.email !== settings.email || tempSettings.mobile !== settings.mobile
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

  if (!user || !settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error loading profile. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600">Manage your account and contact information</p>
        </div>
        <Button 
          onClick={saveProfile} 
          disabled={saving || !hasChanges()}
          className={hasChanges() ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : hasChanges() ? 'Save Changes' : 'Saved'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User ID */}
            <div className="space-y-2">
              <Label>User ID</Label>
              <div className="flex items-center space-x-2">
                <Input value={user.id} disabled className="font-mono text-sm" />
                <Badge variant="secondary">Read Only</Badge>
              </div>
              <p className="text-xs text-gray-500">Your unique identifier in the system</p>
            </div>

            {/* Account Status */}
            <div className="space-y-2">
              <Label>Account Status</Label>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Active
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  Free Plan
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Your account is active and ready to receive alerts</p>
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input 
                value={new Date(user.created_at || Date.now()).toLocaleDateString()} 
                disabled 
              />
              <p className="text-xs text-gray-500">Date when you joined the system</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input
                  id="profile-email"
                  type="email"
                  value={tempSettings.email}
                  onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                  placeholder="your@email.com"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500">
                Primary email for alerts and notifications
              </p>
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="profile-mobile">Mobile Number</Label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <Input
                  id="profile-mobile"
                  type="tel"
                  value={tempSettings.mobile}
                  onChange={(e) => setTempSettings({ ...tempSettings, mobile: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500">
                For SMS and WhatsApp notifications (optional)
              </p>
            </div>

            {/* Notification Preferences Summary */}
            <div className="space-y-2">
              <Label>Active Notifications</Label>
              <div className="flex flex-wrap gap-2">
                {Number(settings.emailEnabled) > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Badge>
                )}
                {Number(settings.mobileEnabled) > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <Smartphone className="h-3 w-3 mr-1" />
                    Mobile
                  </Badge>
                )}
                {Number(settings.whatsappEnabled) > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <Bell className="h-3 w-3 mr-1" />
                    WhatsApp
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Configure notification channels in Alert Settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Alert Preferences</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Threshold: {settings.alertThreshold}%</p>
                <p>• Market Caps: {settings.preferredMarketCaps.replace(/,/g, ', ').toUpperCase()}</p>
                <p>• Last Updated: {new Date(settings.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">System Features</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• AI-powered stock analysis</p>
                <p>• Real-time portfolio tracking</p>
                <p>• Multi-channel notifications</p>
                <p>• Automated daily alerts</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Data & Privacy</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Secure data encryption</p>
                <p>• No data sharing with third parties</p>
                <p>• GDPR compliant</p>
                <p>• Free to use, no hidden costs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Important Notes</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• This system is completely free to use with no hidden charges</p>
                <p>• Your data is encrypted and never shared with third parties</p>
                <p>• Email notifications are sent from a secure, verified domain</p>
                <p>• WhatsApp integration requires your mobile number for delivery</p>
                <p>• You can update your contact information anytime</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Indicator */}
      {hasChanges() && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">You have unsaved changes</p>
        </div>
      )}
    </div>
  )
}