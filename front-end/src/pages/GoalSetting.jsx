import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  healthGoalsApi,
  generateDailyPlanApi,
  updateOnboardingStatus,
} from '../services/api'; // tambah import
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';

export const GoalSetting = () => {
  const navigate = useNavigate();

  const { completeOnboardingStep } = useAuth();
  const { userProfile } = useApp();

  const [formData, setFormData] = useState({
    primaryGoal: 'Weight Loss',
    targetWeight: '',
    commitmentDays: 5,
    preferredActivities: [],
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goals = [
    'Weight Loss',
    'Muscle Gain',
    'Endurance',
    'General Well-being',
  ];

  const activities = [
    'Yoga',
    'Running',
    'Weight Training',
    'Walking',
    'Swimming',
    'Cycling',
    'HIIT',
    'Pilates',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  };

  const handleActivityToggle = (activity) => {
    setFormData((prev) => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter((a) => a !== activity)
        : [...prev.preferredActivities, activity],
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.targetWeight) {
      setError('Target weight is required');
      return;
    }

    if (formData.preferredActivities.length === 0) {
      setError('Select at least one preferred activity');
      return;
    }

    const targetWeight = Number(formData.targetWeight);

    if (targetWeight < 30 || targetWeight > 300) {
      setError('Target weight must be between 30-300 kg');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        primary_goal: formData.primaryGoal,
        target_weight_kg: Number(formData.targetWeight),
        commitment_days: Number(formData.commitmentDays),
        preferred_activity: formData.preferredActivities.join(', '),
      };

      // 1. Simpan goal setting
      await healthGoalsApi(payload);
      await updateOnboardingStatus(); // Update status onboarding di backend
      // 2. Save onboarding step
      completeOnboardingStep(payload);

      // 3. Generate AI recommendation di background — tidak di-await
      // User langsung redirect, AI jalan sendiri
      const today = new Date().toISOString().split('T')[0];
      generateDailyPlanApi(today).catch((err) =>
        console.warn('AI generation failed silently:', err),
      );

      // 4. Redirect ke dashboard
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Failed to save data',
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
    marginBottom: 8,
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
          <span style={{ fontSize: 13, color: '#6B7280' }}>Step 4 of 4</span>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              Health Goals
            </div>

            <div
              style={{
                fontSize: 13,
                color: '#9CA3AF',
                marginTop: 4,
              }}
            >
              Set your commitment and targets
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {/* Primary Goal */}
            <div>
              <label style={labelStyle}>Primary Health Goal *</label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryGoal: goal,
                      }))
                    }
                    style={{
                      padding: '12px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: `1.5px solid ${
                        formData.primaryGoal === goal ? '#F97316' : '#E5E7EB'
                      }`,
                      background:
                        formData.primaryGoal === goal ? '#FFF7ED' : '#FAFAFA',
                      color:
                        formData.primaryGoal === goal ? '#C2410C' : '#6B7280',
                      fontSize: 13,
                      fontWeight: formData.primaryGoal === goal ? 600 : 400,
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

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <input
                  type="number"
                  name="targetWeight"
                  step="0.1"
                  min="30"
                  max="300"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  placeholder="Example: 65"
                  style={{
                    ...inputStyle,
                    flex: 1,
                  }}
                />

                <div
                  style={{
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                    }}
                  >
                    Difference from now:
                  </div>

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#F97316',
                    }}
                  >
                    {userProfile?.weight && formData.targetWeight
                      ? (
                          Number(formData.targetWeight) -
                          Number(userProfile.weight)
                        ).toFixed(1)
                      : '-'}{' '}
                    kg
                  </div>
                </div>
              </div>
            </div>

            {/* Commitment */}
            <div>
              <label style={labelStyle}>Exercise per Week *</label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <input
                  type="range"
                  name="commitmentDays"
                  min="1"
                  max="7"
                  value={formData.commitmentDays}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    accentColor: '#F97316',
                  }}
                />

                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#F97316',
                    }}
                  >
                    {formData.commitmentDays}
                  </span>

                  <span
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      display: 'block',
                    }}
                  >
                    days/week
                  </span>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div>
              <label style={labelStyle}>Preferred Activities *</label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
              >
                {activities.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleActivityToggle(activity)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: `1.5px solid ${
                        formData.preferredActivities.includes(activity)
                          ? '#F97316'
                          : '#E5E7EB'
                      }`,
                      background: formData.preferredActivities.includes(
                        activity,
                      )
                        ? '#FFF7ED'
                        : '#FAFAFA',
                      color: formData.preferredActivities.includes(activity)
                        ? '#C2410C'
                        : '#6B7280',
                      fontSize: 13,
                      fontWeight: formData.preferredActivities.includes(
                        activity,
                      )
                        ? 600
                        : 400,
                    }}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#FEF2F2',
                  borderLeft: '3px solid #EF4444',
                  borderRadius: 6,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: '#DC2626',
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/onboarding/health-security')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  background: '#FFFFFF',
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
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Finish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
