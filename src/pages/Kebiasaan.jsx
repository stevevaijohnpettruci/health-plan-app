import { useState, useCallback } from 'react'
import { useApp } from '../hooks/useApp'

/* ─── useSave — generic save-to-API hook ──────────────
 *  Usage: const { save, status } = useSave()
 *         await save('weekly_run', payload)
 *  status: 'idle' | 'saving' | 'success' | 'error'
 *
 *  Replace the fetch URL/headers to match your backend.
 * ────────────────────────────────────────────────── */
const useSave = () => {
  const [status, setStatus] = useState('idle') // 'idle'|'saving'|'success'|'error'
  const [errorMsg, setErrorMsg] = useState(null)

  const save = useCallback(async (endpoint, payload) => {
    setStatus('saving')
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, savedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2500)
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3500)
    }
  }, [])

  return { save, status, errorMsg }
}

/* ─── SaveBar — reusable sticky save bar ─────────────── */
const SaveBar = ({ onSave, status, errorMsg, label = 'Save changes' }) => {
  const isLoading = status === 'saving'
  const isSuccess = status === 'success'
  const isError   = status === 'error'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#FFFFFF', border: '1px solid #F0F0F0',
      borderRadius: 10, padding: '10px 16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 12, color: isError ? '#DC2626' : isSuccess ? '#16A34A' : '#9CA3AF' }}>
        {isError   ? `❌ ${errorMsg || 'Failed to save. Please try again.'}` :
         isSuccess ? '✅ Saved successfully!' :
         isLoading ? '⏳ Saving…' :
         ''}
      </div>
      <button
        onClick={onSave}
        disabled={isLoading}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 20px', borderRadius: 8,
          background: isSuccess ? '#16A34A' : isLoading ? '#FED7AA' : '#F97316',
          border: 'none', color: '#FFFFFF',
          fontSize: 13, fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          opacity: isLoading ? 0.8 : 1,
        }}
      >
        {isLoading ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : isSuccess ? (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
          </svg>
        )}
        {isLoading ? 'Saving…' : isSuccess ? 'Saved!' : label}
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', placeholder: 'e.g. Oatmeal + Banana' },
  { key: 'lunch',     label: 'Lunch',     placeholder: 'e.g. Rice + Grilled chicken' },
  { key: 'dinner',    label: 'Dinner',    placeholder: 'e.g. Tofu soup + Tempeh' },
]

const ACTIVITY_TYPES = ['Walking', 'Running', 'Cycling', 'Swimming', 'Gym', 'Yoga']

const calcSleepDuration = (start, end) => {
  if (!start || !end) return null
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let diff = (eh * 60 + em) - (sh * 60 + sm)
  if (diff < 0) diff += 24 * 60
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return m > 0 ? `${h}h ${m}m` : `${h} hours`
}

// sets format: { reps, setsCount, days }
// display: "15 reps × 3 sets × 5 days"
const LEVEL_CONFIG = {
  beginner: {
    label: '🌱 Beginner',
    desc: 'Start light and build consistency. Focus on form over volume.',
    pillBg: '#FEF3C7', pillColor: '#92400E',
    runTarget: 12,
    groups: [
      { section: 'Dips', items: [
        { id: 'dips', name: 'Dips', reps: 15, sets: 3, days: 5 },
      ]},
      { section: 'Pull Up', items: [
        { id: 'pu_wide',  name: 'Pull Up — Wide/Chest', reps: 10, sets: 2, days: 5 },
        { id: 'pu_norm',  name: 'Pull Up — Normal',     reps: 10, sets: 2, days: 5 },
        { id: 'pu_close', name: 'Pull Up — Close',      reps: 10, sets: 2, days: 5 },
        { id: 'pu_chin',  name: 'Chin Up',              reps: 10, sets: 2, days: 5 },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  reps: 15, sets: 2, days: 5 },
        { id: 'push_dec',  name: 'Push Up — Decline', reps: 8,  sets: 2, days: 5 },
        { id: 'push_inc',  name: 'Push Up — Incline', reps: 8,  sets: 2, days: 5 },
        { id: 'push_dia',  name: 'Push Up — Diamond', reps: 8,  sets: 2, days: 5 },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            reps: 15, sets: 3, days: 5 },
        { id: 'riseup', name: 'Rise Up',           reps: 15, sets: 3, days: 5 },
        { id: 'climb',  name: 'Mountain Climbing', reps: 20, sets: 3, days: 5, unit: 'sec' },
        { id: 'plank',  name: 'Plank',             reps: 1,  sets: 3, days: 5, unit: 'min' },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', reps: 10, sets: 3, days: 5 },
        { id: 'lunge',  name: 'Lunges',     reps: 10, sets: 3, days: 5, unit: 'steps' },
      ]},
    ],
  },
  intermediate: {
    label: '⚡ Intermediate',
    desc: 'Increase volume and intensity. Push past your comfort zone.',
    pillBg: '#D1FAE5', pillColor: '#065F46',
    runTarget: 20,
    groups: [
      { section: 'Dips', items: [
        { id: 'dips', name: 'Dips', reps: 20, sets: 4, days: 5 },
      ]},
      { section: 'Pull Up', items: [
        { id: 'pu_wide',  name: 'Pull Up — Wide/Chest', reps: 12, sets: 3, days: 5 },
        { id: 'pu_norm',  name: 'Pull Up — Normal',     reps: 12, sets: 3, days: 5 },
        { id: 'pu_close', name: 'Pull Up — Close',      reps: 12, sets: 3, days: 5 },
        { id: 'pu_chin',  name: 'Chin Up',              reps: 12, sets: 3, days: 5 },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  reps: 20, sets: 3, days: 5 },
        { id: 'push_dec',  name: 'Push Up — Decline', reps: 12, sets: 3, days: 5 },
        { id: 'push_inc',  name: 'Push Up — Incline', reps: 12, sets: 3, days: 5 },
        { id: 'push_dia',  name: 'Push Up — Diamond', reps: 12, sets: 3, days: 5 },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            reps: 20, sets: 4, days: 5 },
        { id: 'riseup', name: 'Rise Up',           reps: 20, sets: 4, days: 5 },
        { id: 'climb',  name: 'Mountain Climbing', reps: 30, sets: 4, days: 5, unit: 'sec' },
        { id: 'plank',  name: 'Plank',             reps: 2,  sets: 3, days: 5, unit: 'min' },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', reps: 15, sets: 4, days: 5 },
        { id: 'lunge',  name: 'Lunges',     reps: 15, sets: 4, days: 5, unit: 'steps' },
      ]},
    ],
  },
  advanced: {
    label: '🔥 Advanced',
    desc: 'Maximum output. Elite volume, short rest, high intensity.',
    pillBg: '#FEE2E2', pillColor: '#7F1D1D',
    runTarget: 30,
    groups: [
      { section: 'Dips', items: [
        { id: 'dips', name: 'Dips', reps: 25, sets: 5, days: 5 },
      ]},
      { section: 'Pull Up', items: [
        { id: 'pu_wide',  name: 'Pull Up — Wide/Chest', reps: 15, sets: 4, days: 5 },
        { id: 'pu_norm',  name: 'Pull Up — Normal',     reps: 15, sets: 4, days: 5 },
        { id: 'pu_close', name: 'Pull Up — Close',      reps: 15, sets: 4, days: 5 },
        { id: 'pu_chin',  name: 'Chin Up',              reps: 15, sets: 4, days: 5 },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  reps: 25, sets: 4, days: 5 },
        { id: 'push_dec',  name: 'Push Up — Decline', reps: 15, sets: 4, days: 5 },
        { id: 'push_inc',  name: 'Push Up — Incline', reps: 15, sets: 4, days: 5 },
        { id: 'push_dia',  name: 'Push Up — Diamond', reps: 15, sets: 4, days: 5 },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            reps: 25, sets: 5, days: 5 },
        { id: 'riseup', name: 'Rise Up',           reps: 25, sets: 5, days: 5 },
        { id: 'climb',  name: 'Mountain Climbing', reps: 45, sets: 5, days: 5, unit: 'sec' },
        { id: 'plank',  name: 'Plank',             reps: 3,  sets: 3, days: 5, unit: 'min' },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', reps: 20, sets: 5, days: 5 },
        { id: 'lunge',  name: 'Lunges',     reps: 20, sets: 5, days: 5, unit: 'steps' },
      ]},
    ],
  },
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Format exercise frequency label
const fmtSets = (ex) => {
  const unit = ex.unit || 'reps'
  return `${ex.reps} ${unit} × ${ex.sets} sets × ${ex.days} days`
}

const S = {
  card: { background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' },
  sectionLbl: { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 14 },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, color: '#1A1A1A', background: '#FAFAFA', outline: 'none' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#F97316', flexShrink: 0, marginTop: 22 },
}

/* ─── Weekly Run Tracker ───────────────────────────── */
const WeeklyRunTracker = () => {
  const [level, setLevel] = useState('beginner')
  const [runs, setRuns] = useState({})
  const { save, status, errorMsg } = useSave()

  const cfg    = LEVEL_CONFIG[level]
  const target = cfg.runTarget

  const totalKm = DAYS.reduce((sum, d) => sum + (parseFloat(runs[d]?.km) || 0), 0)
  const pct     = Math.min(100, Math.round((totalKm / target) * 100))

  const updateKm = (day, val) =>
    setRuns(prev => ({ ...prev, [day]: { km: val } }))

  const handleSave = () => save('weekly_run', { level, runs, totalKm, target })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>Level:</span>
        <select value={level} onChange={e => { setLevel(e.target.value); setRuns({}) }} style={{ ...S.input, width: 'auto', padding: '6px 10px', cursor: 'pointer' }}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: cfg.pillBg, color: cfg.pillColor }}>{cfg.label}</span>
      </div>

      <div style={S.card}>
        <div style={S.sectionLbl}>🏃 Weekly Run / Walk Target</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600 }}>{totalKm.toFixed(1)} km</span>
          <span style={{ fontSize: 13, color: '#F97316', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: '#F5F5F5', overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#F97316', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 18 }}>Weekly target: {target} km</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAYS.map(day => {
            const km     = parseFloat(runs[day]?.km) || 0
            const dayPct = Math.min(100, Math.round((km / (target / 7)) * 100))
            return (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 80px', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{day}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="number" min="0" step="0.1" placeholder="0" value={runs[day]?.km || ''} onChange={e => updateKm(day, e.target.value)} style={{ ...S.input, textAlign: 'center' }} />
                  <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>km</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${dayPct}%`, background: km > 0 ? '#F97316' : '#F5F5F5', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <SaveBar onSave={handleSave} status={status} errorMsg={errorMsg} label="Save weekly run" />
    </div>
  )
}

/* ─── Weekly Exercise ──────────────────────────────── */
const WeeklyExercise = () => {
  const [level, setLevel] = useState('beginner')
  // checks: { `${level}_${exId}_${day}`: true }
  const [checks, setChecks] = useState({})
  const { save, status, errorMsg } = useSave()

  const cfg    = LEVEL_CONFIG[level]
  const groups = cfg.groups

  const allItems   = groups.flatMap(g => g.items)
  // total = sum of target days across all exercises
  const totalTarget = allItems.reduce((sum, ex) => sum + ex.days, 0)
  const totalDone   = allItems.reduce((sum, ex) => {
    const doneDays = DAYS.filter(d => checks[`${level}_${ex.id}_${d}`]).length
    return sum + Math.min(doneDays, ex.days)
  }, 0)
  const weekPct = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0

  const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }))

  const handleSave = () => save('weekly_exercise', { level, checks, totalDone, totalTarget })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Level selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>Level:</span>
        <select value={level} onChange={e => { setLevel(e.target.value); setChecks({}) }} style={{ ...S.input, width: 'auto', padding: '6px 10px', cursor: 'pointer' }}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: cfg.pillBg, color: cfg.pillColor }}>{cfg.label}</span>
      </div>

      <div style={{ fontSize: 13, color: '#92400E', background: '#FFFBEB', borderRadius: 8, padding: '10px 14px', borderLeft: '3px solid #F97316' }}>
        {cfg.desc}
      </div>

      {/* Day header legend */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {DAYS.map(d => (
          <span key={d} style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', background: '#F3F4F6', borderRadius: 6, padding: '3px 8px' }}>{d}</span>
        ))}
      </div>

      {/* Exercise list */}
      <div style={S.card}>
        <div style={S.sectionLbl}>💪 Weekly Exercise</div>

        {groups.map(group => (
          <div key={group.section} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#D1D5DB', textTransform: 'uppercase', paddingBottom: 5, borderBottom: '1px solid #F3F4F6', marginBottom: 8 }}>
              {group.section}
            </div>
            {group.items.map(ex => {
              const doneDays  = DAYS.filter(d => checks[`${level}_${ex.id}_${d}`]).length
              const exPct     = Math.min(100, Math.round((doneDays / ex.days) * 100))
              const isReached = doneDays >= ex.days

              return (
                <div key={ex.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F9FAFB' }}>
                  {/* Row: name + frequency badge + progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ flex: 1, fontSize: 13, color: isReached ? '#9CA3AF' : '#1A1A1A', fontWeight: 500, textDecoration: isReached ? 'line-through' : 'none' }}>
                      {ex.name}
                    </span>
                    <span style={{ fontSize: 10, color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: 5, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {fmtSets(ex)}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isReached ? '#16A34A' : '#F97316', minWidth: 32, textAlign: 'right', flexShrink: 0 }}>
                      {doneDays}/{ex.days}
                    </span>
                  </div>

                  {/* Mini progress bar */}
                  <div style={{ height: 4, borderRadius: 2, background: '#F5F5F5', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${exPct}%`, background: isReached ? '#22C55E' : '#F97316', borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>

                  {/* Day checkboxes */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    {DAYS.map(day => {
                      const key     = `${level}_${ex.id}_${day}`
                      const checked = !!checks[key]
                      return (
                        <button
                          key={day}
                          onClick={() => toggle(key)}
                          title={day}
                          style={{
                            width: 32, height: 28,
                            borderRadius: 6,
                            border: checked ? 'none' : '1.5px solid #E5E7EB',
                            background: checked ? '#F97316' : '#FAFAFA',
                            color: checked ? '#fff' : '#9CA3AF',
                            fontSize: 10, fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                          }}
                        >
                          {checked
                            ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : day.slice(0, 1)
                          }
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Weekly overall progress */}
        <div style={{ marginTop: 4, paddingTop: 14, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${weekPct}%`, background: weekPct >= 100 ? '#22C55E' : '#F97316', borderRadius: 3, transition: 'width 0.4s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: '#9CA3AF' }}>
              <span>Weekly Progress</span>
              <span>{totalDone} / {totalTarget} sessions</span>
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: weekPct >= 100 ? '#22C55E' : '#F97316', flexShrink: 0 }}>{weekPct}%</div>
        </div>
      </div>
      <SaveBar onSave={handleSave} status={status} errorMsg={errorMsg} label="Save weekly exercise" />
    </div>
  )
}

/* ─── Main Kebiasaan ──────────────────────────────── */
export const Kebiasaan = () => {
  const { habits, dailyHealth, updateDailyHealth } = useApp()
  const [activeTab, setActiveTab] = useState('habit')
  const { save, status: saveStatus, errorMsg } = useSave()

  const completedCount = habits.filter(h => h.completed).length
  const totalCount     = habits.length
  const waterIntake    = dailyHealth.waterIntake || 0
  const activity       = dailyHealth.activity    || 0
  const meals          = dailyHealth.meals        || ['', '', '']
  const sleepDuration  = calcSleepDuration(dailyHealth.sleepStart, dailyHealth.sleepEnd)

  const summaryMetrics = [
    { label: 'Habits',    value: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0 },
    { label: 'Hydration', value: Math.min(100, Math.round((waterIntake / 8) * 100)) },
    { label: 'Activity',  value: Math.min(100, Math.round((activity / 10000) * 100)) },
    { label: 'Nutrition', value: meals.filter(Boolean).length > 0 ? Math.round((meals.filter(Boolean).length / 3) * 100) : 0 },
  ]

  const GOAL    = 8
  const glasses = Array.from({ length: GOAL + 1 }, (_, i) => i)

  const handleSaveHabit = () => save('habit_tracker', { dailyHealth, savedDate: new Date().toDateString() })

  const TABS = [
    { key: 'habit',    label: 'Habit Tracker'    },
    { key: 'run',      label: 'Weekly Run'       },
    { key: 'exercise', label: 'Weekly Exercise'  },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Habit Tracker</h1>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{completedCount} of {totalCount} habits completed today</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F0' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? '#F97316' : '#9CA3AF', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? '#F97316' : 'transparent'}`, marginBottom: -1, cursor: 'pointer', transition: 'all 0.15s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Habit Tracker ─── */}
      {activeTab === 'habit' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={S.card}>
              <div style={S.sectionLbl}>Nutrition Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {MEAL_SLOTS.map(({ key, label, placeholder }, i) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={S.dot} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{label}</div>
                      <input type="text" value={meals[i] || ''} onChange={e => { const u = [...meals]; u[i] = e.target.value; updateDailyHealth({ meals: u }) }} placeholder={placeholder} style={S.input}
                        onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.background = '#FFF7ED' }}
                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={S.sectionLbl}>Hydration Tracker</div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: '#F97316', lineHeight: 1 }}>{waterIntake}</span>
                <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>of {GOAL} glasses today</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                {glasses.map(i => {
                  const filled = i < waterIntake; const isExtra = i >= GOAL
                  return (
                    <button key={i} onClick={() => updateDailyHealth({ waterIntake: filled ? i : i + 1 })} style={{ width: 38, height: 38, borderRadius: 9, border: filled ? 'none' : '1.5px solid #FED7AA', background: filled ? (isExtra ? '#FDBA74' : '#F97316') : 'transparent', color: filled ? '#fff' : '#FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 8 5 12 5 16a7 7 0 0014 0c0-4-3-8-7-14z"/></svg>
                    </button>
                  )
                })}
              </div>
              <button onClick={() => updateDailyHealth({ waterIntake: waterIntake + 1 })} style={{ width: '100%', padding: '8px', borderRadius: 9, background: '#F97316', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 8 5 12 5 16a7 7 0 0014 0c0-4-3-8-7-14z"/></svg>
                + 1 glass
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div style={S.card}>
              <div style={S.sectionLbl}>Activity Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={S.dot} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Activity type</div>
                    <select value={dailyHealth.activityType || 'Walking'} onChange={e => updateDailyHealth({ activityType: e.target.value })} style={{ ...S.input, cursor: 'pointer' }}>
                      {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={S.dot} />
                  <div style={{ flex: 1 }}>
                    {(() => {
                      const type = dailyHealth.activityType || 'Walking'
                      const isDistance = ['Walking', 'Running', 'Cycling', 'Swimming'].includes(type)
                      const unit = isDistance ? 'km' : 'min'
                      const step = isDistance ? 0.1 : 1
                      const decrement = isDistance ? 0.1 : 1
                      return (
                        <>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{isDistance ? 'Distance' : 'Duration'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button onClick={() => updateDailyHealth({ activity: Math.max(0, parseFloat((activity - decrement).toFixed(1))) })} style={{ width: 32, height: 34, borderRadius: 7, border: '1px solid #E5E7EB', background: '#F5F5F5', fontSize: 18, cursor: 'pointer', color: '#6B7280', flexShrink: 0 }}>−</button>
                            <input type="number" min="0" step={step} value={activity} onChange={e => updateDailyHealth({ activity: Number(e.target.value) })} style={{ flex: 1, padding: '8px 6px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, textAlign: 'center', background: '#FAFAFA', outline: 'none', color: '#1A1A1A' }} />
                            <button onClick={() => updateDailyHealth({ activity: parseFloat((activity + decrement).toFixed(1)) })} style={{ width: 32, height: 34, borderRadius: 7, border: '1px solid #E5E7EB', background: '#F5F5F5', fontSize: 18, cursor: 'pointer', color: '#6B7280', flexShrink: 0 }}>+</button>
                          </div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>{unit}</div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.sectionLbl}>Sleep Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[{ key: 'sleepStart', label: 'Bedtime', icon: '🌙' }, { key: 'sleepEnd', label: 'Wake up', icon: '☀️' }].map(({ key, label, icon }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={S.dot} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{icon} {label}</div>
                      <input type="time" value={dailyHealth[key] || ''} onChange={e => updateDailyHealth({ [key]: e.target.value })} style={S.input} />
                    </div>
                  </div>
                ))}
              </div>
              {sleepDuration && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF7ED', borderRadius: 9, padding: '10px 14px' }}>
                  <span style={{ fontSize: 12, color: '#C2410C', fontWeight: 500 }}>Total sleep</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#F97316' }}>{sleepDuration}</span>
                </div>
              )}
            </div>

            <div style={S.card}>
              <div style={S.sectionLbl}>Today's Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {summaryMetrics.map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 12, color: '#374151', width: 74, flexShrink: 0 }}>{label}</div>
                    <div style={{ flex: 1, height: 7, borderRadius: 4, background: '#F5F5F5', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${value}%`, background: '#F97316', borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', width: 34, textAlign: 'right', flexShrink: 0 }}>{value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SaveBar onSave={handleSaveHabit} status={saveStatus} errorMsg={errorMsg} label="Save habit data" />
        </>
      )}

      {activeTab === 'run'      && <WeeklyRunTracker />}
      {activeTab === 'exercise' && <WeeklyExercise />}
    </div>
  )
}