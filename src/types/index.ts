export interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  marketCap: 'large' | 'mid' | 'small'
  sector: string
  futureScore: number
  competitionLevel: 'low' | 'medium' | 'high'
  recommendation: 'buy' | 'sell' | 'hold'
  reasoning: string
  lastUpdated: string
}

export interface Portfolio {
  id: string
  userId: string
  symbol: string
  name: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
  purchaseDate: string
  lastUpdated: string
}

export interface Alert {
  id: string
  userId: string
  type: 'buy' | 'sell'
  symbol: string
  name: string
  price: number
  reasoning: string
  confidence: number
  marketCap: 'large' | 'mid' | 'small'
  createdAt: string
  isRead: boolean
}

export interface UserSettings {
  id: string
  userId: string
  email: string
  mobile: string
  whatsappEnabled: boolean
  emailEnabled: boolean
  mobileEnabled: boolean
  alertThreshold: number
  preferredMarketCaps: ('large' | 'mid' | 'small')[]
  lastUpdated: string
}

export interface TrendInsight {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  timeframe: string
  relatedStocks: string[]
  confidence: number
  createdAt: string
}