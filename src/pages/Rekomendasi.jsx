import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Tag generator ─────────────────────────────────────── */
const generateTags = (nutrition = {}) => {
  const tags = []
  if ((nutrition.fiber     ?? 0)    >= 8)   tags.push('High Fiber')
  if ((nutrition.protein   ?? 0)    >= 20)  tags.push('High Protein')
  if ((nutrition.sugar     ?? 999)  <= 5)   tags.push('Low Sugar')
  if ((nutrition.calories  ?? 9999) <= 400) tags.push('Low Calorie')
  if ((nutrition.sodium    ?? 9999) <= 500) tags.push('Low Sodium')
  return tags
}

const TAG_STYLE = {
  'High Fiber':   { bg: '#F0FDF4', color: '#166534' },
  'High Protein': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Low Sugar':    { bg: '#FAF5FF', color: '#6B21A8' },
  'Low Calorie':  { bg: '#FFF7ED', color: '#C2410C' },
  'Low Sodium':   { bg: '#F0FDF4', color: '#065F46' },
}

const MEAL_DATA = [
  {
    id: 'm1',
    name: 'Oatmeal + Banana + Low-fat milk',
    emoji: '🥣',
    image_url: null,
    recommendation_score: 0.94,
    cuisine_type: 'Western',
    health_tag: 'Heart Healthy',
    main_protein_source: 'Dairy',
    servings: 1,
    prep_time: 5,
    cook_time: 10,
    total_time: 15,
    description: 'A warm, creamy bowl of oats topped with fresh banana slices and a drizzle of honey. Filling, gentle on digestion, and perfect for any time of day.',
    nutrition: { calories: 320, protein: 14, fat: 5, carbs: 58, fiber: 9, sugar: 18, sodium: 95, cholesterol: 8 },
    recipe: {
      description: 'A nutritious bowl to fuel your body with steady energy.',
      ingredients: ['80g rolled oats', '1 ripe banana, sliced', '200ml low-fat milk', '1 tbsp honey', '1 tsp cinnamon', 'Handful of blueberries (optional)'],
      steps: ['Bring milk to a gentle simmer in a saucepan over medium heat.', 'Add oats and cook for 5 minutes, stirring occasionally.', 'Pour into a bowl and top with sliced banana.', 'Drizzle honey and sprinkle cinnamon. Add blueberries if desired.', 'Serve warm.'],
    },
  },
  {
    id: 'm2',
    name: 'Brown rice + Grilled chicken + Vegetables',
    emoji: '🍚',
    image_url: null,
    recommendation_score: 0.91,
    cuisine_type: 'Asian',
    health_tag: 'High Protein',
    main_protein_source: 'Chicken',
    servings: 1,
    prep_time: 10,
    cook_time: 25,
    total_time: 35,
    description: 'A classic high-protein meal with tender grilled chicken, nutty brown rice, and crisp steamed vegetables. Balanced, satisfying, and macro-friendly.',
    nutrition: { calories: 510, protein: 42, fat: 9, carbs: 55, fiber: 6, sugar: 4, sodium: 420, cholesterol: 85 },
    recipe: {
      description: 'High-protein balanced meal recommended by your AI plan.',
      ingredients: ['150g brown rice', '180g chicken breast', '100g broccoli', '100g carrots', '2 tbsp soy sauce', '1 tbsp olive oil', 'Salt, pepper, garlic to taste'],
      steps: ['Cook brown rice according to package instructions.', 'Season chicken breast with salt, pepper, and minced garlic.', 'Grill chicken on medium heat 6–7 min per side until cooked through.', 'Steam broccoli and carrots for 5 minutes until tender-crisp.', 'Slice chicken and serve alongside rice and vegetables.', 'Drizzle soy sauce and olive oil over the vegetables.'],
    },
  },
  {
    id: 'm3',
    name: 'Tofu soup + Steamed tempeh + Small rice',
    emoji: '🍲',
    image_url: null,
    recommendation_score: 0.88,
    cuisine_type: 'Indonesian',
    health_tag: 'Plant Based',
    main_protein_source: 'Tofu & Tempeh',
    servings: 1,
    prep_time: 10,
    cook_time: 20,
    total_time: 30,
    description: 'A light yet comforting Indonesian-inspired dinner. Silky tofu in fragrant broth, paired with protein-rich tempeh and a small portion of rice.',
    nutrition: { calories: 380, protein: 28, fat: 11, carbs: 38, fiber: 5, sugar: 3, sodium: 310, cholesterol: 0 },
    recipe: {
      description: 'Light yet filling dinner with plant-based protein.',
      ingredients: ['200g firm tofu, cubed', '100g tempeh, sliced', '120g white rice', '500ml vegetable broth', '1 stalk lemongrass', '3 kaffir lime leaves', 'Spring onion, chili to taste'],
      steps: ['Cook rice and set aside.', 'Bring vegetable broth to boil with lemongrass and lime leaves.', 'Add tofu cubes and simmer 10 minutes.', 'Steam tempeh slices for 8 minutes.', 'Season soup with salt and pepper.', 'Serve soup in bowl, garnish with spring onion and chili.'],
    },
  },
  {
    id: 'm4',
    name: 'Greek yogurt + Mixed berries + Granola',
    emoji: '🫐',
    image_url: null,
    recommendation_score: 0.86,
    cuisine_type: 'Mediterranean',
    health_tag: 'Probiotic',
    main_protein_source: 'Dairy',
    servings: 1,
    prep_time: 5,
    cook_time: 0,
    total_time: 5,
    description: 'Thick, creamy Greek yogurt layered with vibrant berries and crunchy granola. A quick, refreshing option that feels indulgent but is incredibly nutritious.',
    nutrition: { calories: 210, protein: 18, fat: 4, carbs: 32, fiber: 3, sugar: 14, sodium: 65, cholesterol: 10 },
    recipe: {
      description: 'A protein-rich option to keep you satisfied.',
      ingredients: ['150g Greek yogurt (plain, low-fat)', '50g mixed berries (strawberry, blueberry)', '30g granola', '1 tsp honey'],
      steps: ['Spoon Greek yogurt into a bowl.', 'Top with mixed berries.', 'Sprinkle granola over the top.', 'Drizzle with honey and serve immediately.'],
    },
  },
  {
    id: 'm5',
    name: 'Apple slices + Almond butter',
    emoji: '🍎',
    image_url: null,
    recommendation_score: 0.83,
    cuisine_type: 'Western',
    health_tag: 'Low Calorie',
    main_protein_source: 'Nuts',
    servings: 1,
    prep_time: 5,
    cook_time: 0,
    total_time: 5,
    description: 'Crisp apple wedges dipped in rich, natural almond butter. A simple two-ingredient combination that delivers fiber, healthy fats, and natural sweetness.',
    nutrition: { calories: 190, protein: 7, fat: 10, carbs: 28, fiber: 5, sugar: 19, sodium: 40, cholesterol: 0 },
    recipe: {
      description: 'A simple, balanced option for sustained energy.',
      ingredients: ['1 medium apple', '2 tbsp natural almond butter', 'Pinch of cinnamon (optional)'],
      steps: ['Wash and core the apple.', 'Slice apple into thin wedges.', 'Serve with almond butter for dipping.', 'Sprinkle cinnamon if desired.'],
    },
  },
  {
    id: 'm6',
    name: 'Whole wheat toast + Avocado + Poached egg',
    emoji: '🥑',
    image_url: null,
    recommendation_score: 0.89,
    cuisine_type: 'Western',
    health_tag: 'Heart Healthy',
    main_protein_source: 'Egg',
    servings: 1,
    prep_time: 5,
    cook_time: 10,
    total_time: 15,
    description: 'Golden toast topped with creamy smashed avocado and a perfectly poached egg with a runny yolk. A nutrient powerhouse that looks as good as it tastes.',
    nutrition: { calories: 350, protein: 16, fat: 18, carbs: 30, fiber: 8, sugar: 2, sodium: 280, cholesterol: 185 },
    recipe: {
      description: 'Nutrient-dense option rich in healthy fats.',
      ingredients: ['2 slices whole wheat bread', '1 ripe avocado', '2 eggs', '1 tsp lemon juice', 'Salt, pepper, red pepper flakes', 'Fresh chives to garnish'],
      steps: ['Toast bread until golden brown.', 'Mash avocado with lemon juice, salt, and pepper.', 'Bring a pot of water to gentle simmer. Add a splash of vinegar.', 'Crack eggs into a cup, swirl the water, and slide eggs in.', 'Poach 3–4 minutes for runny yolk.', 'Spread avocado on toast, top with poached eggs and chives.'],
    },
  },
  {
    id: 'm7',
    name: 'Quinoa salad + Chickpeas + Lemon dressing',
    emoji: '🥗',
    image_url: null,
    recommendation_score: 0.87,
    cuisine_type: 'Mediterranean',
    health_tag: 'Vegan',
    main_protein_source: 'Legumes',
    servings: 2,
    prep_time: 15,
    cook_time: 15,
    total_time: 30,
    description: 'A vibrant, refreshing salad with fluffy quinoa, hearty chickpeas, and a bright lemon dressing. Fully plant-based, high in fiber, and incredibly satisfying.',
    nutrition: { calories: 420, protein: 19, fat: 12, carbs: 58, fiber: 11, sugar: 5, sodium: 210, cholesterol: 0 },
    recipe: {
      description: 'A refreshing and hearty plant-based lunch.',
      ingredients: ['150g cooked quinoa', '120g canned chickpeas, drained', '1 cucumber, diced', '10 cherry tomatoes, halved', '2 tbsp olive oil', '1 lemon (juice)', 'Fresh parsley, salt, pepper'],
      steps: ['Cook quinoa per package instructions and let cool.', 'Combine quinoa, chickpeas, cucumber, and tomatoes in a large bowl.', 'Whisk together olive oil, lemon juice, salt, and pepper.', 'Pour dressing over salad and toss well.', 'Garnish with fresh parsley. Serve chilled.'],
    },
  },
  {
    id: 'm8',
    name: 'Grilled salmon + Sweet potato + Spinach',
    emoji: '🐟',
    image_url: null,
    recommendation_score: 0.92,
    cuisine_type: 'Western',
    health_tag: 'Omega-3 Rich',
    main_protein_source: 'Fish',
    servings: 1,
    prep_time: 10,
    cook_time: 30,
    total_time: 40,
    description: 'A beautifully plated dinner with flaky grilled salmon, naturally sweet roasted sweet potato, and wilted garlic spinach. Elegant, nourishing, and deeply satisfying.',
    nutrition: { calories: 480, protein: 38, fat: 16, carbs: 34, fiber: 6, sugar: 7, sodium: 320, cholesterol: 75 },
    recipe: {
      description: 'Omega-3 rich dinner great for heart health and muscle recovery.',
      ingredients: ['180g salmon fillet', '1 medium sweet potato', '100g fresh spinach', '2 cloves garlic', '1 tbsp olive oil', 'Lemon wedge, dill to garnish'],
      steps: ['Preheat oven to 200°C. Cube sweet potato and roast with olive oil 25 min.', 'Season salmon with salt, pepper, and lemon zest.', 'Heat a pan on medium-high. Sear salmon skin-side up 4 min.', 'Flip and cook another 3–4 min until flaky.', 'Sauté spinach with garlic in olive oil until wilted.', 'Plate salmon with sweet potato and spinach. Garnish with dill.'],
    },
  },
  {
    id: 'm9',
    name: 'Smoothie bowl: spinach + mango + chia',
    emoji: '🥭',
    image_url: null,
    recommendation_score: 0.82,
    cuisine_type: 'Fusion',
    health_tag: 'Antioxidant Rich',
    main_protein_source: 'Seeds',
    servings: 1,
    prep_time: 10,
    cook_time: 0,
    total_time: 10,
    description: 'A thick, tropical smoothie bowl bursting with color. Blended mango and spinach create a creamy green base, topped with seeds, nuts, and fresh fruit.',
    nutrition: { calories: 290, protein: 9, fat: 7, carbs: 44, fiber: 9, sugar: 28, sodium: 55, cholesterol: 0 },
    recipe: {
      description: 'Vibrant and nutrient-packed bowl to start the day.',
      ingredients: ['100g frozen mango', '50g fresh spinach', '120ml coconut milk', '1 tbsp chia seeds', '1 tbsp almond butter', 'Toppings: granola, kiwi slices, coconut flakes'],
      steps: ['Blend frozen mango, spinach, and coconut milk until smooth.', 'Pour into a bowl — mixture should be thick.', 'Top with chia seeds, almond butter, granola, kiwi, and coconut flakes.', 'Serve immediately.'],
    },
  },
  {
    id: 'm10',
    name: 'Lentil curry + Brown rice + Cucumber raita',
    emoji: '🍛',
    image_url: null,
    recommendation_score: 0.85,
    cuisine_type: 'Indian',
    health_tag: 'Iron Rich',
    main_protein_source: 'Legumes',
    servings: 2,
    prep_time: 10,
    cook_time: 30,
    total_time: 40,
    description: 'A warming, aromatic lentil curry simmered in spiced tomato and coconut milk, served over brown rice with cool cucumber raita on the side.',
    nutrition: { calories: 430, protein: 24, fat: 8, carbs: 72, fiber: 14, sugar: 8, sodium: 380, cholesterol: 5 },
    recipe: {
      description: 'Comforting and nutritious plant-based dinner full of iron.',
      ingredients: ['200g red lentils', '150g brown rice', '1 can diced tomatoes', '1 onion, diced', '2 cloves garlic', '1 tbsp curry powder', '1 tsp cumin', '200ml coconut milk', 'Fresh coriander, salt'],
      steps: ['Cook brown rice. Set aside.', 'Sauté onion and garlic in oil until soft.', 'Add curry powder and cumin, toast 1 minute.', 'Add lentils, tomatoes, and 400ml water. Simmer 20 minutes.', 'Stir in coconut milk, season with salt.', 'Mix yogurt with diced cucumber for raita.', 'Serve curry over rice with raita and coriander.'],
    },
  },
]

/* ── Meal Card ─────────────────────────────────────────── */
const MealCard = ({ meal, onClick }) => {
  const tags = generateTags(meal.nutrition)
  const n    = meal.nutrition || {}

  return (
    <div
      onClick={() => onClick(meal)}
      style={{
        background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 12,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image / emoji banner */}
      {meal.image_url ? (
        <img src={meal.image_url} alt={meal.name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
      ) : (
        <div style={{ height: 100, background: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
          {meal.emoji}
        </div>
      )}

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>

        {/* Score + cuisine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: '#F97316', color: '#fff' }}>
            {(meal.recommendation_score * 100).toFixed(0)}% match
          </span>
          {meal.cuisine_type && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#F0F9FF', color: '#0369A1' }}>{meal.cuisine_type}</span>
          )}
        </div>

        {/* Name */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4 }}>{meal.name}</div>

        {/* Health tag + protein */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {meal.health_tag && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#F0FDF4', color: '#166534' }}>{meal.health_tag}</span>
          )}
          {meal.main_protein_source && (
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#FFF7ED', color: '#C2410C' }}>🥩 {meal.main_protein_source}</span>
          )}
        </div>

        {/* Time + servings */}
        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#9CA3AF' }}>
          <span>⏰ {meal.total_time} min</span>
          <span>🍽 {meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
        </div>

        {/* Macros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, background: '#F9FAFB', borderRadius: 8, padding: '7px 6px' }}>
          {[['kcal', n.calories], ['pro', `${n.protein}g`], ['carb', `${n.carbs}g`], ['fat', `${n.fat}g`]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{v}</div>
              <div style={{ fontSize: 9, color: '#9CA3AF' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, maxHeight: 38, overflowY: 'auto', paddingRight: 2 }}>
          {meal.description}
        </div>

        {/* Auto-generated tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {tags.map(tag => {
              const s = TAG_STYLE[tag] || { bg: '#F5F5F5', color: '#6B7280' }
              return (
                <span key={tag} style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color }}>
                  {tag}
                </span>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 'auto', padding: '8px', borderRadius: 8,
          background: '#FFF7ED', border: '1px solid #FED7AA',
          color: '#C2410C', fontSize: 12, fontWeight: 600,
          textAlign: 'center',
        }}>
          View full recipe →
        </div>
      </div>
    </div>
  )
}

/* ── Main Rekomendasi ──────────────────────────────────── */
export const Rekomendasi = () => {
  const navigate    = useNavigate()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const handleCardClick = (meal) => {
    navigate(`/rekomendasi/resep/${meal.id}`, { state: { meal } })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* AI Banner */}
      <div style={{ background: '#F97316', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18 }}>✨</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Daily recommendations updated</div>
            <div style={{ fontSize: 11, color: '#FED7AA', marginTop: 2 }}>Last updated today at 06:00 — Model v2.1</div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          style={{ padding: '8px 16px', borderRadius: 9, background: '#FFFFFF', border: 'none', color: '#C2410C', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span style={{ display: 'inline-block', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Header */}
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Meal Plan</div>
        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Click any meal to see the full recipe</div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {MEAL_DATA.map(m => (
          <MealCard key={m.id} meal={m} onClick={handleCardClick} />
        ))}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}