import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const HealthSecurity = () => {
  const navigate = useNavigate()
  const { updateHealthSecurity } = useApp()
  const { completeOnboardingStep } = useAuth()
  const [formData, setFormData] = useState({
    medicalHistory: [],
    physicalInjuries: '',
    currentMedication: '',
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    allergies: []
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const medicalOptions = ['Hypertension', 'Diabetes', 'Asthma', 'Cholesterol', 'Heart Disease', 'Other']
  const commonAllergies = ['Peanuts', 'Gluten', 'Dairy', 'Eggs', 'Shellfish', 'Tree Nuts', 'Fish', 'Soy']

  const handleMedicalChange = (condition) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.includes(condition)
        ? prev.medicalHistory.filter(c => c !== condition)
        : [...prev.medicalHistory, condition]
    }))
  }

  const handleAllergyChange = (allergy) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'systolic' || name === 'diastolic') {
      setFormData(prev => ({
        ...prev,
        bloodPressure: { ...prev.bloodPressure, [name]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (formData.bloodPressure.systolic && formData.bloodPressure.diastolic) {
      const systolic = parseInt(formData.bloodPressure.systolic)
      const diastolic = parseInt(formData.bloodPressure.diastolic)
      if (systolic < 60 || systolic > 200 || diastolic < 40 || diastolic > 150) {
        setError('Invalid blood pressure')
        return
      }
    }

    if (formData.heartRate && (formData.heartRate < 30 || formData.heartRate > 200)) {
      setError('Heart rate must be between 30-200 bpm')
      return
    }

    setLoading(true)
    try {
      updateHealthSecurity({
        ...formData,
        bloodPressure: formData.bloodPressure.systolic && formData.bloodPressure.diastolic 
          ? { systolic: parseInt(formData.bloodPressure.systolic), diastolic: parseInt(formData.bloodPressure.diastolic) }
          : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null
      })
      completeOnboardingStep(formData)
      navigate('/onboarding/goal-setting')
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
          <div className="text-orange-100 text-sm">Step 3 of 4<span className="h-2 inline-block"/></div>
        </div>

        <div className="p-8 overflow-visible">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Health Security</h1>
            <p className="text-gray-500 text-sm">Your medical history and health restrictions</p>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-yellow-700 text-sm">
              Warning: This information is very important to ensure AI recommendations are safe for your health condition.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Medical History (Select applicable)</label>
              <div className="space-y-2">
                {medicalOptions.map(condition => (
                  <label key={condition} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.includes(condition)}
                      onChange={() => handleMedicalChange(condition)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Physical Injury History (optional)</label>
              <textarea
                name="physicalInjuries"
                value={formData.physicalInjuries}
                onChange={handleInputChange}
                placeholder="Example: Knee injury in 2023, Chronic back problems..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Obat-obatan yang Sedang Dikonsumsi (opsional)</label>
              <input
                type="text"
                name="currentMedication"
                value={formData.currentMedication}
                onChange={handleInputChange}
                placeholder="Contoh: Metformin, Atorvastatin..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Sistolik</label>
                <input
                  type="number"
                  name="systolic"
                  min="60"
                  max="200"
                  value={formData.bloodPressure.systolic}
                  onChange={handleInputChange}
                  placeholder="120"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Diastolik</label>
                <input
                  type="number"
                  name="diastolic"
                  min="40"
                  max="150"
                  value={formData.bloodPressure.diastolic}
                  onChange={handleInputChange}
                  placeholder="80"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Detak Jantung Istirahat (bpm) - Opsional</label>
              <input
                type="number"
                name="heartRate"
                min="30"
                max="200"
                value={formData.heartRate}
                onChange={handleInputChange}
                placeholder="Contoh: 72"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Alergi Makanan (Pilih yang sesuai)</label>
              <div className="grid grid-cols-2 gap-2">
                {commonAllergies.map(allergy => (
                  <label key={allergy} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleAllergyChange(allergy)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="ml-2 text-gray-700 text-sm">{allergy}</span>
                  </label>
                ))}
              </div>
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
                  onClick={() => navigate('/onboarding/lifestyle')}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Kembali
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 text-white font-bold py-3 px-6 rounded-lg ml-4 shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Menyimpan...' : 'Lanjut'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8">
            <div className="text-sm text-gray-600 mb-2">Progress: 3 / 4 steps <span className="float-right text-orange-600">75%</span></div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
              <div style={{ width: '75%' }} className="bg-orange-500 h-2" />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <div>Basic info</div>
              <div>Lifestyle</div>
              <div className="text-orange-600 font-semibold">Medical</div>
              <div>Goals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
