import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/* ── Custom tooltip ────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #F0F0F0',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, color: '#F97316' }}>{payload[0].value} kg</div>
    </div>
  )
}

/* ── Nutrition bar row ────────────────────────────────── */
const NutritionBar = ({ label, value, target, color }) => {
  const pct = Math.min(Math.round((value / target) * 100), 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 12, color: '#374151', width: 96, flexShrink: 0 }}>{label}</div>
      <div style={{
        flex: 1, height: 8, borderRadius: 4,
        background: '#F5F5F5', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color, borderRadius: 4,
          transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', width: 32, textAlign: 'right' }}>{pct}%</div>
    </div>
  )
}

/* ── Stat card ────────────────────────────────────────── */
const StatCard = ({ label, value, unit, sub, subColor }) => (
  <div style={{
    background: '#FFFFFF',
    border: '1px solid #F0F0F0',
    borderRadius: 12,
    padding: '14px 16px',
  }}>
    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
      {value}
      {unit && <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>{unit}</span>}
    </div>
    {sub && <div style={{ fontSize: 11, color: subColor || '#9CA3AF', marginTop: 4 }}>{sub}</div>}
  </div>
)

/* ── Streak card ──────────────────────────────────────── */
const StreakCard = ({ icon, value, label }) => (
  <div style={{
    background: '#FFF7ED',
    borderRadius: 10,
    padding: '14px 12px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: '#F97316', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: '#C2410C', marginTop: 4 }}>{label}</div>
  </div>
)

/* ── Period filter button ─────────────────────────────── */
const FilterBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '5px 14px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: active ? 500 : 400,
      border: `1px solid ${active ? '#F97316' : '#E5E7EB'}`,
      background: active ? '#F97316' : 'transparent',
      color: active ? '#FFFFFF' : '#6B7280',
      cursor: 'pointer',
      transition: 'all 0.15s',
    }}
  >
    {label}
  </button>
)

/* ── Main Progress component ─────────────────────────── */
export const Progress = () => {
  const { progressData } = useApp()
  const [activePeriod, setActivePeriod] = useState('7 days')

  const PERIODS = ['7 days', '30 days', '3 months']

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A' }}>Health Progress</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
            Track your health journey over time
          </p>
        </div>
        {/* Period filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map(p => (
            <FilterBtn
              key={p}
              label={p}
              active={activePeriod === p}
              onClick={() => setActivePeriod(p)}
            />
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard
          label="Initial weight"
          value="70.5"
          unit="kg"
          sub="April 18, 2026"
        />
        <StatCard
          label="Current weight"
          value="68.0"
          unit="kg"
          sub="▼ 2.5 kg measured"
          subColor="#16A34A"
        />
        <StatCard
          label="Target weight"
          value="65.0"
          unit="kg"
          sub="3.0 kg more to go"
          subColor="#9CA3AF"
        />
        <StatCard
          label="Active streak"
          value="6"
          unit="days"
          sub="Best: 12 days"
          subColor="#16A34A"
        />
      </div>

      {/* Weight trend chart */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #F0F0F0',
        borderRadius: 12,
        padding: '16px 18px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Weight trend</div>
          <span style={{
            fontSize: 11, color: '#F97316', fontWeight: 500,
            background: '#FFF7ED', padding: '2px 10px', borderRadius: 99,
          }}>
            70.5 → 68.0 kg this period
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={progressData.weeklyWeight}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              domain={[67, 73]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#F97316"
              strokeWidth={2.5}
              dot={{ fill: '#F97316', r: 5, strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#F97316' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nutrition + Streak & Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Nutrition bars */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #F0F0F0',
          borderRadius: 12,
          padding: '16px 18px',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>
            Average nutrition achievement
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <NutritionBar
              label="Calories"
              value={progressData.nutritionToday.calorie.value}
              target={progressData.nutritionToday.calorie.target}
              color="#F97316"
            />
            <NutritionBar
              label="Protein"
              value={progressData.nutritionToday.protein.value}
              target={progressData.nutritionToday.protein.target}
              color="#FB923C"
            />
            <NutritionBar
              label="Carbs"
              value={progressData.nutritionToday.carbs.value}
              target={progressData.nutritionToday.carbs.target}
              color="#FCD34D"
            />
            <NutritionBar
              label="Fat"
              value={progressData.nutritionToday.fat.value}
              target={progressData.nutritionToday.fat.target}
              color="#FDBA74"
            />
            <NutritionBar
              label="Fiber"
              value={55}
              target={100}
              color="#FED7AA"
            />
            <NutritionBar
              label="Water intake"
              value={progressData.nutritionToday.water.value}
              target={progressData.nutritionToday.water.target}
              color="#38BDF8"
            />
          </div>
        </div>

        {/* Right column: Streak + Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Streak */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #F0F0F0',
            borderRadius: 12,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>
              Streak &amp; consistency
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <StreakCard
                icon="🔥"
                value={progressData.streak.consecutive}
                label="Days in a row"
              />
              <StreakCard
                icon="📅"
                value={progressData.streak.total}
                label="Total active days"
              />
              <StreakCard
                icon="🏆"
                value={progressData.streak.longest}
                label="Longest streak"
              />
            </div>
          </div>

          {/* Badges */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #F0F0F0',
            borderRadius: 12,
            padding: '16px 18px',
            flex: 1,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>
              Achievements
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {progressData.badges.map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 12px',
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: badge.earned ? 500 : 400,
                    background: badge.earned ? '#FFF7ED' : '#F5F5F5',
                    border: `1px solid ${badge.earned ? '#FED7AA' : '#E5E7EB'}`,
                    color: badge.earned ? '#C2410C' : '#9CA3AF',
                  }}
                >
                  <span style={{ fontSize: 11 }}>{badge.earned ? '✓' : '🔒'}</span>
                  {badge.name}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
