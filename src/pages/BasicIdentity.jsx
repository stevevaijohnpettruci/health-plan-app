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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"> </div>
            <div className="text-white font-semibold">HealthPlan</div>
          </div>
          <div className="text-orange-100 text-sm">Step 1 of 4<span className="h-2 inline-block"/></div>
        </div>

        <div className="p-8 overflow-visible">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Basic identity</h1>
            <p className="text-gray-500 text-sm">Biometric information for your health profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Age *</label>
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

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Gender *</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Weight (kg) *</label>
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
                <label className="block text-sm font-semibold text-gray-600 mb-2">Height (cm) *</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Daily physical activity level *</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 w-full">
              <div>
                <button type="button" onClick={() => navigate('/onboarding')} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg">Back</button>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-orange-600 text-white font-semibold rounded-lg ml-4 shadow-lg hover:shadow-xl transition"
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8">
            <div className="text-sm text-gray-600 mb-2">Progress: 1 / 4 steps <span className="float-right text-orange-600">25%</span></div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div style={{ width: '25%' }} className="bg-orange-500 h-2" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div className="text-orange-600 font-semibold">Basic info</div>
              <div>Lifestyle</div>
              <div>Medical</div>
              <div>Goals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
