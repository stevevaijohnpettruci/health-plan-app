import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    try {
      const success = login(formData.email, formData.password)
      if (success) {
        navigate('/')
      } else {
        setError('Email or password is incorrect')
      }
    } catch (err) {
      setError('Login failed: ' + err.message)
    } finally {
      setLoading(false)
    }
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
        maxWidth: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        background: '#FFFFFF',
      }}>

        {/* Header orange */}
        <div style={{
          background: '#F97316',
          padding: '32px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 48, height: 48,
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>HealthPlan</div>
          <div style={{ fontSize: 13, color: '#FED7AA', marginTop: 4 }}>Optimize your healthy lifestyle</div>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Sign in</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Access your health dashboard</div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #E5E7EB', borderRadius: 8,
                  fontSize: 14, color: '#1A1A1A', background: '#FFFFFF',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid #E5E7EB', borderRadius: 8,
                  fontSize: 14, color: '#1A1A1A', background: '#FFFFFF',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: '#FEF2F2',
                borderLeft: '3px solid #EF4444',
                borderRadius: 6,
              }}>
                <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px',
                background: loading ? '#FDBA74' : '#F97316',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Processing...' : 'Sign in'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>

            <button
              type="button"
              style={{
                width: '100%', padding: '10px',
                background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8,
                fontSize: 13, color: '#374151', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>Don't have an account? </span>
            <button
              onClick={() => navigate('/register')}
              style={{ fontSize: 13, color: '#F97316', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign up
            </button>
          </div>

          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#C2410C', marginBottom: 4 }}>Demo account</div>
            <div style={{ fontSize: 12, color: '#EA580C' }}>Email: zaky.ambadar@email.com</div>
            <div style={{ fontSize: 12, color: '#EA580C' }}>Password: password123</div>
          </div>
        </div>
      </div>
    </div>
  )
}