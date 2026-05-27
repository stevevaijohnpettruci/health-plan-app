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

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E5E7EB', borderRadius: 8,
    fontSize: 14, color: '#1A1A1A', background: '#FFFFFF',
    outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#6B7280', marginBottom: 6,
  }

  const sectionTitle = {
    fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 10,
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F3F4F6',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '560px', borderRadius: 16,
        overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', background: '#FFFFFF',
      }}>

        {/* Header */}
        <div style={{
          background: '#F97316', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>HealthPlan</span>
          </div>
          <span style={{ fontSize: 13, color: '#FED7AA' }}>Step 3 of 4</span>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Health Security</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Your medical history and health restrictions</div>
          </div>

          {/* Warning */}
          <div style={{
            padding: '10px 14px', background: '#FFFBEB',
            borderLeft: '3px solid #F59E0B', borderRadius: 6, marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, color: '#B45309', margin: 0 }}>
              Warning: This information is very important to ensure AI recommendations are safe for your health condition.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Medical History */}
            <div>
              <div style={sectionTitle}>Medical History <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(Select applicable)</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {medicalOptions.map(condition => (
                  <label key={condition} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '7px 10px', border: '1.5px solid', borderColor: formData.medicalHistory.includes(condition) ? '#F97316' : '#E5E7EB', borderRadius: 8, background: formData.medicalHistory.includes(condition) ? '#FFF7ED' : '#FFFFFF' }}>
                    <input
                      type="checkbox"
                      checked={formData.medicalHistory.includes(condition)}
                      onChange={() => handleMedicalChange(condition)}
                      style={{ accentColor: '#F97316', width: 14, height: 14 }}
                    />
                    <span style={{ fontSize: 13, color: '#374151' }}>{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Physical Injury */}
            <div>
              <label style={labelStyle}>Physical Injury History <span style={{ fontWeight: 400 }}>(optional)</span></label>
              <textarea
                name="physicalInjuries"
                value={formData.physicalInjuries}
                onChange={handleInputChange}
                placeholder="Example: Knee injury in 2023, Chronic back problems..."
                rows="3"
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Medication */}
            <div>
              <label style={labelStyle}>Current Medication <span style={{ fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text" name="currentMedication"
                value={formData.currentMedication} onChange={handleInputChange}
                placeholder="Example: Metformin, Atorvastatin..."
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Blood Pressure + Heart Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Systolic</label>
                <input
                  type="number" name="systolic" min="60" max="200"
                  value={formData.bloodPressure.systolic} onChange={handleInputChange}
                  placeholder="120" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={labelStyle}>Diastolic</label>
                <input
                  type="number" name="diastolic" min="40" max="150"
                  value={formData.bloodPressure.diastolic} onChange={handleInputChange}
                  placeholder="80" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={labelStyle}>Heart Rate (bpm)</label>
                <input
                  type="number" name="heartRate" min="30" max="200"
                  value={formData.heartRate} onChange={handleInputChange}
                  placeholder="72" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* Allergies */}
            <div>
              <div style={sectionTitle}>Food Allergies <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(Select applicable)</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {commonAllergies.map(allergy => (
                  <label key={allergy} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '7px 10px', border: '1.5px solid', borderColor: formData.allergies.includes(allergy) ? '#F97316' : '#E5E7EB', borderRadius: 8, background: formData.allergies.includes(allergy) ? '#FFF7ED' : '#FFFFFF' }}>
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleAllergyChange(allergy)}
                      style={{ accentColor: '#F97316', width: 14, height: 14 }}
                    />
                    <span style={{ fontSize: 13, color: '#374151' }}>{allergy}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', borderLeft: '3px solid #EF4444', borderRadius: 6 }}>
                <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <button
                type="button"
                onClick={() => navigate('/onboarding/lifestyle')}
                style={{
                  padding: '10px 20px', borderRadius: 8,
                  border: '1px solid #E5E7EB', background: '#FFFFFF',
                  fontSize: 13, color: '#6B7280', cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 28px', borderRadius: 8,
                  background: loading ? '#FDBA74' : '#F97316',
                  border: 'none', color: '#fff',
                  fontSize: 14, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </form>

          {/* Progress */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
              <span>Progress: 3 / 4 steps</span>
              <span style={{ color: '#F97316', fontWeight: 600 }}>75%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', background: '#F97316', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Basic info', 'Lifestyle', 'Medical', 'Goals'].map((step, i) => (
                <span key={step} style={{ fontSize: 11, fontWeight: i === 2 ? 600 : 400, color: i === 2 ? '#F97316' : '#9CA3AF' }}>
                  {step}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}