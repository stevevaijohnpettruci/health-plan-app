import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, color: '#F97316' }}>{payload[0].value} kg</div>
    </div>
  )
}

const NutritionBar = ({ label, value, target, color, unit = 'g' }) => {
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

const StatCard = ({ label, value, unit, sub, subColor }) => (
  <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 16px' }}>
    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
      {value}{unit && <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>{unit}</span>}
    </div>
    {sub && <div style={{ fontSize: 11, color: subColor || '#9CA3AF', marginTop: 4 }}>{sub}</div>}
  </div>
)

const StreakCard = ({ icon, value, label }) => (
  <div style={{ background: '#FFF7ED', borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: '#F97316', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: '#C2410C', marginTop: 4 }}>{label}</div>
  </div>
)

const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: active ? 500 : 400, border: `1px solid ${active ? '#F97316' : '#E5E7EB'}`, background: active ? '#F97316' : 'transparent', color: active ? '#FFFFFF' : '#6B7280', cursor: 'pointer', transition: 'all 0.15s' }}>
    {label}
  </button>
)

export const Progress = () => {
  const { progressData, dailyHealth } = useApp()
  const [activePeriod, setActivePeriod] = useState('7 days')
  const PERIODS = ['7 days', '30 days', '3 months']

  const water = dailyHealth?.waterIntake ?? 5

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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A' }}>Health Progress</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>Track your health journey over time</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map(p => <FilterBtn key={p} label={p} active={activePeriod === p} onClick={() => setActivePeriod(p)} />)}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <StatCard label="Initial weight"  value="70.5" unit="kg" sub="April 18, 2026" />
        <StatCard label="Current weight"  value="68.0" unit="kg" sub="▼ 2.5 kg measured" subColor="#16A34A" />
        <StatCard label="Target weight"   value="65.0" unit="kg" sub="3.0 kg more to go" />
      </div>

      {/* Weight trend chart */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Weight trend</div>
          <span style={{ fontSize: 11, color: '#F97316', fontWeight: 500, background: '#FFF7ED', padding: '2px 10px', borderRadius: 99 }}>
            70.5 → 68.0 kg this period
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={progressData.weeklyWeight} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[67, 73]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="weight" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 5, strokeWidth: 0 }} activeDot={{ r: 7, fill: '#F97316' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nutrition + Streak */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Nutrition — same as Dashboard */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Average nutrition achievement</div>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Daily targets</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 28px' }}>
            <NutritionBar label="Protein"     value={nutrition.protein}     target={100}  color="#F97316" unit="g"   />
            <NutritionBar label="Carbs"       value={nutrition.carbs}       target={300}  color="#FB923C" unit="g"   />
            <NutritionBar label="Fiber"       value={nutrition.fiber}       target={30}   color="#FCD34D" unit="g"   />
            <NutritionBar label="Sugar"       value={nutrition.sugar}       target={50}   color="#FDBA74" unit="g"   />
            <NutritionBar label="Sodium"      value={nutrition.sodium}      target={2300} color="#FED7AA" unit="mg"  />
            <NutritionBar label="Cholesterol" value={nutrition.cholesterol} target={300}  color="#FB923C" unit="mg"  />
            <div style={{ gridColumn: '1 / -1' }}>
              <NutritionBar label="Water intake" value={water} target={8} color="#38BDF8" unit=" glass" />
            </div>
          </div>
        </div>

        {/* Streak */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Streak &amp; consistency</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <StreakCard icon="🔥" value={progressData.streak.consecutive} label="Days in a row" />
            <StreakCard icon="📅" value={progressData.streak.total}       label="Total active days" />
            <StreakCard icon="🏆" value={progressData.streak.longest}     label="Longest streak" />
          </div>
        </div>

      </div>
    </div>
  )
}