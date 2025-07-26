import React, { useState, useEffect } from 'react'
import { createClient } from './blink/client'
import { 
  BarChart3, 
  TrendingUp, 
  Briefcase, 
  Settings, 
  Bot, 
  User, 
  Plus,
  Search,
  Calculator,
  PieChart,
  Building2,
  Calendar,
  FileText,
  Shield,
  GraduationCap,
  FileCheck,
  Menu,
  X
} from 'lucide-react'

// Import components
import Dashboard from './components/Dashboard'
import StockAnalysis from './components/StockAnalysis'
import PortfolioTracker from './components/PortfolioTracker'
import AlertSettings from './components/AlertSettings'
import AIAssistant from './components/AIAssistant'
import ProfileSettings from './components/ProfileSettings'
import AddStock from './components/AddStock'
import StockSearch from './components/StockSearch'
import FinancialCalculators from './components/FinancialCalculators'
import OptionsTrading from './components/OptionsTrading'
import ExpenseTracker from './components/ExpenseTracker'
import IPOCenter from './components/IPOCenter'
import CorporateEvents from './components/CorporateEvents'
import AnnualReports from './components/AnnualReports'
import CyberSecurity from './components/CyberSecurity'
import FinancialEducation from './components/FinancialEducation'
import PrivacyPolicy from './components/PrivacyPolicy'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

type ActiveTab = 
  | 'dashboard' 
  | 'analysis' 
  | 'portfolio' 
  | 'alerts' 
  | 'assistant' 
  | 'profile'
  | 'add-stock'
  | 'stock-search'
  | 'calculators'
  | 'options'
  | 'expenses'
  | 'ipo'
  | 'corporate-events'
  | 'annual-reports'
  | 'cyber-security'
  | 'education'
  | 'privacy'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, category: 'main' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, category: 'main' },
    { id: 'add-stock', label: 'Add Stock', icon: Plus, category: 'main' },
    { id: 'stock-search', label: 'Stock Search', icon: Search, category: 'main' },
    { id: 'analysis', label: 'Stock Analysis', icon: TrendingUp, category: 'trading' },
    { id: 'options', label: 'Options Trading', icon: PieChart, category: 'trading' },
    { id: 'ipo', label: 'IPO Center', icon: Building2, category: 'trading' },
    { id: 'corporate-events', label: 'Corporate Events', icon: Calendar, category: 'trading' },
    { id: 'annual-reports', label: 'Annual Reports', icon: FileText, category: 'trading' },
    { id: 'expenses', label: 'Expense Tracker', icon: PieChart, category: 'finance' },
    { id: 'calculators', label: 'Calculators', icon: Calculator, category: 'finance' },
    { id: 'cyber-security', label: 'Cyber Security', icon: Shield, category: 'security' },
    { id: 'education', label: 'Financial Education', icon: GraduationCap, category: 'security' },
    { id: 'alerts', label: 'Alert Settings', icon: Settings, category: 'settings' },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, category: 'settings' },
    { id: 'profile', label: 'Profile', icon: User, category: 'settings' },
    { id: 'privacy', label: 'Privacy Policy', icon: FileCheck, category: 'settings' }
  ]

  const categories = {
    main: 'Investment',
    trading: 'Trading & Analysis',
    finance: 'Financial Planning',
    security: 'Security & Education',
    settings: 'Settings & Support'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'analysis':
        return <StockAnalysis />
      case 'portfolio':
        return <PortfolioTracker />
      case 'alerts':
        return <AlertSettings />
      case 'assistant':
        return <AIAssistant />
      case 'profile':
        return <ProfileSettings />
      case 'add-stock':
        return <AddStock />
      case 'stock-search':
        return <StockSearch />
      case 'calculators':
        return <FinancialCalculators />
      case 'options':
        return <OptionsTrading />
      case 'expenses':
        return <ExpenseTracker />
      case 'ipo':
        return <IPOCenter />
      case 'corporate-events':
        return <CorporateEvents />
      case 'annual-reports':
        return <AnnualReports />
      case 'cyber-security':
        return <CyberSecurity />
      case 'education':
        return <FinancialEducation />
      case 'privacy':
        return <PrivacyPolicy />
      default:
        return <Dashboard />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Finory...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="paytm-card max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gradient mb-2">Finory</h1>
            <p className="text-gray-600 text-lg">Grow more and Know More</p>
          </div>
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-gray-700 mb-4">
              Your comprehensive Indian financial platform for smart investing and financial growth.
            </p>
          </div>
          <button
            onClick={() => blink.auth.login()}
            className="paytm-button-primary w-full"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center ml-4 lg:ml-0">
                <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Finory</h1>
                  <p className="text-xs text-gray-500 -mt-1">Grow more and Know More</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Market Open</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.displayName || user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="px-4 space-y-6">
                {Object.entries(categories).map(([categoryKey, categoryLabel]) => (
                  <div key={categoryKey}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {categoryLabel}
                    </h3>
                    <div className="space-y-1">
                      {navigationItems
                        .filter(item => item.category === categoryKey)
                        .map((item) => {
                          const Icon = item.icon
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as ActiveTab)
                                setSidebarOpen(false)
                              }}
                              className={`
                                paytm-nav-item w-full text-left
                                ${activeTab === item.id ? 'active' : ''}
                              `}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </button>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  © 2024 Finory. All rights reserved.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Powered by Blink
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App