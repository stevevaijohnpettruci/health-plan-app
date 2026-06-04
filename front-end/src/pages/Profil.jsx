import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import {
  updateUserProfile,
  updateBasicIdentity as updateBasicIdentityApi,
} from '../services/api.js';

const TAB_LIST = [
  { key: 'general', label: 'General Info' },
  { key: 'health', label: 'Health' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'goals', label: 'Goals' },
  { key: 'settings', label: 'Settings' },
];

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' }}>
    <span style={{ fontSize: 13, color: '#9CA3AF' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A' }}>{value || '-'}</span>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const inputStyle = (editing) => ({
  width: '100%',
  padding: '9px 12px',
  border: `1.5px solid ${editing ? '#F97316' : '#F0F0F0'}`,
  borderRadius: 8,
  fontSize: 13,
  color: editing ? '#1A1A1A' : '#6B7280',
  background: editing ? '#FFFFFF' : '#FAFAFA',
  outline: 'none',
  cursor: editing ? 'text' : 'not-allowed',
  boxSizing: 'border-box',
});

export const Profil = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { userProfile, fetchUserProfile } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { setFormData(userProfile); }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await Promise.all([
        updateUserProfile({ fullname: formData.fullName }),
        updateBasicIdentityApi({
          age: parseInt(formData.age),
          gender: formData.gender,
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          activity_level: formData.activityLevel,
        }),
      ]);
      if (typeof fetchUserProfile === 'function') await fetchUserProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err.response?.data || err.message);
    }
  };

  const handleCancel = () => { setFormData(userProfile); setIsEditing(false); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = userProfile?.fullName
    ? userProfile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header banner */}
      <div style={{ background: '#F97316', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{userProfile?.fullName}</div>
            <div style={{ fontSize: 12, color: '#FED7AA', marginTop: 2 }}>{userProfile?.email}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2px 10px', borderRadius: 99 }}>
                BMI {userProfile?.bmi?.toFixed(1)} · {userProfile?.bmiCategory}
              </span>
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2px 10px', borderRadius: 99 }}>
                {userProfile?.activityPoints || 0} pts
              </span>
            </div>
          </div>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={{ padding: '8px 18px', borderRadius: 8, background: '#fff', border: 'none', color: '#C2410C', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCancel} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSave} style={{ padding: '8px 18px', borderRadius: 8, background: '#fff', border: 'none', color: '#C2410C', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Save
            </button>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Weight', value: `${userProfile?.weight} kg` },
          { label: 'Height', value: `${userProfile?.height} cm` },
          { label: 'Age', value: `${userProfile?.age} years` },
          { label: 'Target Weight', value: `${userProfile?.targetWeight} kg` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs + Content */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, overflow: 'hidden' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F0', padding: '0 20px' }}>
          {TAB_LIST.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '14px 18px', fontSize: 13, fontWeight: activeTab === key ? 600 : 400, color: activeTab === key ? '#F97316' : '#9CA3AF', background: 'none', border: 'none', borderBottom: activeTab === key ? '2px solid #F97316' : '2px solid transparent', cursor: 'pointer', marginBottom: -1, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '20px 24px' }}>
          {/* General */}
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>Basic Information</div>
                <Field label="Full Name">
                  <input type="text" name="fullName" value={formData?.fullName || ''} onChange={handleChange} disabled={!isEditing} style={inputStyle(isEditing)} />
                </Field>
                <Field label="Email">
                  <input type="email" name="email" value={formData?.email || ''} disabled style={inputStyle(false)} />
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Email cannot be changed</div>
                </Field>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>Biometric Data</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Age">
                    <input type="number" name="age" value={formData?.age || ''} onChange={handleChange} disabled={!isEditing} style={inputStyle(isEditing)} />
                  </Field>
                  <Field label="Gender">
                    <select name="gender" value={formData?.gender || 'Laki-laki'} onChange={handleChange} disabled={!isEditing} style={inputStyle(isEditing)}>
                      <option value="Laki-laki">Male</option>
                      <option value="Perempuan">Female</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* Health */}
          {activeTab === 'health' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Body Measurements</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Weight (kg)">
                    <input type="number" name="weight" step="0.1" value={formData?.weight || ''} onChange={handleChange} disabled={!isEditing} style={inputStyle(isEditing)} />
                  </Field>
                  <Field label="Height (cm)">
                    <input type="number" name="height" value={formData?.height || ''} onChange={handleChange} disabled={!isEditing} style={inputStyle(isEditing)} />
                  </Field>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Health Information</div>
                <InfoRow label="Medical History" value={userProfile?.medicalHistory?.length > 0 ? userProfile.medicalHistory.join(', ') : 'None'} />
                <InfoRow label="Allergies" value={userProfile?.allergies?.length > 0 ? userProfile.allergies.join(', ') : 'None'} />
                <InfoRow label="Blood Pressure" value={userProfile?.bloodPressure?.systolic ? `${userProfile.bloodPressure.systolic}/${userProfile.bloodPressure.diastolic} mmHg` : '-'} />
              </div>
            </div>
          )}

          {/* Lifestyle */}
          {activeTab === 'lifestyle' && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Lifestyle</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <InfoRow label="Dietary Pattern" value={userProfile?.dietaryPattern} />
                <InfoRow label="Meal Frequency" value={userProfile?.mealsPerDay ? `${userProfile.mealsPerDay} times/day` : '-'} />
                <InfoRow label="Daily Water Goal" value={userProfile?.dailyWaterIntakeGoal ? `${userProfile.dailyWaterIntakeGoal} ml/day` : '-'} />
                <InfoRow label="Avg Sleep Hours" value={userProfile?.avgSleepHours ? `${userProfile.avgSleepHours} hours` : '-'} />
                <InfoRow label="Activity Level" value={userProfile?.activityLevel} />
              </div>
            </div>
          )}

          {/* Goals */}
          {activeTab === 'goals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Health Goals</div>
                <InfoRow label="Primary Goal" value={userProfile?.primaryGoal} />
                <InfoRow label="Target Weight" value={userProfile?.targetWeight ? `${userProfile.targetWeight} kg` : '-'} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F5F5' }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>Gap to Target</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#F97316' }}>
                    {userProfile?.weight && userProfile?.targetWeight ? `${(userProfile.weight - userProfile.targetWeight).toFixed(1)} kg` : '-'}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Commitment</div>
                <InfoRow label="Workouts Per Week" value={userProfile?.commitmentDays ? `${userProfile.commitmentDays} days` : '-'} />
                <div style={{ padding: '10px 0' }}>
                  <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>Preferred Activities</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {userProfile?.preferredActivities?.map((activity) => (
                      <span key={activity} style={{ padding: '4px 12px', borderRadius: 99, background: '#FFF7ED', color: '#C2410C', fontSize: 12, fontWeight: 500 }}>
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Account</div>
                <InfoRow label="Email" value={userProfile?.email} />
                <InfoRow label="Joined" value={userProfile?.registeredAt ? new Date(userProfile.registeredAt).toLocaleDateString('en-US') : '-'} />
              </div>
              <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', marginBottom: 12 }}>Danger Zone</div>
                <button onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
