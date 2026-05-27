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
    { value: 'Extra Active', label: 'Extra Active (Very active)' },
  ]

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#1A1A1A',
    background: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#6B7280',
    marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        background: '#FFFFFF',
      }}>

        {/* Header */}
        <div style={{
          background: '#F97316',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <span style={{ fontSize: 13, color: '#FED7AA' }}>Step 1 of 4</span>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Fill your profile</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Biometric information for your health profile</div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Age + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Age *</label>
                <input
                  type="number" name="age" min="18" max="120"
                  value={formData.age} onChange={handleChange}
                  placeholder="Example: 24"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={labelStyle}>Gender *</label>
                <select
                  name="gender" value={formData.gender} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Weight + Height */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Weight (kg) *</label>
                <input
                  type="number" name="weight" step="0.1" min="30" max="300"
                  value={formData.weight} onChange={handleChange}
                  placeholder="Example: 68"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={labelStyle}>Height (cm) *</label>
                <input
                  type="number" name="height" min="100" max="250"
                  value={formData.height} onChange={handleChange}
                  placeholder="Example: 170"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label style={labelStyle}>Daily physical activity level *</label>
              <select
                name="activityLevel" value={formData.activityLevel} onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', borderLeft: '3px solid #EF4444', borderRadius: 6 }}>
                <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
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
              <span>Progress: 1 / 4 steps</span>
              <span style={{ color: '#F97316', fontWeight: 600 }}>25%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '25%', height: '100%', background: '#F97316', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Basic info', 'Lifestyle', 'Medical', 'Goals'].map((step, i) => (
                <span key={step} style={{ fontSize: 11, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#F97316' : '#9CA3AF' }}>
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