import { useState } from 'react'
import { useApp } from '../hooks/useApp'

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

const LEVEL_CONFIG = {
  beginner: {
    label: '🌱 Beginner',
    desc: 'Start light and build consistency. Focus on form over volume.',
    pillBg: '#FEF3C7', pillColor: '#92400E',
    runTarget: 12,
    M: [
      { section: 'Run / Walk',  items: [{ id: 'run',        name: 'Run / Walk',            sets: '12 km / week'   }] },
      { section: 'Dips',        items: [{ id: 'dips',       name: 'Dips',                  sets: '15 reps × 3'    }] },
      { section: 'Pull Up',     items: [
        { id: 'pu_wide',  name: 'Pull Up — Wide/Chest', sets: '10 reps × 2' },
        { id: 'pu_norm',  name: 'Pull Up — Normal',     sets: '10 reps × 2' },
        { id: 'pu_close', name: 'Pull Up — Close',      sets: '10 reps × 2' },
        { id: 'pu_chin',  name: 'Chin Up',              sets: '10 reps × 2' },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  sets: '15 reps × 2' },
        { id: 'push_dec',  name: 'Push Up — Decline', sets: '8 reps × 2'  },
        { id: 'push_inc',  name: 'Push Up — Incline', sets: '8 reps × 2'  },
        { id: 'push_dia',  name: 'Push Up — Diamond', sets: '8 reps × 2'  },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            sets: '15 reps × 3' },
        { id: 'riseup', name: 'Rise Up',           sets: '15 reps × 3' },
        { id: 'climb',  name: 'Mountain Climbing', sets: '20 sec × 3'  },
        { id: 'plank',  name: 'Plank',             sets: '1 min × 3'   },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', sets: '10 reps × 3'  },
        { id: 'lunge',  name: 'Lunges',     sets: '10 steps × 3' },
      ]},
    ],
    F: [
      { section: 'Run / Walk',  items: [{ id: 'run',   name: 'Run / Walk', sets: '12 km / week' }] },
      { section: 'Dips',        items: [{ id: 'dips',  name: 'Dips',       sets: '10 reps × 3'  }] },
      { section: 'Pull Up', items: [
        { id: 'pu_over',  name: 'Pull Up — Overhand Grip',  sets: '10 reps × 3' },
        { id: 'pu_under', name: 'Pull Up — Underhand Grip', sets: '10 reps × 3' },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  sets: '15 reps × 2' },
        { id: 'push_dec',  name: 'Push Up — Decline', sets: '8 reps × 2'  },
        { id: 'push_inc',  name: 'Push Up — Incline', sets: '8 reps × 2'  },
        { id: 'push_dia',  name: 'Push Up — Diamond', sets: '8 reps × 2'  },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            sets: '15 reps × 3' },
        { id: 'riseup', name: 'Rise Up',           sets: '15 reps × 3' },
        { id: 'climb',  name: 'Mountain Climbing', sets: '20 sec × 3'  },
        { id: 'plank',  name: 'Plank',             sets: '1 min × 3'   },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', sets: '10 reps × 3'  },
        { id: 'lunge',  name: 'Lunges',     sets: '10 steps × 3' },
      ]},
    ],
  },
  intermediate: {
    label: '⚡ Intermediate',
    desc: 'Increase volume and intensity. Push past your comfort zone.',
    pillBg: '#D1FAE5', pillColor: '#065F46',
    runTarget: 20,
    M: [
      { section: 'Run / Walk',  items: [{ id: 'run',  name: 'Run / Walk', sets: '20 km / week' }] },
      { section: 'Dips',        items: [{ id: 'dips', name: 'Dips',       sets: '20 reps × 4'  }] },
      { section: 'Pull Up', items: [
        { id: 'pu_wide',  name: 'Pull Up — Wide/Chest', sets: '12 reps × 3' },
        { id: 'pu_norm',  name: 'Pull Up — Normal',     sets: '12 reps × 3' },
        { id: 'pu_close', name: 'Pull Up — Close',      sets: '12 reps × 3' },
        { id: 'pu_chin',  name: 'Chin Up',              sets: '12 reps × 3' },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  sets: '20 reps × 3' },
        { id: 'push_dec',  name: 'Push Up — Decline', sets: '12 reps × 3' },
        { id: 'push_inc',  name: 'Push Up — Incline', sets: '12 reps × 3' },
        { id: 'push_dia',  name: 'Push Up — Diamond', sets: '12 reps × 3' },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            sets: '20 reps × 4' },
        { id: 'riseup', name: 'Rise Up',           sets: '20 reps × 4' },
        { id: 'climb',  name: 'Mountain Climbing', sets: '30 sec × 4'  },
        { id: 'plank',  name: 'Plank',             sets: '2 min × 3'   },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', sets: '15 reps × 4'  },
        { id: 'lunge',  name: 'Lunges',     sets: '15 steps × 4' },
      ]},
    ],
    F: [
      { section: 'Run / Walk',  items: [{ id: 'run',  name: 'Run / Walk', sets: '20 km / week' }] },
      { section: 'Dips',        items: [{ id: 'dips', name: 'Dips',       sets: '15 reps × 3'  }] },
      { section: 'Pull Up', items: [
        { id: 'pu_over',  name: 'Pull Up — Overhand Grip',  sets: '12 reps × 3' },
        { id: 'pu_under', name: 'Pull Up — Underhand Grip', sets: '12 reps × 3' },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  sets: '20 reps × 3' },
        { id: 'push_dec',  name: 'Push Up — Decline', sets: '12 reps × 3' },
        { id: 'push_inc',  name: 'Push Up — Incline', sets: '12 reps × 3' },
        { id: 'push_dia',  name: 'Push Up — Diamond', sets: '12 reps × 3' },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            sets: '20 reps × 4' },
        { id: 'riseup', name: 'Rise Up',           sets: '20 reps × 4' },
        { id: 'climb',  name: 'Mountain Climbing', sets: '30 sec × 4'  },
        { id: 'plank',  name: 'Plank',             sets: '2 min × 3'   },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', sets: '15 reps × 4'  },
        { id: 'lunge',  name: 'Lunges',     sets: '15 steps × 4' },
      ]},
    ],
  },
  advanced: {
    label: '🔥 Advanced',
    desc: 'Maximum output. Elite volume, short rest, high intensity.',
    pillBg: '#FEE2E2', pillColor: '#7F1D1D',
    runTarget: 30,
    M: [
      { section: 'Run / Walk',  items: [{ id: 'run',  name: 'Run / Walk', sets: '30 km / week' }] },
      { section: 'Dips',        items: [{ id: 'dips', name: 'Dips',       sets: '25 reps × 5'  }] },
      { section: 'Pull Up', items: [
        { id: 'pu_wide',  name: 'Pull Up — Wide/Chest', sets: '15 reps × 4' },
        { id: 'pu_norm',  name: 'Pull Up — Normal',     sets: '15 reps × 4' },
        { id: 'pu_close', name: 'Pull Up — Close',      sets: '15 reps × 4' },
        { id: 'pu_chin',  name: 'Chin Up',              sets: '15 reps × 4' },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  sets: '25 reps × 4' },
        { id: 'push_dec',  name: 'Push Up — Decline', sets: '15 reps × 4' },
        { id: 'push_inc',  name: 'Push Up — Incline', sets: '15 reps × 4' },
        { id: 'push_dia',  name: 'Push Up — Diamond', sets: '15 reps × 4' },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            sets: '25 reps × 5' },
        { id: 'riseup', name: 'Rise Up',           sets: '25 reps × 5' },
        { id: 'climb',  name: 'Mountain Climbing', sets: '45 sec × 5'  },
        { id: 'plank',  name: 'Plank',             sets: '3 min × 3'   },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', sets: '20 reps × 5'  },
        { id: 'lunge',  name: 'Lunges',     sets: '20 steps × 5' },
      ]},
    ],
    F: [
      { section: 'Run / Walk',  items: [{ id: 'run',  name: 'Run / Walk', sets: '30 km / week' }] },
      { section: 'Dips',        items: [{ id: 'dips', name: 'Dips',       sets: '20 reps × 4'  }] },
      { section: 'Pull Up', items: [
        { id: 'pu_over',  name: 'Pull Up — Overhand Grip',  sets: '15 reps × 4' },
        { id: 'pu_under', name: 'Pull Up — Underhand Grip', sets: '15 reps × 4' },
      ]},
      { section: 'Push Up', items: [
        { id: 'push_norm', name: 'Push Up — Normal',  sets: '25 reps × 4' },
        { id: 'push_dec',  name: 'Push Up — Decline', sets: '15 reps × 4' },
        { id: 'push_inc',  name: 'Push Up — Incline', sets: '15 reps × 4' },
        { id: 'push_dia',  name: 'Push Up — Diamond', sets: '15 reps × 4' },
      ]},
      { section: 'Core', items: [
        { id: 'situp',  name: 'Sit Up',            sets: '25 reps × 5' },
        { id: 'riseup', name: 'Rise Up',           sets: '25 reps × 5' },
        { id: 'climb',  name: 'Mountain Climbing', sets: '45 sec × 5'  },
        { id: 'plank',  name: 'Plank',             sets: '3 min × 3'   },
      ]},
      { section: 'Squat', items: [
        { id: 'sqjump', name: 'Squat Jump', sets: '20 reps × 5'  },
        { id: 'lunge',  name: 'Lunges',     sets: '20 steps × 5' },
      ]},
    ],
  },
}

/* ─── Style tokens ─────────────────────────────────────── */
const S = {
  card: {
    background: '#FFFFFF',
    border: '1px solid #F0F0F0',
    borderRadius: 12,
    padding: '16px 18px',
  },
  sectionLbl: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #E5E7EB',
    borderRadius: 7,
    fontSize: 13,
    color: '#1A1A1A',
    background: '#FAFAFA',
    outline: 'none',
  },
  dot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#F97316',
    flexShrink: 0,
    marginTop: 22,
  },
}

/* ─── Daily Exercise sub-component ────────────────────── */
const DailyExercise = () => {
  const [level, setLevel]   = useState('beginner')
  const [gender, setGender] = useState('M')
  const [checks, setChecks] = useState({})
  const [runKm, setRunKm]   = useState('')
  const [runMin, setRunMin] = useState('')

  const cfg    = LEVEL_CONFIG[level]
  const groups = cfg[gender]
  const target = cfg.runTarget
  const runPct = Math.min(100, Math.round(((parseFloat(runKm) || 0) / target) * 100))

  const allItems = groups.flatMap(g => g.items)
  const total    = allItems.length
  const done     = allItems.filter(ex => checks[`${level}_${gender}_${ex.id}`]).length
  const exPct    = total > 0 ? Math.round((done / total) * 100) : 0

  const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }))

  const handleLevelChange = (lv) => { setLevel(lv); setChecks({}); setRunKm(''); setRunMin('') }
  const handleGenderChange = (g)  => { setGender(g); setChecks({}) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>Level:</span>
          <select
            value={level}
            onChange={e => handleLevelChange(e.target.value)}
            style={{ ...S.input, width: 'auto', padding: '6px 10px', cursor: 'pointer' }}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 12, fontWeight: 600,
            background: cfg.pillBg, color: cfg.pillColor,
          }}>
            {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['M', 'Male'], ['F', 'Female']].map(([g, lbl]) => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              style={{
                padding: '6px 16px', borderRadius: 7,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                border: '1px solid',
                borderColor: gender === g ? '#F97316' : '#E5E7EB',
                background: gender === g ? '#F97316' : '#FFFFFF',
                color: gender === g ? '#FFFFFF' : '#6B7280',
                transition: 'all 0.15s',
              }}
            >{lbl}</button>
          ))}
        </div>
      </div>

      {/* Level description */}
      <div style={{
        fontSize: 13, color: '#92400E',
        background: '#FFFBEB', borderRadius: 8,
        padding: '10px 14px', borderLeft: '3px solid #F97316',
      }}>
        {cfg.desc}
      </div>

      {/* Run tracker */}
      <div style={S.card}>
        <div style={S.sectionLbl}>🏃 Run / Walk Tracker</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ height: 6, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${runPct}%`, background: '#F97316', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: '#9CA3AF' }}>
            <span>{parseFloat(runKm) || 0} km / {target} km</span>
            <span style={{ color: '#F97316', fontWeight: 600 }}>{runPct}%</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number" min="0" placeholder="0" value={runMin}
              onChange={e => setRunMin(e.target.value)}
              style={{ ...S.input, textAlign: 'center' }}
            />
            <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number" min="0" step="0.1" placeholder="0" value={runKm}
              onChange={e => setRunKm(e.target.value)}
              style={{ ...S.input, textAlign: 'center' }}
            />
            <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>km</span>
          </div>
          <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>Target: {target} km/week</span>
        </div>
      </div>

      {/* Exercise checklist */}
      <div style={S.card}>
        <div style={S.sectionLbl}>💪 Daily Exercise</div>
        {groups.map(group => (
          <div key={group.section} style={{ marginBottom: 12 }}>
            {/* Section header */}
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              color: '#D1D5DB', textTransform: 'uppercase',
              paddingBottom: 5, borderBottom: '1px solid #F3F4F6', marginBottom: 4,
            }}>
              {group.section}
            </div>
            {group.items.map(ex => {
              const key     = `${level}_${gender}_${ex.id}`
              const checked = !!checks[key]
              return (
                <div
                  key={ex.id}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '7px 0', borderBottom: '1px solid #F9FAFB',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggle(key)}
                >
                  <span style={{
                    flex: 1, fontSize: 13,
                    color: checked ? '#9CA3AF' : '#1A1A1A',
                    textDecoration: checked ? 'line-through' : 'none',
                    transition: 'all 0.15s',
                  }}>
                    {ex.name}
                  </span>
                  <span style={{
                    fontSize: 11, color: '#6B7280',
                    background: '#F3F4F6',
                    padding: '2px 8px', borderRadius: 5,
                    marginRight: 12, whiteSpace: 'nowrap',
                  }}>
                    {ex.sets}
                  </span>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5,
                    border: checked ? 'none' : '1.5px solid #D1D5DB',
                    background: checked ? '#F97316' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.15s',
                  }}>
                    {checked && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {/* Progress footer */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${exPct}%`, background: '#F97316', borderRadius: 3, transition: 'width 0.4s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: '#9CA3AF' }}>
              <span>Daily Progress</span>
              <span>{done} / {total} exercises</span>
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#F97316', flexShrink: 0 }}>{exPct}%</div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Kebiasaan component ────────────────────────── */
export const Kebiasaan = () => {
  const { habits, dailyHealth, updateDailyHealth } = useApp()
  const [activeTab, setActiveTab] = useState('habit')

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

  const GOAL = 8
  const glasses = Array.from({ length: GOAL + 1 }, (_, i) => i)

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Habit Tracker</h1>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
          {completedCount} of {totalCount} habits completed today
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F0' }}>
        {[
          { key: 'habit',    label: 'Habit Tracker' },
          { key: 'exercise', label: 'Daily Exercise' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? '#F97316' : '#9CA3AF',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.key ? '#F97316' : 'transparent'}`,
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Habit Tracker ───────────────────────────── */}
      {activeTab === 'habit' && (
        <>
          {/* Row 1: Nutrition + Hydration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Nutrition Log */}
            <div style={S.card}>
              <div style={S.sectionLbl}>Nutrition Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {MEAL_SLOTS.map(({ key, label, placeholder }, i) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={S.dot} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{label}</div>
                      <input
                        type="text"
                        value={meals[i] || ''}
                        onChange={e => {
                          const updated = [...meals]
                          updated[i] = e.target.value
                          updateDailyHealth({ meals: updated })
                        }}
                        placeholder={placeholder}
                        style={S.input}
                        onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.background = '#FFF7ED' }}
                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hydration Tracker */}
            <div style={S.card}>
              <div style={S.sectionLbl}>Hydration Tracker</div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 44, fontWeight: 700, color: '#F97316', lineHeight: 1 }}>{waterIntake}</span>
                <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>of {GOAL} glasses today</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                {glasses.map(i => {
                  const filled  = i < waterIntake
                  const isExtra = i >= GOAL
                  return (
                    <button
                      key={i}
                      onClick={() => updateDailyHealth({ waterIntake: filled ? i : i + 1 })}
                      title={`Set to ${i + 1} glass${i + 1 > 1 ? 'es' : ''}`}
                      style={{
                        width: 38, height: 38, borderRadius: 9,
                        border: filled ? 'none' : '1.5px solid #FED7AA',
                        background: filled ? (isExtra ? '#FDBA74' : '#F97316') : 'transparent',
                        color: filled ? '#fff' : '#FED7AA',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8 8 5 12 5 16a7 7 0 0014 0c0-4-3-8-7-14z"/>
                      </svg>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => updateDailyHealth({ waterIntake: waterIntake + 1 })}
                style={{
                  width: '100%', padding: '8px', borderRadius: 9,
                  background: '#F97316', border: 'none',
                  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8 8 5 12 5 16a7 7 0 0014 0c0-4-3-8-7-14z"/>
                </svg>
                + 1 glass
              </button>
            </div>
          </div>

          {/* Row 2: Activity + Sleep + Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

            {/* Activity Log */}
            <div style={S.card}>
              <div style={S.sectionLbl}>Activity Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={S.dot} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Activity type</div>
                    <select
                      value={dailyHealth.activityType || 'Walking'}
                      onChange={e => updateDailyHealth({ activityType: e.target.value })}
                      style={{ ...S.input, cursor: 'pointer' }}
                    >
                      {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={S.dot} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Steps / Duration</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => updateDailyHealth({ activity: Math.max(0, activity - 100) })}
                        style={{ width: 32, height: 34, borderRadius: 7, border: '1px solid #E5E7EB', background: '#F5F5F5', fontSize: 18, cursor: 'pointer', color: '#6B7280', flexShrink: 0 }}
                      >−</button>
                      <input
                        type="number" value={activity}
                        onChange={e => updateDailyHealth({ activity: Number(e.target.value) })}
                        style={{ flex: 1, padding: '8px 6px', border: '1px solid #E5E7EB', borderRadius: 7, fontSize: 13, textAlign: 'center', background: '#FAFAFA', outline: 'none', color: '#1A1A1A' }}
                      />
                      <button
                        onClick={() => updateDailyHealth({ activity: activity + 100 })}
                        style={{ width: 32, height: 34, borderRadius: 7, border: '1px solid #E5E7EB', background: '#F5F5F5', fontSize: 18, cursor: 'pointer', color: '#6B7280', flexShrink: 0 }}
                      >+</button>
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>steps</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep Log */}
            <div style={S.card}>
              <div style={S.sectionLbl}>Sleep Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: 'sleepStart', label: 'Bedtime',  icon: '🌙' },
                  { key: 'sleepEnd',   label: 'Wake up',  icon: '☀️' },
                ].map(({ key, label, icon }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={S.dot} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{icon} {label}</div>
                      <input
                        type="time"
                        value={dailyHealth[key] || ''}
                        onChange={e => updateDailyHealth({ [key]: e.target.value })}
                        style={S.input}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {sleepDuration && (
                <div style={{
                  marginTop: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#FFF7ED', borderRadius: 9, padding: '10px 14px',
                }}>
                  <span style={{ fontSize: 12, color: '#C2410C', fontWeight: 500 }}>Total sleep</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#F97316' }}>{sleepDuration}</span>
                </div>
              )}
            </div>

            {/* Today's Summary */}
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
        </>
      )}

      {/* ── Tab: Daily Exercise ──────────────────────────── */}
      {activeTab === 'exercise' && <DailyExercise />}
    </div>
  )
}
