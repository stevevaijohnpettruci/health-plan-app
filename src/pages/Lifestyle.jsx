import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const Lifestyle = () => {
  const navigate = useNavigate()
  const { updateLifestyleAssessment, userProfile } = useApp()
  const { completeOnboardingStep } = useAuth()

  const [form, setForm] = useState({
    dietaryPattern: userProfile?.dietaryPattern || 'High Protein',
    mealsPerDay: userProfile?.mealsPerDay || 3,
    dailyWaterIntakeGoal: userProfile?.dailyWaterIntakeGoal || 2000,
    avgSleepHours: userProfile?.avgSleepHours || 7,
    smokingHabits: userProfile?.smokingHabits || 'No',
    activityLevel: userProfile?.activityLevel || 'Lightly Active'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      updateLifestyleAssessment(form)
      completeOnboardingStep(form)
      navigate('/onboarding/health-security')
    } catch (err) {
      setError('Failed to save: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"> </div>
            <div className="text-white font-semibold">HealthPlan</div>
          </div>
          <div className="text-orange-100 text-sm">Step 2 of 4<span className="h-2 inline-block"/></div>
        </div>

        <div className="p-8 overflow-visible">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Lifestyle & Diet Habits</h1>
            <p className="text-gray-500 text-sm">Tell us about your daily habits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Dietary pattern</label>
                <select
                  name="dietaryPattern"
                  value={form.dietaryPattern}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
                >
                  <option>High Protein</option>
                  <option>Low Protein</option>
                  <option>High Fiber</option>
                  <option>Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Meals per day</label>
                <input
                  type="number"
                  name="mealsPerDay"
                  min="1"
                  max="10"
                  value={form.mealsPerDay}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Daily water goal (ml)</label>
                <input
                  type="number"
                  name="dailyWaterIntakeGoal"
                  value={form.dailyWaterIntakeGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Avg sleep hours</label>
                <input
                  type="number"
                  name="avgSleepHours"
                  value={form.avgSleepHours}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 w-full">
              <div>
                <button type="button" onClick={() => navigate('/onboarding/basic-identity')} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg">Back</button>
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
            <div className="text-sm text-gray-600 mb-2">Progress: 2 / 4 steps <span className="float-right text-orange-600">50%</span></div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div style={{ width: '50%' }} className="bg-orange-500 h-2" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div className="text-gray-500">Basic info</div>
              <div className="text-orange-600 font-semibold">Lifestyle</div>
              <div>Medical</div>
              <div>Goals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lifestyle
