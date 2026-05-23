import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const GoalSetting = () => {
  const navigate = useNavigate()
  const { updateGoalSetting, userProfile } = useApp()
  const { completeOnboardingStep } = useAuth()
  const [formData, setFormData] = useState({
    primaryGoal: 'Weight Loss',
    targetWeight: userProfile?.targetWeight || '',
    commitmentDays: 5,
    preferredActivities: []
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const goals = ['Weight Loss', 'Muscle Gain', 'Endurance', 'General Well-being']
  const activities = ['Yoga', 'Running', 'Weight Training', 'Walking', 'Swimming', 'Cycling', 'HIIT', 'Pilates']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleActivityToggle = (activity) => {
    setFormData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.targetWeight) {
      setError('Target weight is required')
      return
    }

    if (formData.preferredActivities.length === 0) {
      setError('Select at least one preferred activity')
      return
    }

    const targetWeight = parseFloat(formData.targetWeight)
    if (targetWeight < 30 || targetWeight > 300) {
      setError('Target weight must be between 30-300 kg')
      return
    }

    setLoading(true)
    try {
      updateGoalSetting(formData)
      completeOnboardingStep(formData)
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (err) {
      setError('Failed to save data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              4
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Goals</h1>
          <p className="text-gray-600">Set your commitment and targets</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primary Goal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Primary Health Goal *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {goals.map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, primaryGoal: goal }))}
                  className={`p-4 rounded-lg border-2 transition font-semibold ${
                    formData.primaryGoal === goal
                      ? 'bg-orange-50 border-orange-600 text-orange-600'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {goal === 'Weight Loss' && 'Weight Loss'}
                  {goal === 'Muscle Gain' && 'Muscle Gain'}
                  {goal === 'Endurance' && 'Build Endurance'}
                  {goal === 'General Well-being' && 'General Well-being'}
                </button>
              ))}
            </div>
          </div>

          {/* Target Weight */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Weight (kg) *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                name="targetWeight"
                step="0.1"
                min="30"
                max="300"
                value={formData.targetWeight}
                onChange={handleChange}
                placeholder="Example: 65"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
              <div className="text-right">
                <p className="text-xs text-gray-500">Difference from now:</p>
                <p className="text-xl font-bold text-orange-600">
                  {userProfile?.weight && formData.targetWeight 
                    ? (parseFloat(formData.targetWeight) - userProfile.weight).toFixed(1) 
                    : '-'} kg
                </p>
              </div>
            </div>
          </div>

          {/* Commitment Days */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Komitmen Olahraga Per Minggu *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="commitmentDays"
                min="1"
                max="7"
                value={formData.commitmentDays}
                onChange={handleChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-orange-600">{formData.commitmentDays}</span>
                <span className="text-xs text-gray-600 block">hari/minggu</span>
              </div>
            </div>
            <div className="flex mt-3 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div
                  key={day}
                  className={`flex-1 h-2 rounded ${
                    day <= formData.commitmentDays ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Preferred Activities */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Aktivitas Pilihan (Pilih minimal 1) *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activities.map(activity => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => handleActivityToggle(activity)}
                  className={`p-3 rounded-lg border-2 transition font-medium text-sm ${
                    formData.preferredActivities.includes(activity)
                      ? 'bg-orange-50 border-orange-600 text-orange-600'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-2">Ringkasan Komitmen Anda:</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>Tujuan: <span className="font-semibold">{formData.primaryGoal}</span></li>
              <li>Target Berat: <span className="font-semibold">{formData.targetWeight} kg</span></li>
              <li>Olahraga: <span className="font-semibold">{formData.commitmentDays} hari/minggu</span></li>
              <li>Aktivitas: <span className="font-semibold">{formData.preferredActivities.join(', ')}</span></li>
            </ul>
          </div>

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
              onClick={() => navigate('/onboarding/health-security')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyelesaikan...' : 'Selesai Mendaftar'}
            </button>
          </div>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
          <span className="font-semibold">Progress: 4/4 Langkah - FINAL!</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
