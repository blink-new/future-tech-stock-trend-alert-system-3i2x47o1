import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Shield, Lock, Eye, UserCheck, Database, Globe } from 'lucide-react'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600">Your privacy and data security are our top priorities</p>
      </div>

      {/* Privacy Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-green-900">Bank-Grade Security</h3>
            <p className="text-sm text-green-700">256-bit SSL encryption</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6 text-center">
            <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-blue-900">No Data Selling</h3>
            <p className="text-sm text-blue-700">We never sell your data</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6 text-center">
            <UserCheck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-medium text-orange-900">Full Control</h3>
            <p className="text-sm text-orange-700">You own your data</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Privacy Policy */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>Information We Collect</h3>
            <ul>
              <li><strong>Account Information:</strong> Email address, name, and authentication data</li>
              <li><strong>Financial Data:</strong> Portfolio holdings, expense records, and investment preferences</li>
              <li><strong>Usage Data:</strong> App usage patterns, feature interactions, and performance metrics</li>
              <li><strong>Device Information:</strong> Device type, operating system, and browser information</li>
            </ul>
            
            <h3>How We Collect Data</h3>
            <ul>
              <li>Information you provide directly when using Finory</li>
              <li>Automatic collection through cookies and analytics</li>
              <li>Third-party integrations (with your explicit consent)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Data Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>How We Use Your Data</h3>
            <ul>
              <li><strong>Service Delivery:</strong> Provide personalized financial insights and recommendations</li>
              <li><strong>Security:</strong> Protect your account and detect fraudulent activities</li>
              <li><strong>Communication:</strong> Send important updates, alerts, and notifications</li>
              <li><strong>Improvement:</strong> Enhance our services and develop new features</li>
              <li><strong>Compliance:</strong> Meet legal and regulatory requirements</li>
            </ul>
            
            <h3>Data Sharing</h3>
            <p>We do NOT share your personal data with third parties except:</p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With trusted service providers under strict confidentiality agreements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>Security Measures</h3>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using AES-256</li>
              <li><strong>Access Control:</strong> Strict access controls and multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
              <li><strong>Secure Infrastructure:</strong> Hosted on secure, compliant cloud platforms</li>
              <li><strong>Data Backup:</strong> Regular encrypted backups with disaster recovery plans</li>
            </ul>
            
            <h3>Your Security Responsibilities</h3>
            <ul>
              <li>Keep your login credentials secure</li>
              <li>Use strong, unique passwords</li>
              <li>Enable two-factor authentication when available</li>
              <li>Report suspicious activities immediately</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>Data Rights</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Objection:</strong> Object to certain types of data processing</li>
            </ul>
            
            <h3>How to Exercise Your Rights</h3>
            <p>Contact us at <strong>privacy@finory.com</strong> or use the settings in your account to:</p>
            <ul>
              <li>Update your personal information</li>
              <li>Manage notification preferences</li>
              <li>Download your data</li>
              <li>Delete your account</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Compliance & Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>Regulatory Compliance</h3>
            <ul>
              <li><strong>SEBI Guidelines:</strong> Compliant with Securities and Exchange Board of India regulations</li>
              <li><strong>RBI Norms:</strong> Adherent to Reserve Bank of India data protection guidelines</li>
              <li><strong>IT Act 2000:</strong> Compliant with Indian Information Technology Act</li>
              <li><strong>GDPR:</strong> European General Data Protection Regulation compliant</li>
            </ul>
            
            <h3>Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Data Protection Officer:</strong> privacy@finory.com</p>
              <p><strong>Support Team:</strong> support@finory.com</p>
              <p><strong>Address:</strong> Finory Technologies Pvt. Ltd., India</p>
              <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
            </div>
            
            <h3>Policy Updates</h3>
            <p>This privacy policy was last updated on <strong>January 2024</strong>. We will notify you of any material changes via email or in-app notifications.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPolicy