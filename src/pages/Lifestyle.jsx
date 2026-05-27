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
          <span style={{ fontSize: 13, color: '#FED7AA' }}>Step 2 of 4</span>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Lifestyle & Diet Habits</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Tell us about your daily habits</div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Dietary pattern + Meals per day */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Dietary pattern</label>
                <select
                  name="dietaryPattern" value={form.dietaryPattern} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                >
                  <option>High Protein</option>
                  <option>Low Protein</option>
                  <option>High Fiber</option>
                  <option>Vegan</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Meals per day</label>
                <input
                  type="number" name="mealsPerDay" min="1" max="10"
                  value={form.mealsPerDay} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* Water goal + Sleep hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Daily water goal (ml)</label>
                <input
                  type="number" name="dailyWaterIntakeGoal"
                  value={form.dailyWaterIntakeGoal} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
              <div>
                <label style={labelStyle}>Avg sleep hours</label>
                <input
                  type="number" name="avgSleepHours"
                  value={form.avgSleepHours} onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
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
                onClick={() => navigate('/onboarding/basic-identity')}
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
              <span>Progress: 2 / 4 steps</span>
              <span style={{ color: '#F97316', fontWeight: 600 }}>50%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '50%', height: '100%', background: '#F97316', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Basic info', 'Lifestyle', 'Medical', 'Goals'].map((step, i) => (
                <span key={step} style={{ fontSize: 11, fontWeight: i === 1 ? 600 : 400, color: i === 1 ? '#F97316' : '#9CA3AF' }}>
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

export default Lifestyle