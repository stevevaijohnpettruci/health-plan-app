import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const MetricCard = ({ label, value, unit, sub, subColor = '#9CA3AF', barPct, barColor = '#F97316' }) => (
  <div style={{
    background: '#FFFFFF',
    border: '1px solid #F0F0F0',
    borderRadius: 12,
    padding: '14px 16px',
  }}>
    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
      {value}{unit && <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>{unit}</span>}
    </div>
    {sub && <div style={{ fontSize: 11, color: subColor, marginTop: 4 }}>{sub}</div>}
    {barPct !== undefined && (
      <div style={{ height: 3, borderRadius: 2, background: '#F5F5F5', marginTop: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barPct}%`, background: barColor, borderRadius: 2, transition: 'width 0.5s' }} />
      </div>
    )}
  </div>
)

const NutritionBar = ({ label, value, target = 100, color, unit = 'g' }) => {
  const pct = Math.min(Math.round((value / target) * 100), 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 12, color: '#374151', width: 90, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 7, borderRadius: 4, background: '#F5F5F5', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', width: 56, textAlign: 'right', flexShrink: 0 }}>
        {value}<span style={{ fontSize: 10 }}>{unit}</span>
        <span style={{ color: '#D1D5DB', margin: '0 2px' }}>/</span>
        {target}{unit}
      </div>
    </div>
  )
}

const StreakCard = ({ icon, value, label }) => (
  <div style={{ background: '#FFF7ED', borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: '#F97316', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: '#C2410C', marginTop: 4 }}>{label}</div>
  </div>
)

const HABIT_TYPE = {
  food:  { bg: '#FFF7ED', color: '#C2410C', label: 'Food' },
  water: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Water' },
  sport: { bg: '#F0FDF4', color: '#166534', label: 'Sport' },
  sleep: { bg: '#FAF5FF', color: '#6B21A8', label: 'Sleep' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #F0F0F0',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, color: '#F97316' }}>{payload[0].value} kg</div>
    </div>
  )
}

const DEFAULT_HABITS = [
  { id: 1, name: 'Healthy breakfast',  time: '07:30', type: 'food',  completed: true  },
  { id: 2, name: 'Morning water',       time: '08:00', type: 'water', completed: true  },
  { id: 3, name: 'Morning workout',     time: '09:00', type: 'sport', completed: true  },
  { id: 4, name: 'Lunch meal',          time: '12:00', type: 'food',  completed: false },
  { id: 5, name: 'Healthy Dinner',          time: '19:00', type: 'food',  completed: false },
  { id: 6, name: 'Sleep by 22:00',      time: '22:00', type: 'sleep', completed: false },
]

const WEIGHT_DATA = [
  { day: '18/4', weight: 70.5 },
  { day: '19/4', weight: 70.1 },
  { day: '20/4', weight: 69.8 },
  { day: '21/4', weight: 69.5 },
  { day: '22/4', weight: 69.2 },
  { day: '23/4', weight: 68.7 },
  { day: '24/4', weight: 68.0 },
]

export const Dashboard = () => {
  const { dailyHealth, progressData } = useApp()
  const navigate = useNavigate()
  const [habits, setHabits] = useState(DEFAULT_HABITS)

  const weightData = progressData?.weeklyWeight?.length ? progressData.weeklyWeight : WEIGHT_DATA
  const done = habits.filter(h => h.completed).length

  const toggle = (id) =>
    setHabits(hs => hs.map(h => h.id === id ? { ...h, completed: !h.completed } : h))

  const water    = dailyHealth?.waterIntake ?? 5
  const weight   = dailyHealth?.weight      ?? 68.0
  const activity = dailyHealth?.activity    ?? 3240

  /* ── Nutrition values (from dailyHealth or fallback) ── */
  const nutrition = {
    protein:     dailyHealth?.nutrition?.protein     ?? 76,
    carbs:       dailyHealth?.nutrition?.carbs        ?? 210,
    fiber:       dailyHealth?.nutrition?.fiber        ?? 18,
    sugar:       dailyHealth?.nutrition?.sugar        ?? 32,
    sodium:      dailyHealth?.nutrition?.sodium       ?? 1800,
    cholesterol: dailyHealth?.nutrition?.cholesterol  ?? 180,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* AI Banner */}
      <div style={{
        background: '#F97316', borderRadius: 12, padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Your daily plan is ready!</div>
            <div style={{ fontSize: 11, color: '#FED7AA', marginTop: 2 }}>
              AI has generated today's personalized recommendations
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/rekomendasi')}
          style={{
            background: '#FFFFFF', color: '#C2410C', border: 'none',
            borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          View plan →
        </button>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <MetricCard
          label="Weight"
          value={weight}
          unit="kg"
          sub="▼ 2.5 kg from start"
          subColor="#16A34A"
          barPct={Math.round((weight / 75) * 100)}
        />
        <MetricCard
          label="Water intake"
          value={water}
          unit="/ 8 glasses"
          sub={`${Math.round((water / 8) * 100)}% of daily goal`}
          subColor={water >= 8 ? '#16A34A' : '#D97706'}
          barPct={Math.round((water / 8) * 100)}
        />
        <MetricCard
          label="Active streak"
          value="6"
          unit="days"
          sub="Best: 12 days"
          subColor="#16A34A"
          barPct={50}
        />
      </div>

      {/* Chart + Habits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>

        {/* Weight chart */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Weight trend (7 days)</div>
            <span style={{ fontSize: 11, color: '#F97316', fontWeight: 500 }}>70.5 → 68.0 kg</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weightData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="weight" stroke="#F97316" strokeWidth={2.5}
                dot={{ fill: '#F97316', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#F97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Today's habits */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Today's habits</div>
            <span style={{
              fontSize: 11, fontWeight: 500,
              background: '#FFF7ED', color: '#C2410C',
              padding: '2px 8px', borderRadius: 99,
            }}>{done}/{habits.length}</span>
          </div>
          <div>
            {habits.map(h => {
              const t = HABIT_TYPE[h.type] || HABIT_TYPE.food
              return (
                <div
                  key={h.id}
                  onClick={() => toggle(h.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0', borderBottom: '1px solid #F9F9F9', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: h.completed ? '#F97316' : 'transparent',
                    border: h.completed ? 'none' : '1.5px solid #D1D5DB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {h.completed && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12,
                      color: h.completed ? '#9CA3AF' : '#1A1A1A',
                      textDecoration: h.completed ? 'line-through' : 'none',
                    }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{h.time}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 99,
                    background: t.bg, color: t.color, flexShrink: 0,
                  }}>{t.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Nutrition + Streak & Consistency */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Average water intake */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
              Average water intake
            </div>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Daily targets</span>
          </div>
          <NutritionBar label="Water intake" value={water} target={8} color="#38BDF8" unit=" glass" />
        </div>

        {/* Streak & Consistency */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Streak &amp; consistency</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <StreakCard icon="🔥" value={progressData?.streak?.consecutive ?? 6} label="Days in a row" />
            <StreakCard icon="📅" value={progressData?.streak?.total       ?? 18} label="Total active days" />
            <StreakCard icon="🏆" value={progressData?.streak?.longest     ?? 12} label="Longest streak" />
          </div>
        </div>

      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => navigate('/kebiasaan')}
          style={{
            flex: 1, padding: '9px 14px', borderRadius: 9,
            background: '#F9FAFB', border: '1px solid #F0F0F0',
            fontSize: 12, fontWeight: 500, color: '#374151',
            cursor: 'pointer', textAlign: 'center',
          }}
        >
          Update today's habits
        </button>
        <button
          onClick={() => navigate('/rekomendasi')}
          style={{
            flex: 1, padding: '9px 14px', borderRadius: 9,
            background: '#F97316', border: 'none',
            fontSize: 12, fontWeight: 600, color: '#FFFFFF',
            cursor: 'pointer', textAlign: 'center',
          }}
        >
          See today's recommendations →
        </button>
      </div>

      {/* Next reminders */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Next reminders</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { dot: '#F97316', text: 'Lunch time!',      time: '12:00' },
            { dot: '#3B82F6', text: 'Drink water',       time: '13:30' },
            { dot: '#22C55E', text: 'Evening workout',   time: '17:00' },
            { dot: '#A855F7', text: 'Prepare for sleep', time: '21:30' },
          ].map(r => (
            <div key={r.text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', background: '#F9FAFB',
              border: '1px solid #F0F0F0', borderRadius: 9,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12, color: '#374151' }}>{r.text}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{r.time}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}