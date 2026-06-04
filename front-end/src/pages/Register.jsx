import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData.fullName, formData.email, formData.password);
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#1A1A1A',
    background: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          background: '#FFFFFF',
        }}
      >
        {/* Header orange */}
        <div
          style={{
            background: '',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: 'rgba(255,255,255,0.25)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <img
              src="/favicon.svg"
              alt="Logo"
              style={{ width: 50, height: 50 }}
            />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>
            HealthPlan
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            Optimize your healthy lifestyle
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>
              Create account
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
              Start your health journey today
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {[
              {
                label: 'Full name',
                name: 'fullName',
                type: 'text',
                placeholder: 'Enter your full name',
              },
              {
                label: 'Email address',
                name: 'email',
                type: 'email',
                placeholder: 'Enter your email',
              },
              {
                label: 'Password',
                name: 'password',
                type: 'password',
                placeholder: 'At least 6 characters',
              },
              {
                label: 'Confirm password',
                name: 'confirmPassword',
                type: 'password',
                placeholder: 'Re-enter your password',
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#6B7280',
                    marginBottom: 6,
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            ))}

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#FEF2F2',
                  borderLeft: '3px solid #EF4444',
                  borderRadius: 6,
                }}
              >
                <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                background: loading ? '#FDBA74' : '#F97316',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Processing...' : 'Create account'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            </div>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>
              Already have an account?{' '}
            </span>
            <button
              onClick={() => navigate('/login')}
              style={{
                fontSize: 13,
                color: '#F97316',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
