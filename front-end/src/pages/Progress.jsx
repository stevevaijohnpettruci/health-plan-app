import { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import {
  getDailyLogByDate,
  getNutritionLogsByDailyLogId,
  getGamificationApi,
  getWeightLogs,
  postWeightLog,
} from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

/* ── Sub-components ── */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ color: '#9CA3AF', marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 600, color: '#F97316' }}>{payload[0].value} kg</div>
    </div>
  );
};

const NutritionBar = ({ label, value, target, color }) => {
  const safeValue = typeof value === 'number' ? value : 0;
  const safeTarget = typeof target === 'number' && target > 0 ? target : 1;
  const pct = value === '-' ? 0 : Math.min(Math.round((safeValue / safeTarget) * 100), 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 12, color: '#374151', width: 96, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#F5F5F5', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', width: 40, textAlign: 'right' }}>
        {value === '-' ? '-' : `${safeValue}${label === 'Water' ? 'ml' : 'g'}`}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, unit, sub, subColor }) => (
  <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 16px' }}>
    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
      {value}
      {unit && value !== '-' && <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>{unit}</span>}
    </div>
    {sub && <div style={{ fontSize: 11, color: subColor || '#9CA3AF', marginTop: 4 }}>{sub}</div>}
  </div>
);

const StreakCard = ({ icon, value, label }) => (
  <div style={{ background: '#FFF7ED', borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 600, color: '#F97316', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 11, color: '#C2410C', marginTop: 4 }}>{label}</div>
  </div>
);

const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: active ? 500 : 400, border: `1px solid ${active ? '#F97316' : '#E5E7EB'}`, background: active ? '#F97316' : 'transparent', color: active ? '#FFFFFF' : '#6B7280', cursor: 'pointer', transition: 'all 0.15s' }}>
    {label}
  </button>
);

const PERIODS = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '3 months', days: 90 },
];

/* ── Main ── */

export const Progress = () => {
  const { userProfile, progressData } = useApp();
  const [activePeriod, setActivePeriod] = useState('7 days');
  const [isLoading, setIsLoading] = useState(true);

  const [weightData, setWeightData] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [nutrition, setNutrition] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [weightInput, setWeightInput] = useState('');
  const [savingWeight, setSavingWeight] = useState(false);
  const [weightMsg, setWeightMsg] = useState('');

  const streak = gamification || progressData?.streak || {};
  const badges = gamification?.unlocked_badges || progressData?.badges || [];

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [weightRes, gamifRes, logRes] = await Promise.allSettled([
          getWeightLogs(),
          getGamificationApi(),
          getDailyLogByDate(today),
        ]);

        // Weight logs real
        const wlogs = weightRes.status === 'fulfilled' ? (weightRes.value?.data?.weight_logs || []) : [];
        setAllLogs(wlogs);
        buildWeightChart(wlogs, activePeriod);

        // Gamification
        if (gamifRes.status === 'fulfilled') {
          setGamification(gamifRes.value?.data?.gamification || null);
        }

        // Nutrition hari ini
        const logId = logRes.status === 'fulfilled' ? logRes.value?.data?.dailyLog?.id : null;
        if (logId) {
          try {
            const nutriRes = await getNutritionLogsByDailyLogId(logId);
            const logs = nutriRes?.data?.nutritionLogs || [];
            // SUM semua nutrition logs hari ini
            const totals = logs.reduce((acc, n) => ({
              calories: acc.calories + (n.total_calories || 0),
              protein: acc.protein + (n.total_protein_g || 0),
              carbs: acc.carbs + (n.total_carbs_g || 0),
              fat: acc.fat + (n.total_fat_g || 0),
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
            setNutrition(totals);
          } catch { setNutrition(null); }
        }
      } catch (err) {
        console.error('Progress load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Filter logs berdasarkan period yang dipilih
  const buildWeightChart = (logs, period) => {
    const days = PERIODS.find((p) => p.label === period)?.days || 7;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const filtered = logs.filter((l) => new Date(l.log_date) >= cutoff);
    setWeightData(filtered.map((l) => ({
      day: new Date(l.log_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'numeric' }),
      weight: parseFloat(l.weight_kg),
    })));
  };

  useEffect(() => {
    buildWeightChart(allLogs, activePeriod);
  }, [activePeriod, allLogs]);

  const handleLogWeight = async () => {
    if (!weightInput || parseFloat(weightInput) <= 0) return;
    setSavingWeight(true);
    setWeightMsg('');
    try {
      await postWeightLog({ weight_kg: parseFloat(weightInput), log_date: today });
      setWeightMsg('✅ Saved!');
      setWeightInput('');
      // Refresh chart
      const res = await getWeightLogs();
      const logs = res?.data?.weight_logs || [];
      setAllLogs(logs);
      buildWeightChart(logs, activePeriod);
    } catch {
      setWeightMsg('❌ Failed to save.');
    } finally {
      setSavingWeight(false);
      setTimeout(() => setWeightMsg(''), 3000);
    }
  };

  const latestLog = allLogs.length > 0 ? allLogs[allLogs.length - 1] : null;
  const currentWeight = latestLog ? parseFloat(latestLog.weight_kg) : '-';
  const targetWeight = userProfile?.targetWeight ?? '-';
  const weightDiff = typeof currentWeight === 'number' && typeof targetWeight === 'number'
    ? (currentWeight - targetWeight).toFixed(1)
    : null;

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A' }}>Health Progress</h1>
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>Track your health journey over time</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map((p) => (
            <FilterBtn key={p.label} label={p.label} active={activePeriod === p.label} onClick={() => setActivePeriod(p.label)} />
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Current weight" value={currentWeight} unit="kg" sub={weightDiff !== null ? `${weightDiff > 0 ? '+' : ''}${weightDiff} kg from target` : '-'} subColor={weightDiff <= 0 ? '#16A34A' : '#D97706'} />
        <StatCard label="Target weight" value={targetWeight} unit="kg" sub={userProfile?.primaryGoal || '-'} />
        <StatCard label="BMI" value={userProfile?.bmi ?? '-'} sub={userProfile?.bmiCategory || '-'} subColor={userProfile?.bmiCategory === 'Normal' ? '#16A34A' : '#D97706'} />
        <StatCard label="Active streak" value={gamification?.current_streak ?? streak.consecutive ?? '-'} unit="days" sub={`Longest: ${gamification?.longest_streak ?? streak.longest ?? '-'} days`} subColor="#F97316" />
      </div>

      {/* Weight log input */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', flexShrink: 0 }}>⚖️ Log today's weight</div>
        <input
          type="number" min="1" max="500" step="0.1" placeholder="e.g. 68.5"
          value={weightInput}
          onChange={(e) => setWeightInput(e.target.value)}
          style={{ padding: '7px 12px', border: '1.5px solid #F0F0F0', borderRadius: 8, fontSize: 13, width: 120, outline: 'none' }}
        />
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>kg</span>
        <button onClick={handleLogWeight} disabled={savingWeight || !weightInput}
          style={{ padding: '7px 16px', borderRadius: 8, background: weightInput ? '#F97316' : '#FED7AA', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: weightInput ? 'pointer' : 'not-allowed' }}>
          {savingWeight ? 'Saving...' : 'Save'}
        </button>
        {weightMsg && <span style={{ fontSize: 12, color: weightMsg.includes('✅') ? '#16A34A' : '#DC2626' }}>{weightMsg}</span>}
        <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>Current: {currentWeight !== '-' ? `${currentWeight} kg` : 'Not logged yet'} · Target: {targetWeight !== '-' ? `${targetWeight} kg` : '-'}</span>
      </div>

      {/* Weight trend chart */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Weight trend</div>
          <span style={{ fontSize: 11, color: '#F97316', fontWeight: 500, background: '#FFF7ED', padding: '2px 10px', borderRadius: 99 }}>
            {currentWeight !== '-' ? `${currentWeight} kg` : '-'} → {targetWeight !== '-' ? `${targetWeight} kg` : '-'}
          </span>
        </div>
        {weightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weightData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 5, strokeWidth: 0 }} activeDot={{ r: 7, fill: '#F97316' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1D5DB', fontSize: 13 }}>
            {isLoading ? 'Loading...' : 'No data for this period'}
          </div>
        )}
      </div>

      {/* Nutrition + Streak & Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Nutrition today */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>Today's nutrition</div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 14 }}>From all meals logged today</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 12, color: '#374151', width: 96, flexShrink: 0 }}>Calories</div>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#F5F5F5', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(Math.round(((nutrition?.calories || 0) / 2000) * 100), 100)}%`, background: '#F97316', borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', width: 56, textAlign: 'right' }}>{nutrition?.calories || 0} kcal</div>
            </div>
            <NutritionBar label="Protein" value={nutrition?.protein ?? '-'} target={60} color="#FB923C" />
            <NutritionBar label="Carbs" value={nutrition?.carbs ?? '-'} target={250} color="#FCD34D" />
            <NutritionBar label="Fat" value={nutrition?.fat ?? '-'} target={65} color="#FDBA74" />
          </div>
          {!nutrition && (
            <div style={{ marginTop: 14, fontSize: 12, color: '#D1D5DB', fontStyle: 'italic' }}>No meals logged today.</div>
          )}
        </div>

        {/* Streak + Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Streak &amp; consistency</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <StreakCard icon="🔥" value={gamification?.current_streak ?? streak.consecutive ?? '-'} label="Days in a row" />
              <StreakCard icon="⚡" value={gamification?.xp_points ?? streak.total ?? '-'} label="Total XP" />
              <StreakCard icon="🏆" value={gamification?.longest_streak ?? streak.longest ?? '-'} label="Longest streak" />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px', flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Achievements</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {badges.length > 0 ? badges.map((badge, idx) => (
                <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: badge.earned ? 500 : 400, background: badge.earned ? '#FFF7ED' : '#F5F5F5', border: `1px solid ${badge.earned ? '#FED7AA' : '#E5E7EB'}`, color: badge.earned ? '#C2410C' : '#9CA3AF' }}>
                  <span style={{ fontSize: 11 }}>{badge.earned ? '✓' : '🔒'}</span>
                  {badge.name}
                </div>
              )) : (
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>No badges earned yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
