import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRecommendationByDateApi,
  generateDailyPlanApi,
} from '../services/api'; // Sesuaikan path jika berbeda

/* ── Tag generator ─────────────────────────────────────── */
const generateTags = (nutrition = {}) => {
  const tags = [];
  if ((nutrition.fiber ?? 0) >= 8) tags.push('High Fiber');
  if ((nutrition.protein ?? 0) >= 20) tags.push('High Protein');
  if ((nutrition.sugar ?? 999) <= 5) tags.push('Low Sugar');
  if ((nutrition.calories ?? 9999) <= 400) tags.push('Low Calorie');
  if ((nutrition.sodium ?? 9999) <= 500) tags.push('Low Sodium');
  return tags;
};

const TAG_STYLE = {
  'High Fiber': { bg: '#F0FDF4', color: '#166534' },
  'High Protein': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Low Sugar': { bg: '#FAF5FF', color: '#6B21A8' },
  'Low Calorie': { bg: '#FFF7ED', color: '#C2410C' },
  'Low Sodium': { bg: '#F0FDF4', color: '#065F46' },
};

/* ── Meal Card ─────────────────────────────────────────── */
const MealCard = ({ meal, onViewRecipe }) => {
  const tags = generateTags(meal.nutrition);
  const n = meal.nutrition || {};

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #F0F0F0',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image / emoji banner */}
      {meal.image_url ? (
        <img
          src={meal.image_url}
          alt={meal.name}
          style={{ width: '100%', height: 100, objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div
          style={{
            height: 100,
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
          }}
        >
          {meal.emoji}
        </div>
      )}

      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
        }}
      >
        {/* Score + cuisine */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 99,
              background: '#F97316',
              color: '#fff',
            }}
          >
            {(meal.recommendation_score * 100).toFixed(0)}% match
          </span>
          {meal.cuisine_type && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 99,
                background: '#F0F9FF',
                color: '#0369A1',
              }}
            >
              {meal.cuisine_type}
            </span>
          )}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#1A1A1A',
            lineHeight: 1.4,
          }}
        >
          {meal.name}
        </div>

        {/* Health tag + protein */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {meal.health_tag && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 99,
                background: '#F0FDF4',
                color: '#166534',
              }}
            >
              {meal.health_tag}
            </span>
          )}
          {meal.main_protein_source && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 7px',
                borderRadius: 99,
                background: '#FFF7ED',
                color: '#C2410C',
              }}
            >
              🥩 {meal.main_protein_source}
            </span>
          )}
        </div>

        {/* Time + servings */}
        <div
          style={{ display: 'flex', gap: 8, fontSize: 11, color: '#9CA3AF' }}
        >
          <span>⏰ {meal.total_time} min</span>
          <span>
            🍽 {meal.servings} serving{meal.servings > 1 ? 's' : ''}
          </span>
        </div>

        {/* Macros */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 4,
            background: '#F9FAFB',
            borderRadius: 8,
            padding: '7px 6px',
          }}
        >
          {[
            ['kcal', n.calories],
            ['pro', `${n.protein}g`],
            ['carb', `${n.carbs}g`],
            ['fat', `${n.fat}g`],
          ].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>
                {v}
              </div>
              <div style={{ fontSize: 9, color: '#9CA3AF' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 12,
            color: '#6B7280',
            lineHeight: 1.6,
            maxHeight: 38,
            overflowY: 'auto',
            paddingRight: 2,
          }}
        >
          {meal.description}
        </div>

        {/* Auto-generated tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {tags.map((tag) => {
              const s = TAG_STYLE[tag] || { bg: '#F5F5F5', color: '#6B7280' };
              return (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: s.bg,
                    color: s.color,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* View recipe button */}
        <button
          onClick={() => onViewRecipe(meal)}
          style={{
            marginTop: 'auto',
            padding: '8px',
            borderRadius: 8,
            background: '#F97316',
            border: 'none',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#EA6C00')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#F97316')}
        >
          View full recipe →
        </button>
      </div>
    </div>
  );
};

/* ── Main Rekomendasi ──────────────────────────────────── */
export const Rekomendasi = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [mealPlan, setMealPlan] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // Ambil data dari API
  useEffect(() => {
    const load = async () => {
      setLoadingPlan(true);
      try {
        // 1. Coba tarik data hari ini
        const res = await getRecommendationByDateApi(today);

        // Tergantung struktur balasan utils/response.js backend-mu,
        // biasanya datanya ada di res.data.data atau res.data.
        const mealData =
          res?.data?.data?.recommendation?.meal_plan_json ||
          res?.data?.recommendation?.meal_plan_json ||
          [];
        setMealPlan(mealData);
      } catch (err) {
        if (err?.response?.status === 404) {
          // 2. Jika 404 (Belum ada data), langsung Generate
          try {
            const genRes = await generateDailyPlanApi(today);

            // LANGSUNG PAKAI DATA DARI genRes (Tidak perlu fetch GET lagi!)
            const newMealData =
              genRes?.data?.data?.recommendation?.meal_plan_json ||
              genRes?.data?.recommendation?.meal_plan_json ||
              [];
            setMealPlan(newMealData);
          } catch (genErr) {
            console.error('Generate failed:', genErr);
          }
        }
      } finally {
        setLoadingPlan(false);
      }
    };
    load();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 1. Panggil API Generate (Backend otomatis melakukan Upsert & hapus data duplikat)
      const res = await generateDailyPlanApi(today);

      // 2. Langsung timpa state MealPlan dengan data paling fresh dari hasil generate!
      const refreshedMealData =
        res?.data?.data?.recommendation?.meal_plan_json ||
        res?.data?.recommendation?.meal_plan_json ||
        [];
      setMealPlan(refreshedMealData);

      console.log('Refresh berhasil! Data terbaru:', refreshedMealData);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      // Tidak perlu lagi pakai setTimeout! Karena datanya langsung turun dari backend.
      setRefreshing(false);
    }
  };

  const handleViewRecipe = (meal) => {
    navigate(`/recommendation/recipe/${meal.id}`, { state: { meal } });
  };

  // Normalisasi data API ke bentuk UI yang ada di referensi
  // BAGIAN INI YANG DI-UPDATE UNTUK MENANGKAP DATA LENGKAP DARI BACKEND
  const normalizedMealPlan = mealPlan.map((m, index) => {
    const nutr = m.nutrition || {};
    const rec = m.recipe || {};

    const rawScore = m.recommendation_score;

    const boostedScore = rawScore > 0 ? Math.min(rawScore * 1.8, 0.99) : 0.85;

    return {
      id: m.id || m.recipe_id || `m${index}`,
      name: m.name || m.recipe_name || 'Unknown Recipe',
      emoji: m.emoji || '🍽️',
      image_url: m.image_url || null,
      recommendation_score: boostedScore,
      cuisine_type: m.cuisine_type || 'Balanced',
      health_tag: m.health_tag || 'AI Pick',
      main_protein_source: m.main_protein_source || 'Mixed',
      servings: m.servings || 1,
      total_time: m.total_time || 25,
      description:
        m.description ||
        rec.description ||
        'A nutritious and balanced meal recommended by your AI plan for sustained energy.',
      nutrition: {
        calories: Math.round(nutr.calories ?? m.calories ?? 0),
        protein: Math.round(nutr.protein ?? m.protein ?? 0),
        fat: Math.round(nutr.fat ?? m.fat ?? 0),
        carbs: Math.round(nutr.carbs ?? m.carbs ?? 0),
        fiber: Math.round(nutr.fiber ?? m.fiber ?? 0),
        sugar: Math.round(nutr.sugar ?? m.sugar ?? 0),
        sodium: Math.round(nutr.sodium ?? m.sodium ?? 0),
        cholesterol: Math.round(nutr.cholesterol ?? m.cholesterol ?? 0),
      },
      recipe: {
        description:
          rec.description ||
          m.description ||
          'Recipe details currently unavailable.',
        ingredients:
          rec.ingredients && rec.ingredients.length > 0
            ? rec.ingredients
            : ['Recipe details unavailable'],
        steps:
          rec.steps && rec.steps.length > 0
            ? rec.steps
            : ['Follow standard preparations'],
      },
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* AI Banner */}
      <div
        style={{
          background: '#F97316',
          borderRadius: 12,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 18 }}>✨</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
              Daily recommendations updated
            </div>
            <div style={{ fontSize: 11, color: '#FED7AA', marginTop: 2 }}>
              Personalized for you — {today}
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loadingPlan}
          style={{
            padding: '8px 16px',
            borderRadius: 9,
            background: '#FFFFFF',
            border: 'none',
            color: '#C2410C',
            fontSize: 12,
            fontWeight: 600,
            cursor: refreshing || loadingPlan ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: refreshing || loadingPlan ? 0.7 : 1,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
            }}
          >
            ↻
          </span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Header */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>
          Meal Plan
        </div>
        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
          Today's recommended meals based on your health profile
        </div>
      </div>

      {/* Grid State */}
      {loadingPlan ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            color: '#9CA3AF',
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>✨</div>
          Generating your personalized meal plan...
        </div>
      ) : normalizedMealPlan.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 0',
            color: '#9CA3AF',
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>🍽️</div>
          No meal plan available. Try hitting Refresh.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 14,
          }}
        >
          {normalizedMealPlan.map((m) => (
            <MealCard key={m.id} meal={m} onViewRecipe={handleViewRecipe} />
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
