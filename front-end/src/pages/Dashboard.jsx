import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import {
  getTodayScheduleApi,
  getDailyLogByDate,
  getActivitiesByDailyLog,
  getNutritionLogsByDailyLogId,
  getWeightLogs,
} from '../services/api';

/* ── Sub-components ── */

const MetricCard = ({ label, value, unit, sub, subColor = '#9CA3AF', barPct, barColor = '#38BDF8' }) => (
  <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 16px' }}>
    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
      {value}
      {unit && <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF', marginLeft: 4 }}>{unit}</span>}
    </div>
    {sub && <div style={{ fontSize: 11, color: subColor, marginTop: 4 }}>{sub}</div>}
    {barPct !== undefined && (
      <div style={{ height: 3, borderRadius: 2, background: '#F5F5F5', marginTop: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(barPct, 100)}%`, background: barColor, borderRadius: 2, transition: 'width 0.5s' }} />
      </div>
    )}
  </div>
);

const HABIT_TYPE = {
  food:  { bg: '#FFF7ED', color: '#C2410C', label: 'Food' },
  water: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Water' },
  sport: { bg: '#F0FDF4', color: '#166534', label: 'Sport' },
  sleep: { bg: '#FAF5FF', color: '#6B21A8', label: 'Sleep' },
};

/* ── Main Dashboard ── */

export const Dashboard = () => {
  const { userProfile } = useApp();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [dailyLogId, setDailyLogId] = useState(null);
  const [waterMl, setWaterMl] = useState(0);
  const [caloriesIn, setCaloriesIn] = useState(0);
  const [caloriesOut, setCaloriesOut] = useState(0);
  const [habits, setHabits] = useState([]);
  const [initialWeight, setInitialWeight] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const waterTarget = userProfile?.dailyWaterIntakeGoal || 2000;
  const waterGlasses = Math.round(waterMl / 250);
  const waterGoalGlasses = Math.round(waterTarget / 250);
  const waterPct = Math.round((waterMl / waterTarget) * 100);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // 1. Today schedule (lazy init daily log)
        const schedRes = await getTodayScheduleApi();
        const progress = schedRes?.data?.progress;
        setWaterMl(progress?.water_ml || 0);
        setCaloriesIn(progress?.calories_in || 0);
        setCaloriesOut(progress?.calories_out || 0);

        // 2. Get daily log id for today
        const logRes = await getDailyLogByDate(today);
        const logId = logRes?.data?.dailyLog?.id;
        setDailyLogId(logId);

        // 3. Nutrition + Activity logs untuk habits
        let nutritionLogs = [];
        let activityLogs = [];
        let sleepStart = null;

        if (logId) {
          const [nutriRes, actRes] = await Promise.allSettled([
            getNutritionLogsByDailyLogId(logId),
            getActivitiesByDailyLog(logId),
          ]);
          nutritionLogs = nutriRes.status === 'fulfilled' ? (nutriRes.value?.data?.nutritionLogs || []) : [];
          activityLogs = actRes.status === 'fulfilled' ? (actRes.value?.data?.activityLogs || []) : [];
          sleepStart = logRes?.data?.dailyLog?.sleep_start_time || null;
        }

        // 4. Build today's habits dari data real
        const loggedMealTypes = nutritionLogs.flatMap((n) => (n.meals || []).map((m) => m.meal_type?.toLowerCase()));
        buildHabits(loggedMealTypes, progress?.water_ml || 0, waterTarget, activityLogs, sleepStart);

        // 5. Weight logs — current dari log terbaru, initial dari userProfile
        const wRes = await getWeightLogs().catch(() => null);
        const wLogs = wRes?.data?.weight_logs || [];
        if (wLogs.length > 0) {
          setCurrentWeight(parseFloat(wLogs[wLogs.length - 1].weight_kg));
        } else {
          setCurrentWeight(userProfile?.weight || null);
        }
        // Initial weight selalu dari profil (basic identity saat onboarding)
        setInitialWeight(userProfile?.weight || null);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userProfile?.weight]);

  const buildHabits = (loggedMealTypes, waterMlVal, waterTargetVal, activityLogs, sleepStart) => {
    setHabits([
      {
        id: 'breakfast',
        name: 'Breakfast',
        time: '07:00',
        type: 'food',
        completed: loggedMealTypes.includes('breakfast'),
      },
      {
        id: 'lunch',
        name: 'Lunch',
        time: '12:00',
        type: 'food',
        completed: loggedMealTypes.includes('lunch'),
      },
      {
        id: 'dinner',
        name: 'Dinner',
        time: '19:00',
        type: 'food',
        completed: loggedMealTypes.includes('dinner'),
      },
      {
        id: 'water',
        name: `Drink water (${Math.round(waterTargetVal / 1000 * 10) / 10}L goal)`,
        time: 'All day',
        type: 'water',
        completed: waterMlVal >= waterTargetVal,
      },
      {
        id: 'activity',
        name: 'Exercise / Activity',
        time: 'Any time',
        type: 'sport',
        completed: activityLogs.length > 0,
      },
      {
        id: 'sleep',
        name: 'Log sleep time',
        time: '22:00',
        type: 'sleep',
        completed: !!sleepStart,
      },
    ]);
  };

  const done = habits.filter((h) => h.completed).length;

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
        Memuat aktivitas hari ini...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* AI Banner */}
      <div style={{ background: '#F97316', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Your daily plan is ready!</div>
            <div style={{ fontSize: 11, color: '#FED7AA', marginTop: 2 }}>AI has generated today's personalized recommendations</div>
          </div>
        </div>
        <button onClick={() => navigate('/recommendations')} style={{ background: '#FFFFFF', color: '#C2410C', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          View plan →
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <MetricCard
          label="Initial weight"
          value={initialWeight ?? '-'}
          unit={initialWeight ? 'kg' : ''}
          sub={initialWeight ? `First recorded weight` : 'No weight logged yet'}
          barColor="#9CA3AF"
        />
        <MetricCard
          label="Current weight"
          value={currentWeight ?? userProfile?.weight ?? '-'}
          unit={currentWeight || userProfile?.weight ? 'kg' : ''}
          sub={initialWeight && currentWeight
            ? `${(currentWeight - initialWeight) > 0 ? '+' : ''}${(currentWeight - initialWeight).toFixed(1)} kg from initial`
            : userProfile?.targetWeight ? `Target: ${userProfile.targetWeight} kg` : '-'}
          subColor={initialWeight && currentWeight
            ? (currentWeight - initialWeight) <= 0 ? '#16A34A' : '#D97706'
            : '#9CA3AF'}
          barPct={userProfile?.targetWeight && currentWeight
            ? Math.round((currentWeight / userProfile.targetWeight) * 100)
            : undefined}
          barColor="#F97316"
        />
        <MetricCard
          label="Water intake today"
          value={`${waterGlasses} / ${waterGoalGlasses}`}
          unit="glasses"
          sub={`${waterMl} ml · ${waterPct}% of daily goal`}
          subColor={waterMl >= waterTarget ? '#16A34A' : '#D97706'}
          barPct={waterPct}
          barColor="#38BDF8"
        />
      </div>

      {/* Today's habits */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Today's habits</div>
            <span style={{ fontSize: 11, fontWeight: 500, background: '#FFF7ED', color: '#C2410C', padding: '2px 8px', borderRadius: 99 }}>
              {done}/{habits.length}
            </span>
          </div>
          <div>
            {habits.map((h) => {
              const t = HABIT_TYPE[h.type] || HABIT_TYPE.food;
              return (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F9F9F9' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: h.completed ? '#F97316' : 'transparent', border: h.completed ? 'none' : '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                    {h.completed && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: h.completed ? '#9CA3AF' : '#1A1A1A', textDecoration: h.completed ? 'line-through' : 'none' }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{h.time}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: t.bg, color: t.color, flexShrink: 0 }}>{t.label}</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => navigate('/habits')} style={{ width: '100%', marginTop: 12, padding: '8px', borderRadius: 9, background: '#F9FAFB', border: '1px solid #F0F0F0', fontSize: 12, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
            Update today's habits →
          </button>
        </div>

      {/* Calorie balance */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>Calorie balance</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 10 }}>
          {[
            { label: 'Calories in', value: caloriesIn, color: '#1A1A1A' },
            { label: '−', value: null },
            { label: 'Burned', value: caloriesOut, color: '#1A1A1A' },
            { label: '=', value: null },
            { label: 'Net', value: caloriesIn - caloriesOut, color: '#F97316' },
          ].map((item, i) =>
            item.value === null ? (
              <div key={i} style={{ display: 'flex', alignItems: 'center', color: '#9CA3AF', fontSize: 18 }}>{item.label}</div>
            ) : (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: item.color }}>{item.value.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{item.label}</div>
              </div>
            )
          )}
        </div>
        <div style={{ height: 5, borderRadius: 3, background: '#F5F5F5', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(Math.round((caloriesIn / (userProfile?.calorieTarget || 2000)) * 100), 100)}%`, background: '#F97316', borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 5, textAlign: 'right' }}>
          {caloriesOut} kcal burned
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => navigate('/habits')} style={{ flex: 1, padding: '9px 14px', borderRadius: 9, background: '#F9FAFB', border: '1px solid #F0F0F0', fontSize: 12, fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
          Update habits
        </button>
        <button onClick={() => navigate('/recommendations')} style={{ flex: 1, padding: '9px 14px', borderRadius: 9, background: '#F97316', border: 'none', fontSize: 12, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer' }}>
          See today's recommendations →
        </button>
      </div>
    </div>
  );
};
