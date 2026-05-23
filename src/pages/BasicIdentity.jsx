import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const BasicIdentity = () => {
  const navigate = useNavigate()
  const { updateBasicIdentity } = useApp()
  const { completeOnboardingStep } = useAuth()
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    weight: '',
    height: '',
    activityLevel: 'Lightly Active'
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

    if (!formData.age || !formData.weight || !formData.height) {
      setError('All fields are required')
      return
    }

    if (formData.age < 18 || formData.age > 120) {
      setError('Age must be between 18-120 years')
      return
    }

    setLoading(true)
    try {
      updateBasicIdentity(formData)
      completeOnboardingStep(formData)
      navigate('/onboarding/lifestyle')
    } catch (err) {
      setError('Failed to save data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const activityLevels = [
    { value: 'Sedentary', label: 'Sedentary (Little/No activity)' },
    { value: 'Lightly Active', label: 'Lightly Active (Light)' },
    { value: 'Moderately Active', label: 'Moderately Active (Moderate)' },
    { value: 'Very Active', label: 'Very Active (Active)' },
    { value: 'Extra Active', label: 'Extra Active (Very active)' }
  ]

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Basic Identity</h1>
          <p className="text-gray-600">Biometric information for your health profile</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                min="18"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="Example: 24"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                step="0.1"
                min="30"
                max="300"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Example: 68"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                min="100"
                max="250"
                value={formData.height}
                onChange={handleChange}
                placeholder="Example: 170"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Daily Physical Activity Level *
            </label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
            >
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6 justify-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
          <span className="font-semibold">Progress: 1/4 Steps</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
