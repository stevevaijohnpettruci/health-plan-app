import { useState, useEffect } from 'react';
import { getWeeklyExercise, postWeeklyExercise, putWeeklyExercise } from '../../services/api';
import { DAYS, LEVEL_CONFIG, S, fmtSets } from './constants';
import { SaveBar } from './SaveBar';

export const WeeklyExercise = () => {
  const [level, setLevel] = useState('beginner');
  // checks: { `${level}_${exId}_${day}`: true }
  const [checks, setChecks] = useState({});
  const [exerciseId, setExerciseId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const cfg = LEVEL_CONFIG[level];
  const allItems = cfg.groups.flatMap((g) => g.items);
  const totalTarget = allItems.reduce((sum, ex) => sum + ex.days, 0);
  const totalDone = allItems.reduce((sum, ex) => {
    const doneDays = DAYS.filter((d) => checks[`${level}_${ex.id}_${d}`]).length;
    return sum + Math.min(doneDays, ex.days);
  }, 0);
  const weekPct = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;

  // FIX: Fetch existing data saat komponen mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWeeklyExercise();
        const data = res?.data?.weekly_exercise?.[0];
        if (data) {
          setExerciseId(data.id);
          const savedLevel = data.level || 'beginner';
          setLevel(savedLevel);

          // Restore checks dari exercises_data array di DB
          const restoredChecks = {};
          (data.exercises_data || []).forEach((ex) => {
            DAYS.forEach((day) => {
              const dayKey = day.toLowerCase().slice(0, 3);
              if (ex[dayKey]) {
                // Cari id exercise berdasarkan nama
                const match = LEVEL_CONFIG[savedLevel]?.groups
                  .flatMap((g) => g.items)
                  .find((item) => item.name === ex.exercise_name);
                if (match) restoredChecks[`${savedLevel}_${match.id}_${day}`] = true;
              }
            });
          });
          setChecks(restoredChecks);
        }
      } catch (err) {
        console.error('Failed to load weekly exercise:', err);
      }
    };
    fetchData();
  }, []);

  const toggle = (key) => setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    setStatus('saving');
    setErrorMsg('');

    // FIX KRITIS: Backend expect exercises_data sebagai array of objects
    // bukan checks object. Format sesuai Joi schema: { exercise_name, mon, tue, ... }
    const exercisesData = allItems.map((ex) => ({
      exercise_name: ex.name,
      mon: !!checks[`${level}_${ex.id}_Mon`],
      tue: !!checks[`${level}_${ex.id}_Tue`],
      wed: !!checks[`${level}_${ex.id}_Wed`],
      thu: !!checks[`${level}_${ex.id}_Thu`],
      fri: !!checks[`${level}_${ex.id}_Fri`],
      sat: !!checks[`${level}_${ex.id}_Sat`],
      sun: !!checks[`${level}_${ex.id}_Sun`],
    }));

    const payload = { level, exercises_data: exercisesData };

    try {
      if (exerciseId) {
        await putWeeklyExercise(exerciseId, payload);
      } else {
        const res = await postWeeklyExercise(payload);
        setExerciseId(res?.data?.weekly_exercise?.id);
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to save.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Level selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>Level:</span>
        <select
          value={level}
          onChange={(e) => { setLevel(e.target.value); setChecks({}); }}
          style={{ ...S.input, width: 'auto', padding: '6px 10px', cursor: 'pointer' }}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: cfg.pillBg, color: cfg.pillColor }}>
          {cfg.label}
        </span>
      </div>

      <div style={{ fontSize: 13, color: '#92400E', background: '#FFFBEB', borderRadius: 8, padding: '10px 14px', borderLeft: '3px solid #F97316' }}>
        {cfg.desc}
      </div>

      {/* Day header */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {DAYS.map((d) => (
          <span key={d} style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', background: '#F3F4F6', borderRadius: 6, padding: '3px 8px' }}>
            {d}
          </span>
        ))}
      </div>

      {/* Exercise list */}
      <div style={S.card}>
        <div style={S.sectionLbl}>💪 Weekly Exercise</div>
        {cfg.groups.map((group) => (
          <div key={group.section} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#D1D5DB', textTransform: 'uppercase', paddingBottom: 5, borderBottom: '1px solid #F3F4F6', marginBottom: 8 }}>
              {group.section}
            </div>
            {group.items.map((ex) => {
              const doneDays = DAYS.filter((d) => checks[`${level}_${ex.id}_${d}`]).length;
              const exPct = Math.min(100, Math.round((doneDays / ex.days) * 100));
              const isReached = doneDays >= ex.days;
              return (
                <div key={ex.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #F9FAFB' }}>
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
                  <div style={{ height: 4, borderRadius: 2, background: '#F5F5F5', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${exPct}%`, background: isReached ? '#22C55E' : '#F97316', borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {DAYS.map((day) => {
                      const key = `${level}_${ex.id}_${day}`;
                      const checked = !!checks[key];
                      return (
                        <button
                          key={day}
                          onClick={() => toggle(key)}
                          title={day}
                          style={{
                            width: 32, height: 28, borderRadius: 6,
                            border: checked ? 'none' : '1.5px solid #E5E7EB',
                            background: checked ? '#F97316' : '#FAFAFA',
                            color: checked ? '#fff' : '#9CA3AF',
                            fontSize: 10, fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s', flexShrink: 0,
                          }}
                        >
                          {checked ? (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : day.slice(0, 1)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
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
          <div style={{ fontSize: 24, fontWeight: 700, color: weekPct >= 100 ? '#22C55E' : '#F97316', flexShrink: 0 }}>
            {weekPct}%
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} status={status} errorMsg={errorMsg} label={exerciseId ? 'Update weekly exercise' : 'Save weekly exercise'} />
    </div>
  );
};
