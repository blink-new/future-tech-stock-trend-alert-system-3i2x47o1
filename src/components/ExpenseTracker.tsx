import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '../blink/client'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  PieChart,
  Calendar,
  Filter,
  AlertTriangle,
  Target,
  IndianRupee
} from 'lucide-react'

const blink = createClient({
  projectId: 'future-tech-stock-trend-alert-system-3i2x47o1',
  authRequired: true
})

interface Expense {
  id: string
  user_id: string
  category: string
  subcategory: string
  amount: number
  description: string
  date: string
  payment_method: string
  is_recurring: boolean
  recurring_frequency: string
  tags: string
}

interface Budget {
  id: string
  user_id: string
  category: string
  monthly_limit: number
  current_spent: number
  alert_threshold: number
  is_active: boolean
}

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: '',
    subcategory: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'UPI'
  })

  const categories = [
    'Food & Dining',
    'Transportation',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Investment',
    'Insurance',
    'Others'
  ]

  const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking']

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      // Load expenses
      const expensesData = await blink.db.expenses.list({
        where: { user_id: user.id },
        orderBy: { date: 'desc' },
        limit: 100
      })
      setExpenses(expensesData)

      // Load budgets
      const budgetsData = await blink.db.budgets.list({
        where: { user_id: user.id, is_active: "1" }
      })
      setBudgets(budgetsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const addExpense = async () => {
    try {
      const user = await blink.auth.me()
      const expense = {
        id: `exp_${Date.now()}`,
        user_id: user.id,
        category: newExpense.category,
        subcategory: newExpense.subcategory,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: newExpense.date,
        payment_method: newExpense.payment_method,
        is_recurring: false,
        recurring_frequency: '',
        tags: JSON.stringify([])
      }

      await blink.db.expenses.create(expense)
      setExpenses(prev => [expense, ...prev])
      setNewExpense({
        category: '',
        subcategory: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'UPI'
      })
      setShowAddExpense(false)
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    }).reduce((total, expense) => total + expense.amount, 0)
  }

  const getCategoryExpenses = () => {
    const categoryTotals: { [key: string]: number } = {}
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
    })
    return categoryTotals
  }

  const getBudgetAlerts = () => {
    const categoryExpenses = getCategoryExpenses()
    return budgets.filter(budget => {
      const spent = categoryExpenses[budget.category] || 0
      const percentage = (spent / budget.monthly_limit) * 100
      return percentage >= budget.alert_threshold
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600">Track your spending and manage budgets effectively</p>
        </div>
        <Button 
          onClick={() => setShowAddExpense(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Budget Alerts */}
      {getBudgetAlerts().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Budget Alerts ({getBudgetAlerts().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getBudgetAlerts().map(alert => {
                const spent = getCategoryExpenses()[alert.category] || 0
                const percentage = (spent / alert.monthly_limit) * 100
                return (
                  <div key={alert.id} className="bg-white p-3 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{alert.category}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          ₹{spent.toLocaleString('en-IN')} / ₹{alert.monthly_limit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <Badge variant="destructive">{percentage.toFixed(0)}%</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{getTotalExpenses().toLocaleString('en-IN')}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{getMonthlyExpenses().toLocaleString('en-IN')}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(getCategoryExpenses()).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
          <TabsTrigger value="budgets">Budget Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 10).map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-600">
                          {expense.category} • {new Date(expense.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{expense.amount.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-gray-600">{expense.payment_method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(budget => {
              const spent = getCategoryExpenses()[budget.category] || 0
              const percentage = (spent / budget.monthly_limit) * 100
              const remaining = budget.monthly_limit - spent
              
              return (
                <Card key={budget.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-medium">₹{spent.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget</span>
                        <span className="font-medium">₹{budget.monthly_limit.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Remaining</span>
                        <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{Math.abs(remaining).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <span className={`text-sm font-medium ${percentage > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                          {percentage.toFixed(1)}% used
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(getCategoryExpenses()).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{category}</span>
                      <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Smart Tip</h4>
                    <p className="text-sm text-blue-700">
                      Your highest spending category is {Object.entries(getCategoryExpenses()).sort(([,a], [,b]) => b - a)[0]?.[0]}. 
                      Consider setting a budget to control expenses.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">🎯 Goal</h4>
                    <p className="text-sm text-green-700">
                      Try to save 20% of your monthly income. Current monthly expenses: ₹{getMonthlyExpenses().toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <Input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What did you spend on?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={newExpense.payment_method}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, payment_method: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowAddExpense(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addExpense}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={!newExpense.category || !newExpense.amount || !newExpense.description}
              >
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseTracker