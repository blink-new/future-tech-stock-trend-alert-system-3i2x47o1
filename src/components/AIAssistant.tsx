import { useState, useEffect, useRef } from 'react'
import { blink } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Bot, Send, User, Sparkles, TrendingUp, BarChart3, Settings } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Hello! I'm your AI Stock Assistant. I can help you with:

• **Interface Customization** - Change colors, layout, or add new features
• **Stock Analysis** - Get detailed insights on any stock
• **Market Research** - Find emerging trends and opportunities  
• **Portfolio Advice** - Optimize your investment strategy
• **Alert Tuning** - Adjust notification settings and thresholds

What would you like me to help you with today?`,
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Generate AI response with context about the stock system
      const { text } = await blink.ai.generateText({
        prompt: `You are an AI assistant for a Future Tech Stock Alert System. The user has access to:

1. Dashboard with stock recommendations and alerts
2. Stock analysis across large-cap, mid-cap, and small-cap stocks  
3. Portfolio tracker with real-time P&L
4. Alert settings for email, mobile, and WhatsApp notifications
5. This AI assistant for customization and help

The system focuses on tech stocks with future growth potential and low competition. It provides AI-powered buy/sell recommendations with detailed reasoning.

User question: "${inputMessage}"

Provide helpful, specific advice. If they want interface changes, explain what you can help customize. If they ask about stocks, provide analysis. If they need technical help, guide them step by step.

Keep responses conversational and actionable.`,
        search: inputMessage.toLowerCase().includes('stock') || inputMessage.toLowerCase().includes('market') || inputMessage.toLowerCase().includes('trend'),
        maxTokens: 800
      })

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: text,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])

      // If user is asking for interface changes, provide specific suggestions
      if (inputMessage.toLowerCase().includes('change') || inputMessage.toLowerCase().includes('customize') || inputMessage.toLowerCase().includes('interface')) {
        setTimeout(() => {
          const suggestionMessage: Message = {
            id: `suggestion_${Date.now()}`,
            type: 'assistant',
            content: `Here are some specific customizations I can help you implement:

🎨 **Visual Changes:**
• Change color scheme (dark mode, custom brand colors)
• Modify dashboard layout and card arrangements
• Add new charts or data visualizations
• Customize alert notification styles

📊 **Feature Enhancements:**
• Add new stock screening criteria
• Create custom portfolio analytics
• Build sector-specific watchlists
• Implement advanced filtering options

⚙️ **Functionality Updates:**
• Adjust AI analysis parameters
• Create custom alert triggers
• Add new notification channels
• Integrate additional data sources

Just tell me what specific change you'd like, and I'll guide you through it!`,
            timestamp: new Date().toISOString()
          }
          setMessages(prev => [...prev, suggestionMessage])
        }, 1000)
      }

    } catch (error) {
      console.error('Error generating AI response:', error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    {
      icon: TrendingUp,
      label: 'Analyze Market Trends',
      message: 'What are the current market trends I should be aware of?'
    },
    {
      icon: BarChart3,
      label: 'Portfolio Optimization',
      message: 'How can I optimize my current portfolio for better returns?'
    },
    {
      icon: Settings,
      label: 'Customize Interface',
      message: 'I want to customize the dashboard interface and add new features'
    },
    {
      icon: Sparkles,
      label: 'Find Hidden Gems',
      message: 'Help me find undervalued tech stocks with high growth potential'
    }
  ]

  const handleQuickAction = (message: string) => {
    setInputMessage(message)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
          <p className="text-gray-600">Get help with analysis, customization, and optimization</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Bot className="h-3 w-3 mr-1" />
          Online
        </Badge>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                onClick={() => handleQuickAction(action.message)}
              >
                <action.icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Chat with AI Assistant</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about stocks, customization, or analysis..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>AI Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Stock Analysis</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time market trend analysis</li>
                <li>• Company fundamental research</li>
                <li>• Competition assessment</li>
                <li>• Future growth potential scoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Interface Customization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dashboard layout modifications</li>
                <li>• Color scheme adjustments</li>
                <li>• New feature implementations</li>
                <li>• Alert system enhancements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Portfolio Optimization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Risk assessment and balancing</li>
                <li>• Diversification recommendations</li>
                <li>• Performance analytics</li>
                <li>• Rebalancing strategies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Market Intelligence</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Emerging technology trends</li>
                <li>• Sector rotation insights</li>
                <li>• Economic indicator analysis</li>
                <li>• News sentiment tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}