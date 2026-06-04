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
    if (!formData.targetWeight) { setError('Target weight is required'); return }
    if (formData.preferredActivities.length === 0) { setError('Select at least one preferred activity'); return }
    const targetWeight = parseFloat(formData.targetWeight)
    if (targetWeight < 30 || targetWeight > 300) { setError('Target weight must be between 30-300 kg'); return }
    setLoading(true)
    try {
      updateGoalSetting(formData)
      completeOnboardingStep(formData)
      setTimeout(() => navigate('/'), 500)
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
    color: '#6B7280', marginBottom: 8,
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
          <span style={{ fontSize: 13, color: '#FED7AA' }}>Step 4 of 4</span>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Health Goals</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Set your commitment and targets</div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Primary Goal */}
            <div>
              <label style={labelStyle}>Primary Health Goal *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {goals.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, primaryGoal: goal }))}
                    style={{
                      padding: '12px 10px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${formData.primaryGoal === goal ? '#F97316' : '#E5E7EB'}`,
                      background: formData.primaryGoal === goal ? '#FFF7ED' : '#FAFAFA',
                      color: formData.primaryGoal === goal ? '#C2410C' : '#6B7280',
                      fontSize: 13, fontWeight: formData.primaryGoal === goal ? 600 : 400,
                      transition: 'all 0.15s',
                    }}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Weight */}
            <div>
              <label style={labelStyle}>Target Weight (kg) *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <input
                  type="number" name="targetWeight" step="0.1" min="30" max="300"
                  value={formData.targetWeight} onChange={handleChange}
                  placeholder="Example: 65"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>Difference from now:</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#F97316' }}>
                    {userProfile?.weight && formData.targetWeight
                      ? (parseFloat(formData.targetWeight) - userProfile.weight).toFixed(1)
                      : '-'} kg
                  </div>
                </div>
              </div>
            </div>

            {/* Commitment Days */}
            <div>
              <label style={labelStyle}>Exercise per Week *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <input
                  type="range" name="commitmentDays" min="1" max="7"
                  value={formData.commitmentDays} onChange={handleChange}
                  style={{ flex: 1, accentColor: '#F97316', height: 4, cursor: 'pointer' }}
                />
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#F97316' }}>{formData.commitmentDays}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block' }}>days/week</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[1,2,3,4,5,6,7].map(day => (
                  <div key={day} style={{
                    flex: 1, height: 6, borderRadius: 99,
                    background: day <= formData.commitmentDays ? '#F97316' : '#F3F4F6',
                  }} />
                ))}
              </div>
            </div>

            {/* Preferred Activities */}
            <div>
              <label style={labelStyle}>Preferred Activities * <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(Select at least 1)</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {activities.map(activity => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleActivityToggle(activity)}
                    style={{
                      padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${formData.preferredActivities.includes(activity) ? '#F97316' : '#E5E7EB'}`,
                      background: formData.preferredActivities.includes(activity) ? '#FFF7ED' : '#FAFAFA',
                      color: formData.preferredActivities.includes(activity) ? '#C2410C' : '#6B7280',
                      fontSize: 13, fontWeight: formData.preferredActivities.includes(activity) ? 600 : 400,
                      textAlign: 'left', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `1.5px solid ${formData.preferredActivities.includes(activity) ? '#F97316' : '#D1D5DB'}`,
                      background: formData.preferredActivities.includes(activity) ? '#F97316' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {formData.preferredActivities.includes(activity) && (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: '12px 16px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#C2410C', marginBottom: 8 }}>Commitment Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { label: 'Goal', value: formData.primaryGoal },
                  { label: 'Target Weight', value: formData.targetWeight ? `${formData.targetWeight} kg` : '-' },
                  { label: 'Exercise', value: `${formData.commitmentDays} days/week` },
                  { label: 'Activities', value: formData.preferredActivities.length > 0 ? formData.preferredActivities.join(', ') : '-' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ fontSize: 12, color: '#EA580C' }}>
                    {label}: <span style={{ fontWeight: 600 }}>{value}</span>
                  </div>
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
                onClick={() => navigate('/onboarding/health-security')}
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
                {loading ? 'Saving...' : 'Finish'}
              </button>
            </div>
          </form>

          {/* Progress */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
              <span>Progress: 4 / 4 steps</span>
              <span style={{ color: '#F97316', fontWeight: 600 }}>100%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#F97316', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Basic info', 'Lifestyle', 'Medical', 'Goals'].map((step, i) => (
                <span key={step} style={{ fontSize: 11, fontWeight: i === 3 ? 600 : 400, color: i === 3 ? '#F97316' : '#9CA3AF' }}>
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