import { useState } from 'react';
import { HabitTracker } from './HabitTracker';
import { WeeklyRunTracker } from './WeeklyRunTracker';
import { WeeklyExercise } from './WeeklyExercise';

const TABS = [
  { key: 'habit', label: 'Habit Tracker' },
  { key: 'run', label: 'Weekly Run' },
  { key: 'exercise', label: 'Weekly Exercise' },
];

export const Kebiasaan = () => {
  const [activeTab, setActiveTab] = useState('habit');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Habit Tracker</h1>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
          Complete your daily habits and track your progress.
        </p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F0' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px', fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#F97316' : '#9CA3AF',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab.key ? '#F97316' : 'transparent'}`,
              marginBottom: -1, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'habit' && <HabitTracker />}
      {activeTab === 'run' && <WeeklyRunTracker />}
      {activeTab === 'exercise' && <WeeklyExercise />}
    </div>
  );
};
