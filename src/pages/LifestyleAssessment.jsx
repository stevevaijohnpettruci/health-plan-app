import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const LifestyleAssessment = () => {
  const navigate = useNavigate()
  const { updateLifestyleAssessment } = useApp()
  const { completeOnboardingStep } = useAuth()
  const [formData, setFormData] = useState({
    dietaryPattern: 'High Protein',
    mealsPerDay: 3,
    dailyWaterIntakeGoal: 2000,
    avgSleepHours: 7
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.mealsPerDay || !formData.dailyWaterIntakeGoal || !formData.avgSleepHours) {
      setError('All fields are required')
      return
    }

    if (formData.avgSleepHours < 4 || formData.avgSleepHours > 12) {
      setError('Sleep duration must be between 4-12 hours')
      return
    }

    setLoading(true)
    try {
      updateLifestyleAssessment(formData)
      completeOnboardingStep(formData)
      navigate('/onboarding/health-security')
    } catch (err) {
      setError('Failed to save data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const dietaryPatterns = [
    'Low Cholesterol',
    'Low Protein',
    'High Protein',
    'Very Low Carbs',
    'High Fiber',
    'Vegan',
    'Egg Free',
    'Dairy Free',
    'Gluten Free',
    'Kosher',
    'Lactose Free'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lifestyle Assessment</h1>
          <p className="text-gray-600">Your eating patterns and daily routines</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dietary Pattern */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dietary Pattern *
            </label>
            <select
              name="dietaryPattern"
              value={formData.dietaryPattern}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
            >
              {dietaryPatterns.map(pattern => (
                <option key={pattern} value={pattern}>
                  {pattern}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">Choose a dietary pattern that matches your preferences</p>
          </div>

          {/* Meals Per Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daily Meal Frequency *
              </label>
              <input
                type="number"
                name="mealsPerDay"
                min="1"
                max="6"
                value={formData.mealsPerDay}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
              <p className="text-xs text-gray-500 mt-2">How many times do you eat per day?</p>
            </div>

            {/* Daily Water Intake */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daily Water Intake Goal (ml/day) *
              </label>
              <input
                type="number"
                name="dailyWaterIntakeGoal"
                step="100"
                min="500"
                max="4000"
                value={formData.dailyWaterIntakeGoal}
                onChange={handleChange}
                placeholder="Example: 2000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
              <p className="text-xs text-gray-500 mt-2">Standard: 8 glasses = 2000ml</p>
            </div>
          </div>

          {/* Average Sleep Hours */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Average Daily Sleep Hours (4-12 hours) *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="avgSleepHours"
                min="4"
                max="12"
                step="0.5"
                value={formData.avgSleepHours}
                onChange={handleChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-orange-600">{formData.avgSleepHours}</span>
                <span className="text-xs text-gray-600 block">hrs</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Drag to set your average sleep duration</p>
          </div>

          {/* Smoking Habits - REMOVED: Smoking habits section is now hidden */}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/onboarding/basic-identity')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Lanjut'}
            </button>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
          <span className="font-semibold">Progress: 2/4 Langkah</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
