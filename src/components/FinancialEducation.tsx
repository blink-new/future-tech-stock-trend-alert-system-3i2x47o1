import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { GraduationCap, Clock, Eye, Heart, BookOpen, TrendingUp } from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface EducationContent {
  id: string
  category: string
  title: string
  content: string
  difficulty_level: string
  estimated_read_time: number
  tags: string
  is_premium: boolean
  views: number
  likes: number
}

const FinancialEducation: React.FC = () => {
  const [content, setContent] = useState<EducationContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<EducationContent | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Basics', 'Options', 'IPO', 'Debt Management', 'Advanced']

  const loadContent = useCallback(async () => {
    setLoading(true)
    try {
      const contentData = await blink.db.financial_education.list({
        orderBy: { views: 'desc' },
        limit: 20
      })
      setContent(contentData)
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredContent = selectedCategory === 'All' 
    ? content 
    : content.filter(item => item.category === selectedCategory)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Education</h1>
        <p className="text-gray-600">Learn finance and manage your money effectively</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedContent(item)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{item.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getDifficultyColor(item.difficulty_level)}>
                      {item.difficulty_level}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                    {item.is_premium && (
                      <Badge className="bg-orange-100 text-orange-800">Premium</Badge>
                    )}
                  </div>
                </div>
                <GraduationCap className="h-6 w-6 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.content.substring(0, 120)}...
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.estimated_read_time} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debt Management Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Debt Trap Prevention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-red-900 mb-3">Warning Signs</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Using credit cards for basic expenses</li>
                <li>• Making only minimum payments</li>
                <li>• Taking loans to pay other loans</li>
                <li>• Credit utilization above 30%</li>
                <li>• Multiple loan applications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-red-900 mb-3">Prevention Tips</h3>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Create and stick to a budget</li>
                <li>• Build an emergency fund</li>
                <li>• Pay credit card bills in full</li>
                <li>• Avoid unnecessary loans</li>
                <li>• Track all expenses regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedContent.title}</h2>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(selectedContent.difficulty_level)}>
                    {selectedContent.difficulty_level}
                  </Badge>
                  <Badge variant="outline">{selectedContent.category}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{selectedContent.estimated_read_time} min read</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedContent(null)}>
                Close
              </Button>
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedContent.content}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{selectedContent.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{selectedContent.likes} likes</span>
                </div>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Heart className="h-4 w-4 mr-2" />
                Like Article
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinancialEducation