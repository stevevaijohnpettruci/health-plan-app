import { useState, useEffect } from 'react';
import { getWeeklyRun, postWeeklyRun, putWeeklyRun } from '../../services/api';
import { DAYS, LEVEL_CONFIG, LEVEL_TO_INT, INT_TO_LEVEL, S } from './constants';
import { SaveBar } from './SaveBar';

export const WeeklyRunTracker = () => {
  const [level, setLevel] = useState('beginner');
  const [runs, setRuns] = useState({});
  const [runId, setRunId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const cfg = LEVEL_CONFIG[level];
  const target = cfg.runTarget;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWeeklyRun();
        // Backend returns array, ambil record pertama
        const data = res?.data?.weekly_run?.[0];
        if (data) {
          setRunId(data.id);
          // level di DB disimpan sebagai integer, konversi balik ke string
          setLevel(INT_TO_LEVEL[data.level] || 'beginner');
          setRuns({
            Mon: { km: data.mon ?? 0 },
            Tue: { km: data.tue ?? 0 },
            Wed: { km: data.wed ?? 0 },
            Thu: { km: data.thu ?? 0 },
            Fri: { km: data.fri ?? 0 },
            Sat: { km: data.sat ?? 0 },
            Sun: { km: data.sun ?? 0 },
          });
        }
      } catch (err) {
        console.error('Failed to load weekly run:', err);
      }
    };
    fetchData();
  }, []);

  const totalKm = DAYS.reduce((sum, d) => sum + (parseFloat(runs[d]?.km) || 0), 0);
  const pct = Math.min(100, Math.round((totalKm / target) * 100));
  const updateKm = (day, val) => setRuns((prev) => ({ ...prev, [day]: { km: val } }));

  const handleSave = async () => {
    setStatus('saving');
    setErrorMsg('');
    // FIX: level harus integer sesuai Joi schema backend (Joi.number().integer())
    const payload = {
      level: LEVEL_TO_INT[level],
      target_distance: target,
      mon: parseFloat(runs['Mon']?.km) || 0,
      tue: parseFloat(runs['Tue']?.km) || 0,
      wed: parseFloat(runs['Wed']?.km) || 0,
      thu: parseFloat(runs['Thu']?.km) || 0,
      fri: parseFloat(runs['Fri']?.km) || 0,
      sat: parseFloat(runs['Sat']?.km) || 0,
      sun: parseFloat(runs['Sun']?.km) || 0,
    };
    try {
      if (runId) {
        await putWeeklyRun(runId, payload);
      } else {
        const res = await postWeeklyRun(payload);
        setRunId(res?.data?.weekly_run?.id);
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
          onChange={(e) => setLevel(e.target.value)}
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

      {/* Target + progress */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={S.sectionLbl}>🏃 Weekly Run Target</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F97316' }}>{totalKm.toFixed(1)} / {target} km</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#22C55E' : '#F97316', borderRadius: 3, transition: 'width 0.4s' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAYS.map((day) => {
            const km = parseFloat(runs[day]?.km) || 0;
            const dayPct = Math.min(100, Math.round((km / (target / 7)) * 100));
            return (
              <div key={day} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 60px 70px', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{day}</span>
                <input
                  type="number" min="0" step="0.1" placeholder="0"
                  value={runs[day]?.km || ''}
                  onChange={(e) => updateKm(day, e.target.value)}
                  style={{ ...S.input, textAlign: 'center' }}
                />
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>km</span>
                <div style={{ height: 4, borderRadius: 2, background: '#F5F5F5', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${dayPct}%`, background: '#F97316', borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SaveBar onSave={handleSave} status={status} errorMsg={errorMsg} label={runId ? 'Update weekly run' : 'Save weekly run'} />
    </div>
  );
};
