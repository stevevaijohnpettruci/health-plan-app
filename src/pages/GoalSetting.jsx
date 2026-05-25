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

  const handlePreferredActivitiesChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(o => o.value)
    setFormData(prev => ({ ...prev, preferredActivities: options }))
    setError('')
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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"> </div>
            <div className="text-white font-semibold">HealthPlan</div>
          </div>
          <div className="text-orange-100 text-sm">Step 4 of 4<span className="h-2 inline-block"/></div>
        </div>

        <div className="p-8 overflow-visible">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Health Goals</h1>
            <p className="text-gray-500 text-sm">Set your commitment and targets</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Primary Health Goal *</label>
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
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Target Weight (kg) *</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Komitmen Olahraga Per Minggu *</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Aktivitas Pilihan (Pilih minimal 1) *</label>
              <select
                name="preferredActivities"
                multiple
                size={4}
                value={formData.preferredActivities}
                onChange={handlePreferredActivitiesChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              >
                {activities.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Tekan Ctrl (Windows) / Cmd (Mac) untuk memilih beberapa aktivitas.</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Ringkasan Komitmen Anda:</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>Tujuan: <span className="font-semibold">{formData.primaryGoal}</span></li>
                <li>Target Berat: <span className="font-semibold">{formData.targetWeight} kg</span></li>
                <li>Olahraga: <span className="font-semibold">{formData.commitmentDays} hari/minggu</span></li>
                <li>Aktivitas: <span className="font-semibold">{formData.preferredActivities.join(', ')}</span></li>
              </ul>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 w-full">
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/onboarding/health-security')}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Kembali
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-orange-600 text-white font-semibold rounded-lg ml-4 shadow-lg hover:shadow-xl transition"
                >
                  {loading ? 'Menyelesaikan...' : 'Selesai Mendaftar'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8">
            <div className="text-sm text-gray-600 mb-2">Progress: 4 / 4 steps <span className="float-right text-orange-600">100%</span></div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div style={{ width: '100%' }} className="bg-orange-500 h-2" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div>Basic info</div>
              <div>Lifestyle</div>
              <div>Medical</div>
              <div className="text-orange-600 font-semibold">Goals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
