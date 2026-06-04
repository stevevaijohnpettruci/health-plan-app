import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// PASTIKAN ANDA IMPORT API-NYA DI SINI
import { lifestyleApi } from '../services/api';

export const Lifestyle = () => {
  const navigate = useNavigate();
  const { completeOnboardingStep } = useAuth();

  // Hapus smokingHabits & activityLevel karena tidak ada di Joi Backend
  const [form, setForm] = useState({
    dietaryPattern: 'High Protein',
    mealsPerDay: 3,
    dailyWaterIntakeGoal: 2000,
    avgSleepHours: 7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi tambahan berdasarkan batasan DB (4 - 12 jam)
    if (form.avgSleepHours < 4 || form.avgSleepHours > 12) {
      setError('Average sleep hours must be between 4 and 12 hours.');
      return;
    }

    setLoading(true);
    try {
      // 1. Susun payload menggunakan format snake_case & pastikan tipe Number
      const payload = {
        dietary_pattern: form.dietaryPattern,
        meals_per_day: Number(form.mealsPerDay),
        daily_water_intake_goal: Number(form.dailyWaterIntakeGoal),
        avg_sleep_hours: Number(form.avgSleepHours),
      };

      // 2. Tembak ke API (pastikan nama import API Anda benar)
      await lifestyleApi(payload);

      // 3. Simpan ke Context
      completeOnboardingStep(form);

      // 4. Lanjut ke step berikutnya
      navigate('/onboarding/health-security');
    } catch (err) {
      setError(
        'Failed to save: ' + (err.response?.data?.message || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

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
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#6B7280',
    marginBottom: 6,
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
          maxWidth: '560px',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          background: '#FFFFFF',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: '',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/favicon.svg"
                alt="Logo"
                style={{ width: 40, height: 40 }}
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
              HealthPlan
            </span>
          </div>
          <span style={{ fontSize: 13, color: '#6B7280' }}>Step 2 of 4</span>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>
              Lifestyle & Diet Habits
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
              Tell us about your daily habits
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Dietary pattern + Meals per day */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div>
                <label style={labelStyle}>Dietary pattern</label>
                <select
                  name="dietaryPattern"
                  value={form.dietaryPattern}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
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
                  type="number"
                  name="mealsPerDay"
                  min="1"
                  max="10"
                  value={form.mealsPerDay}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>

            {/* Water goal + Sleep hours */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div>
                <label style={labelStyle}>Daily water goal (ml)</label>
                <input
                  type="number"
                  name="dailyWaterIntakeGoal"
                  value={form.dailyWaterIntakeGoal}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
              <div>
                <label style={labelStyle}>Avg sleep hours *</label>
                <input
                  type="number"
                  name="avgSleepHours"
                  step="0.1"
                  min="4"
                  max="12"
                  value={form.avgSleepHours}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#F97316')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
            </div>

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

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/onboarding/basic-identity')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
                  fontSize: 13,
                  color: '#6B7280',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 28px',
                  borderRadius: 8,
                  background: loading ? '#FDBA74' : '#F97316',
                  border: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </form>

          {/* Progress */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#6B7280',
                marginBottom: 6,
              }}
            >
              <span>Progress: 2 / 4 steps</span>
              <span style={{ color: '#F97316', fontWeight: 600 }}>50%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 6,
                background: '#F3F4F6',
                borderRadius: 99,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '50%',
                  height: '100%',
                  background: '#F97316',
                  borderRadius: 99,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              {['Basic info', 'Lifestyle', 'Medical', 'Goals'].map(
                (step, i) => (
                  <span
                    key={step}
                    style={{
                      fontSize: 11,
                      fontWeight: i === 1 ? 600 : 400,
                      color: i === 1 ? '#F97316' : '#9CA3AF',
                    }}
                  >
                    {step}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;
