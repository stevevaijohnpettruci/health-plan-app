import { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import {
  getRecommendationByDateApi,
  generateDailyPlanApi,
  getDailyLogByDate,
  getActivitiesByDailyLog,
  getNutritionLogsByDailyLogId,
  addNutritionLog,
  deleteNutritionLog,
  postActivityLog,
  deleteActivityLog,
  updateDailyLog,
} from '../../services/api';
import { MEAL_SLOTS, ACTIVITY_TYPES, S, calcSleepDuration, formatToHHMM } from './constants';

const today = new Date().toISOString().split('T')[0];
const GOAL = 8;

export const HabitTracker = () => {
  const { dailyHealth, updateDailyHealth } = useApp();

  // Daily log
  const [dailyLogId, setDailyLogId] = useState(null);

  // Meal plan (AI)
  const [mealPlan, setMealPlan] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Nutrition
  const [nutritionList, setNutritionList] = useState([]);
  const [savingNutrition, setSavingNutrition] = useState(false);

  // Activity
  const [activityList, setActivityList] = useState([]);
  const [actType, setActType] = useState('Walking');
  const [actVal, setActVal] = useState(0);
  const [loadingAct, setLoadingAct] = useState(false);
  const [actError, setActError] = useState(null);

  // Hydration
  const [waterIntake, setWaterIntake] = useState(0);
  const [savedWaterIntake, setSavedWaterIntake] = useState(0);
  const [savingHydration, setSavingHydration] = useState(false);
  const [msgHydration, setMsgHydration] = useState('');

  // Sleep
  const [sleepStart, setSleepStart] = useState('');
  const [sleepEnd, setSleepEnd] = useState('');
  const [savedSleepStart, setSavedSleepStart] = useState('');
  const [savedSleepEnd, setSavedSleepEnd] = useState('');
  const [savingSleep, setSavingSleep] = useState(false);
  const [msgSleep, setMsgSleep] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoadingPlan(true);
      try {
        const res = await getRecommendationByDateApi(today);
        setMealPlan(res?.data?.recommendation?.meal_plan_json || []);
      } catch (err) {
        if (err?.response?.status === 404) {
          try {
            await generateDailyPlanApi(today);
            const res = await getRecommendationByDateApi(today);
            setMealPlan(res?.data?.recommendation?.meal_plan_json || []);
          } catch (e) { console.error('Generate failed:', e); }
        }
      } finally { setLoadingPlan(false); }

      try {
        const logRes = await getDailyLogByDate(today);
        const id = logRes.data?.dailyLog?.id;
        if (id) {
          setDailyLogId(id);
          const [actRes, nutriRes] = await Promise.all([
            getActivitiesByDailyLog(id),
            getNutritionLogsByDailyLogId(id),
          ]);
          setActivityList(actRes.data?.activityLogs || []);
          setNutritionList(nutriRes.data?.nutritionLogs || []);

          const glasses = (logRes.data?.dailyLog?.total_water_ml || 0) / 250;
          setWaterIntake(glasses);
          setSavedWaterIntake(glasses);

          const start = logRes.data?.dailyLog?.sleep_start_time;
          const end = logRes.data?.dailyLog?.sleep_end_time;
          if (start) { setSleepStart(formatToHHMM(start)); setSavedSleepStart(formatToHHMM(start)); }
          if (end) { setSleepEnd(formatToHHMM(end)); setSavedSleepEnd(formatToHHMM(end)); }
        }
      } catch (err) { console.error('Failed to load logs:', err); }
    };
    load();
  }, []);

  const meals = dailyHealth.meals || ['', '', ''];
  const sleepDuration = calcSleepDuration(sleepStart, sleepEnd);
  const totalGlassesToRender = Math.max(GOAL, waterIntake);
  const glasses = Array.from({ length: totalGlassesToRender }, (_, i) => i);

  /* ─── Nutrition ─── */
  const handleSaveNutrition = async () => {
    if (!dailyLogId) return;
    setSavingNutrition(true);
    const totals = meals.reduce((acc, name) => {
      const m = mealPlan.find((x) => x.name === name);
      if (m?.nutrition) {
        acc.calories += m.nutrition.calories || 0;
        acc.protein += m.nutrition.protein || 0;
        acc.carbs += m.nutrition.carbs || 0;
        acc.fat += m.nutrition.fat || 0;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const mealSlotsOrder = ['Breakfast', 'Lunch', 'Dinner'];
    const formattedMeals = meals
      .map((name, i) => ({ meal_type: mealSlotsOrder[i], food_name: name }))
      .filter((m) => m.food_name.trim() !== '');

    if (formattedMeals.length === 0) { alert('Pilih minimal satu makanan.'); setSavingNutrition(false); return; }

    try {
      await addNutritionLog({ daily_log_id: dailyLogId, meals: formattedMeals, total_calories: totals.calories, total_protein_g: totals.protein, total_carbs_g: totals.carbs, total_fat_g: totals.fat });
      const res = await getNutritionLogsByDailyLogId(dailyLogId);
      setNutritionList(res.data?.nutritionLogs || []);
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan nutrisi'); }
    finally { setSavingNutrition(false); }
  };

  const handleDeleteNutrition = async (id) => {
    try {
      await deleteNutritionLog(id);
      setNutritionList((prev) => prev.filter((n) => n.id !== id));
    } catch (err) { console.error('Failed to delete nutrition:', err); }
  };

  /* ─── Activity ─── */
  const handleAddActivity = async () => {
    if (actVal <= 0 || !dailyLogId) return;
    setLoadingAct(true); setActError(null);
    try {
      await postActivityLog({ daily_log_id: dailyLogId, activity_name: actType, input_value: actVal });
      const res = await getActivitiesByDailyLog(dailyLogId);
      setActivityList(res.data?.activityLogs || []);
      setActVal(0);
    } catch (err) { setActError(err.response?.data?.message || 'Gagal menyimpan aktivitas.'); }
    finally { setLoadingAct(false); }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivityLog(id);
      setActivityList((prev) => prev.filter((a) => a.id !== id));
    } catch (err) { console.error('Failed to delete activity:', err); }
  };

  /* ─── Hydration ─── */
  const handleSaveHydration = async () => {
    if (!dailyLogId) return;
    setSavingHydration(true); setMsgHydration('');
    try {
      await updateDailyLog(dailyLogId, { total_water_ml: waterIntake * 250 });
      setSavedWaterIntake(waterIntake);
      setMsgHydration('✅ Saved successfully!');
    } catch (err) { setMsgHydration('❌ Failed to save.'); }
    finally { setTimeout(() => setMsgHydration(''), 3000); setSavingHydration(false); }
  };

  /* ─── Sleep ─── */
  const handleSaveSleep = async () => {
    if (!dailyLogId) return;
    setSavingSleep(true); setMsgSleep('');
    try {
      await updateDailyLog(dailyLogId, { sleep_start_time: sleepStart, sleep_end_time: sleepEnd });
      setSavedSleepStart(sleepStart); setSavedSleepEnd(sleepEnd);
      setMsgSleep('✅ Saved successfully!');
    } catch (err) { setMsgSleep('❌ Failed to save.'); }
    finally { setTimeout(() => setMsgSleep(''), 3000); setSavingSleep(false); }
  };

  const summaryMetrics = [
    { label: 'Hydration', value: Math.min(100, Math.round((waterIntake / GOAL) * 100)) },
    { label: 'Activity', value: activityList.length > 0 ? 100 : 0 },
    { label: 'Nutrition', value: meals.filter(Boolean).length > 0 ? Math.round((meals.filter(Boolean).length / 3) * 100) : 0 },
  ];

  const totalsPreview = meals.reduce((acc, name) => {
    const m = mealPlan.find((x) => x.name === name);
    if (m?.nutrition) { acc.calories += m.nutrition.calories || 0; acc.protein += m.nutrition.protein || 0; acc.carbs += m.nutrition.carbs || 0; acc.fat += m.nutrition.fat || 0; }
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const isDistance = ['Walking', 'Running', 'Cycling', 'Swimming'].includes(actType);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* ─── Nutrition Card ─── */}
        <div style={S.card}>
          <div style={S.sectionLbl}>Nutrition Log</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MEAL_SLOTS.map(({ key, label, placeholder }, i) => (
              <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={S.dot} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{label}</div>
                  <select
                    value={meals[i] || ''}
                    onChange={(e) => { const u = [...meals]; u[i] = e.target.value; updateDailyHealth({ meals: u }); }}
                    style={{ ...S.input, cursor: 'pointer' }}
                    disabled={loadingPlan}
                  >
                    <option value="" disabled hidden>{loadingPlan ? 'Loading...' : placeholder}</option>
                    {mealPlan.map((m) => <option key={m.id} value={m.name}>{m.emoji} {m.name}</option>)}
                  </select>
                </div>
              </div>
            ))}

            {totalsPreview.calories > 0 && (
              <div style={{ background: '#FFF7ED', borderRadius: 9, padding: '12px 14px', border: '1px solid #FED7AA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #FED7AA', paddingBottom: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: '#C2410C', fontWeight: 600 }}>Total Calories</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#F97316' }}>{totalsPreview.calories} kcal</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                  {[['Protein', totalsPreview.protein + 'g'], ['Carbs', totalsPreview.carbs + 'g'], ['Fat', totalsPreview.fat + 'g']].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleSaveNutrition} disabled={savingNutrition || meals.every((m) => !m)}
              style={{ width: '100%', padding: '8px', borderRadius: 7, background: savingNutrition ? '#FED7AA' : '#F97316', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: savingNutrition ? 'not-allowed' : 'pointer' }}>
              {savingNutrition ? 'Saving...' : 'Save Nutrition'}
            </button>

            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>TODAY'S RECORD</div>
              {nutritionList.length === 0 ? (
                <div style={{ fontSize: 11, color: '#D1D5DB', fontStyle: 'italic' }}>No meals logged yet.</div>
              ) : nutritionList.map((log) => (
                <div key={log.id} style={{ background: '#FAFAFA', padding: '10px', borderRadius: 6, border: '1px solid #F5F5F5', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Logged Meals</div>
                    <button onClick={() => handleDeleteNutrition(log.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14, padding: 0 }}>×</button>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {log.meals?.map((m, idx) => <span key={idx}>• {m.meal_type}: {m.food_name}</span>)}
                  </div>
                  <div style={{ fontSize: 11, color: '#F97316', fontWeight: 600, marginTop: 6, display: 'flex', gap: 8 }}>
                    <span>🔥 {log.total_calories} kcal</span>
                    <span style={{ color: '#9CA3AF' }}>| P: {log.total_protein_g}g</span>
                    <span style={{ color: '#9CA3AF' }}>| F: {log.total_fat_g}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Hydration Card ─── */}
        <div style={S.card}>
          <div style={S.sectionLbl}>Hydration Tracker</div>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 700, color: '#F97316', lineHeight: 1 }}>{waterIntake}</span>
            <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6 }}>of {GOAL} glasses today</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            {glasses.map((i) => {
              const filled = i < waterIntake;
              const isExtra = i >= GOAL;
              return (
                <button key={i} onClick={() => setWaterIntake(filled ? i : i + 1)}
                  style={{ width: 38, height: 38, borderRadius: 9, border: filled ? 'none' : '1.5px solid #FED7AA', background: filled ? (isExtra ? '#FDBA74' : '#F97316') : 'transparent', color: filled ? '#fff' : '#FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 8 5 12 5 16a7 7 0 0014 0c0-4-3-8-7-14z" /></svg>
                </button>
              );
            })}
          </div>
          <button onClick={() => setWaterIntake(waterIntake + 1)}
            style={{ width: '100%', padding: '8px', borderRadius: 9, background: '#FFF7ED', border: '1px solid #FED7AA', color: '#F97316', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>
            💧 + 1 glass
          </button>
          {msgHydration && <div style={{ fontSize: 11, color: msgHydration.includes('✅') ? '#16A34A' : '#DC2626', textAlign: 'center', marginBottom: 8 }}>{msgHydration}</div>}
          <button onClick={handleSaveHydration} disabled={savingHydration}
            style={{ width: '100%', padding: '8px', borderRadius: 9, background: savingHydration ? '#FED7AA' : '#F97316', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: savingHydration ? 'not-allowed' : 'pointer' }}>
            {savingHydration ? 'Saving...' : 'Save Hydration'}
          </button>
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12, marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>TODAY'S RECORD</div>
            <div style={{ background: '#FAFAFA', padding: '10px', borderRadius: 6, border: '1px solid #F5F5F5', fontSize: 12, fontWeight: 600, color: '#374151' }}>
              💧 {savedWaterIntake} Glasses <span style={{ fontWeight: 400, color: '#9CA3AF' }}>({savedWaterIntake * 250} ml)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {/* ─── Activity Card ─── */}
        <div style={S.card}>
          <div style={S.sectionLbl}>Activity Log</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={S.dot} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Activity type</div>
                <select value={actType} onChange={(e) => setActType(e.target.value)} style={{ ...S.input, cursor: 'pointer' }}>
                  {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={S.dot} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{isDistance ? 'Distance' : 'Duration'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="number" min="0" step={isDistance ? 0.1 : 1} value={actVal} onChange={(e) => setActVal(Number(e.target.value))} style={{ ...S.input, textAlign: 'center' }} />
                  <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{isDistance ? 'km' : 'min'}</span>
                </div>
              </div>
            </div>
            {actError && <div style={{ fontSize: 11, color: '#DC2626' }}>{actError}</div>}
            <button onClick={handleAddActivity} disabled={loadingAct || actVal <= 0}
              style={{ padding: '8px', borderRadius: 7, background: actVal > 0 ? '#F97316' : '#FED7AA', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: actVal > 0 ? 'pointer' : 'not-allowed' }}>
              {loadingAct ? 'Saving...' : '+ Add Activity'}
            </button>
          </div>
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>TODAY'S RECORD</div>
            {activityList.length === 0 ? (
              <div style={{ fontSize: 11, color: '#D1D5DB', fontStyle: 'italic' }}>No activities logged yet.</div>
            ) : activityList.map((log) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA', padding: '8px 10px', borderRadius: 6, border: '1px solid #F5F5F5', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{log.activity_name} <span style={{ fontWeight: 400, color: '#9CA3AF' }}>({log.input_value} {log.input_type === 'distance' ? 'km' : 'min'})</span></div>
                  <div style={{ fontSize: 11, color: '#F97316', fontWeight: 600, marginTop: 2 }}>🔥 {log.calories_burned} kcal</div>
                </div>
                <button onClick={() => handleDeleteActivity(log.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 14, padding: 4 }}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Sleep Card ─── */}
        <div style={S.card}>
          <div style={S.sectionLbl}>Sleep Log</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[{ key: 'sleepStart', label: 'Bedtime', icon: '🌙' }, { key: 'sleepEnd', label: 'Wake up', icon: '☀️' }].map(({ key, label, icon }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={S.dot} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>{icon} {label}</div>
                  <input type="time" value={key === 'sleepStart' ? sleepStart : sleepEnd}
                    onChange={(e) => key === 'sleepStart' ? setSleepStart(e.target.value) : setSleepEnd(e.target.value)}
                    style={S.input} />
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
          {msgSleep && <div style={{ fontSize: 11, color: msgSleep.includes('✅') ? '#16A34A' : '#DC2626', textAlign: 'center', marginTop: 12 }}>{msgSleep}</div>}
          <button onClick={handleSaveSleep} disabled={savingSleep}
            style={{ width: '100%', padding: '8px', marginTop: 12, borderRadius: 9, background: savingSleep ? '#FED7AA' : '#F97316', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: savingSleep ? 'not-allowed' : 'pointer' }}>
            {savingSleep ? 'Saving...' : 'Save Sleep Log'}
          </button>
          {(savedSleepStart || savedSleepEnd) && (
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12, marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>TODAY'S RECORD</div>
              <div style={{ background: '#FAFAFA', padding: '10px', borderRadius: 6, border: '1px solid #F5F5F5', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🛌</span>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{savedSleepStart || '--:--'} - {savedSleepEnd || '--:--'}</div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Summary Card ─── */}
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
  );
};
