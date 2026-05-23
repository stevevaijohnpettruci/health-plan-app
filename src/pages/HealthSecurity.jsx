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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Security</h1>
          <p className="text-gray-600">Your medical history and health restrictions</p>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-yellow-700 text-sm">
            Warning: This information is very important to ensure AI recommendations are safe for your health condition.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medical History */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Medical History (Select applicable)
            </label>
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

          {/* Physical Injuries */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Physical Injury History (optional)
            </label>
            <textarea
              name="physicalInjuries"
              value={formData.physicalInjuries}
              onChange={handleInputChange}
              placeholder="Example: Knee injury in 2023, Chronic back problems..."
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition resize-none"
            />
          </div>

          {/* Current Medication */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Obat-obatan yang Sedang Dikonsumsi (opsional)
            </label>
            <input
              type="text"
              name="currentMedication"
              value={formData.currentMedication}
              onChange={handleInputChange}
              placeholder="Contoh: Metformin, Atorvastatin..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tekanan Darah (mmHg) - Opsional
            </label>
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
          </div>

          {/* Heart Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detak Jantung Istirahat (bpm) - Opsional
            </label>
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

          {/* Allergies */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Alergi Makanan (Pilih yang sesuai)
            </label>
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
              onClick={() => navigate('/onboarding/lifestyle')}
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
          <span className="font-semibold">Progress: 3/4 Langkah</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
