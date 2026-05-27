import { useState } from 'react'
import { useApp } from '../hooks/useApp'

/* ─────────────────────────────────────────────────────────
   STATIC DATA — 10 items per tab
───────────────────────────────────────────────────────── */

const MEAL_DATA = [
  {
    id: 'm1', time: 'Breakfast', hour: '07:00', featured: false,
    name: 'Oatmeal + Banana + Low-fat milk',
    tags: ['Carbs', 'Fiber', 'Calcium'],
    kcal: 320, protein: 12, carbs: 58, fat: 6,
    recipe: {
      description: 'A nutritious breakfast to fuel your morning with steady energy.',
      ingredients: ['80g rolled oats', '1 ripe banana, sliced', '200ml low-fat milk', '1 tbsp honey', '1 tsp cinnamon', 'Handful of blueberries (optional)'],
      steps: ['Bring milk to a gentle simmer in a saucepan over medium heat.', 'Add oats and cook for 5 minutes, stirring occasionally.', 'Pour into a bowl and top with sliced banana.', 'Drizzle honey and sprinkle cinnamon. Add blueberries if desired.', 'Serve warm.'],
    },
  },
  {
    id: 'm2', time: 'Lunch', hour: '12:00', featured: true,
    name: 'Brown rice + Grilled chicken + Vegetables',
    tags: ['Protein', 'Low fat'],
    kcal: 510, protein: 38, carbs: 62, fat: 9,
    recipe: {
      description: 'High-protein balanced meal recommended by your AI plan.',
      ingredients: ['150g brown rice', '180g chicken breast', '100g broccoli', '100g carrots', '2 tbsp soy sauce', '1 tbsp olive oil', 'Salt, pepper, garlic to taste'],
      steps: ['Cook brown rice according to package instructions.', 'Season chicken breast with salt, pepper, and minced garlic.', 'Grill chicken on medium heat 6–7 min per side until cooked through.', 'Steam broccoli and carrots for 5 minutes until tender-crisp.', 'Slice chicken and serve alongside rice and vegetables.', 'Drizzle soy sauce and olive oil over the vegetables.'],
    },
  },
  {
    id: 'm3', time: 'Dinner', hour: '19:00', featured: false,
    name: 'Tofu soup + Steamed tempeh + Small rice',
    tags: ['Low cal', 'Plant protein'],
    kcal: 380, protein: 22, carbs: 45, fat: 11,
    recipe: {
      description: 'Light yet filling dinner with plant-based protein.',
      ingredients: ['200g firm tofu, cubed', '100g tempeh, sliced', '120g white rice', '500ml vegetable broth', '1 stalk lemongrass', '3 kaffir lime leaves', 'Spring onion, chili to taste'],
      steps: ['Cook rice and set aside.', 'Bring vegetable broth to boil with lemongrass and lime leaves.', 'Add tofu cubes and simmer 10 minutes.', 'Steam tempeh slices for 8 minutes.', 'Season soup with salt and pepper.', 'Serve soup in bowl, garnish with spring onion and chili.'],
    },
  },
  {
    id: 'm4', time: 'Snack', hour: '10:00', featured: false,
    name: 'Greek yogurt + Mixed berries + Granola',
    tags: ['Protein', 'Probiotic'],
    kcal: 210, protein: 14, carbs: 28, fat: 4,
    recipe: {
      description: 'A protein-rich mid-morning snack to keep you satisfied.',
      ingredients: ['150g Greek yogurt (plain, low-fat)', '50g mixed berries (strawberry, blueberry)', '30g granola', '1 tsp honey'],
      steps: ['Spoon Greek yogurt into a bowl.', 'Top with mixed berries.', 'Sprinkle granola over the top.', 'Drizzle with honey and serve immediately.'],
    },
  },
  {
    id: 'm5', time: 'Snack', hour: '15:00', featured: false,
    name: 'Apple slices + Almond butter',
    tags: ['Fiber', 'Healthy fat'],
    kcal: 190, protein: 5, carbs: 22, fat: 10,
    recipe: {
      description: 'A simple, balanced afternoon snack for sustained energy.',
      ingredients: ['1 medium apple', '2 tbsp natural almond butter', 'Pinch of cinnamon (optional)'],
      steps: ['Wash and core the apple.', 'Slice apple into thin wedges.', 'Serve with almond butter for dipping.', 'Sprinkle cinnamon if desired.'],
    },
  },
  {
    id: 'm6', time: 'Breakfast', hour: '07:00', featured: false,
    name: 'Whole wheat toast + Avocado + Poached egg',
    tags: ['Healthy fat', 'Protein'],
    kcal: 350, protein: 16, carbs: 30, fat: 18,
    recipe: {
      description: 'Trendy and nutrient-dense breakfast rich in healthy fats.',
      ingredients: ['2 slices whole wheat bread', '1 ripe avocado', '2 eggs', '1 tsp lemon juice', 'Salt, pepper, red pepper flakes', 'Fresh chives to garnish'],
      steps: ['Toast bread until golden brown.', 'Mash avocado with lemon juice, salt, and pepper.', 'Bring a pot of water to gentle simmer. Add a splash of vinegar.', 'Crack eggs into a cup, swirl the water, and slide eggs in.', 'Poach 3–4 minutes for runny yolk.', 'Spread avocado on toast, top with poached eggs and chives.'],
    },
  },
  {
    id: 'm7', time: 'Lunch', hour: '12:00', featured: false,
    name: 'Quinoa salad + Chickpeas + Lemon dressing',
    tags: ['High fiber', 'Vegan'],
    kcal: 420, protein: 18, carbs: 55, fat: 12,
    recipe: {
      description: 'A refreshing and hearty plant-based lunch.',
      ingredients: ['150g cooked quinoa', '120g canned chickpeas, drained', '1 cucumber, diced', '10 cherry tomatoes, halved', '2 tbsp olive oil', '1 lemon (juice)', 'Fresh parsley, salt, pepper'],
      steps: ['Cook quinoa per package instructions and let cool.', 'Combine quinoa, chickpeas, cucumber, and tomatoes in a large bowl.', 'Whisk together olive oil, lemon juice, salt, and pepper.', 'Pour dressing over salad and toss well.', 'Garnish with fresh parsley. Serve chilled.'],
    },
  },
  {
    id: 'm8', time: 'Dinner', hour: '19:00', featured: false,
    name: 'Grilled salmon + Sweet potato + Spinach',
    tags: ['Omega-3', 'Antioxidants'],
    kcal: 480, protein: 34, carbs: 38, fat: 16,
    recipe: {
      description: 'Omega-3 rich dinner great for heart health and muscle recovery.',
      ingredients: ['180g salmon fillet', '1 medium sweet potato', '100g fresh spinach', '2 cloves garlic', '1 tbsp olive oil', 'Lemon wedge, dill to garnish'],
      steps: ['Preheat oven to 200°C. Cube sweet potato and roast with olive oil 25 min.', 'Season salmon with salt, pepper, and lemon zest.', 'Heat a pan on medium-high. Sear salmon skin-side up 4 min.', 'Flip and cook another 3–4 min until flaky.', 'Sauté spinach with garlic in olive oil until wilted.', 'Plate salmon with sweet potato and spinach. Garnish with dill.'],
    },
  },
  {
    id: 'm9', time: 'Breakfast', hour: '07:00', featured: false,
    name: 'Smoothie bowl: spinach + mango + chia',
    tags: ['Vitamins', 'Antioxidants'],
    kcal: 290, protein: 9, carbs: 48, fat: 7,
    recipe: {
      description: 'Vibrant and nutrient-packed bowl to start the day.',
      ingredients: ['100g frozen mango', '50g fresh spinach', '120ml coconut milk', '1 tbsp chia seeds', '1 tbsp almond butter', 'Toppings: granola, kiwi slices, coconut flakes'],
      steps: ['Blend frozen mango, spinach, and coconut milk until smooth.', 'Pour into a bowl — mixture should be thick.', 'Top with chia seeds, almond butter, granola, kiwi, and coconut flakes.', 'Serve immediately.'],
    },
  },
  {
    id: 'm10', time: 'Dinner', hour: '19:00', featured: false,
    name: 'Lentil curry + Brown rice + Cucumber raita',
    tags: ['High fiber', 'Iron'],
    kcal: 430, protein: 20, carbs: 65, fat: 8,
    recipe: {
      description: 'Comforting and nutritious plant-based dinner full of iron.',
      ingredients: ['200g red lentils', '150g brown rice', '1 can diced tomatoes', '1 onion, diced', '2 cloves garlic', '1 tbsp curry powder', '1 tsp cumin', '200ml coconut milk', 'Fresh coriander, salt'],
      steps: ['Cook brown rice. Set aside.', 'Sauté onion and garlic in oil until soft.', 'Add curry powder and cumin, toast 1 minute.', 'Add lentils, tomatoes, and 400ml water. Simmer 20 minutes.', 'Stir in coconut milk, season with salt.', 'Mix yogurt with diced cucumber for raita.', 'Serve curry over rice with raita and coriander.'],
    },
  },
]

const ACTIVITY_DATA = [
  { id: 'a1', short: 'WK', name: 'Brisk walking', desc: 'Ideal for your current activity level', level: 'Light', levelColor: '#22C55E', time: 'Afternoon', duration: '30 min', kcal: 180,
    recipe: { description: 'A low-impact cardio activity suitable for all fitness levels.', ingredients: ['Comfortable shoes', 'Breathable clothing', 'Water bottle', 'Optional: fitness tracker'], steps: ['Start with a 5-min slow warm-up walk.', 'Increase pace to brisk — you should be able to talk but feel slightly breathless.', 'Maintain brisk pace for 20 minutes.', 'Cool down with a 5-min slow walk.', 'Stretch calves, hamstrings, and hip flexors after.'] } },
  { id: 'a2', short: 'YG', name: 'Gentle yoga & stretching', desc: 'Helps muscle recovery after morning workout', level: 'Very light', levelColor: '#3B82F6', time: 'Evening', duration: '20 min', kcal: 60,
    recipe: { description: 'Relaxing yoga sequence to improve flexibility and reduce stress.', ingredients: ['Yoga mat', 'Comfortable clothing', 'Optional: yoga block'], steps: ['Begin in child\'s pose — hold 60 seconds.', 'Move to downward dog — hold 30 seconds.', 'Cat-cow stretch — 10 repetitions.', 'Seated forward fold — hold 60 seconds each side.', 'Finish with 5 minutes of savasana (lying still with deep breathing).'] } },
  { id: 'a3', short: 'CY', name: 'Leisure cycling', desc: 'Alternative if you cannot walk outside', level: 'Moderate', levelColor: '#F59E0B', time: 'Morning/Afternoon', duration: '45 min', kcal: 260,
    recipe: { description: 'Low-impact cardio on a bike — great for joints.', ingredients: ['Bicycle (outdoor or stationary)', 'Helmet', 'Water bottle', 'Cycling shorts (optional)'], steps: ['Adjust seat height so legs are almost fully extended at bottom of pedal stroke.', 'Warm up at easy resistance for 5 minutes.', 'Cycle at moderate effort for 35 minutes.', 'Increase resistance for the last 5 minutes.', 'Cool down at easy resistance for 5 minutes.'] } },
  { id: 'a4', short: 'SW', name: 'Swimming laps', desc: 'Full body low-impact workout', level: 'Moderate', levelColor: '#F59E0B', time: 'Morning', duration: '30 min', kcal: 300,
    recipe: { description: 'Swimming engages all muscle groups with minimal joint stress.', ingredients: ['Swimsuit', 'Goggles', 'Swim cap', 'Towel'], steps: ['Warm up with 2 laps of easy breaststroke.', 'Swim freestyle (front crawl) for 10 minutes.', 'Alternate freestyle and backstroke for 15 minutes.', 'Cool down with 2 laps of easy breaststroke.', 'Stretch shoulders and back after.'] } },
  { id: 'a5', short: 'BW', name: 'Bodyweight circuit', desc: 'No equipment needed at home', level: 'Moderate', levelColor: '#F59E0B', time: 'Any time', duration: '25 min', kcal: 220,
    recipe: { description: 'Effective full-body workout using only your bodyweight.', ingredients: ['Exercise mat', 'Timer', 'Water bottle'], steps: ['Warm up: 2 min jumping jacks.', '3 rounds of: 10 push-ups, 15 squats, 20 mountain climbers, 10 tricep dips.', 'Rest 60 seconds between rounds.', 'Cool down: 3 min stretching full body.'] } },
  { id: 'a6', short: 'RN', name: 'Easy jog / Run-walk', desc: 'Build cardio endurance gradually', level: 'Moderate', levelColor: '#F59E0B', time: 'Morning/Evening', duration: '30 min', kcal: 280,
    recipe: { description: 'Beginner-friendly run-walk interval to build endurance.', ingredients: ['Running shoes', 'Breathable clothing', 'Water bottle', 'Timer'], steps: ['Walk briskly for 2 minutes.', 'Jog at easy pace for 2 minutes.', 'Repeat walk/jog cycle for 25 minutes total.', 'End with 5-minute cool-down walk.', 'Stretch quads, calves, and hip flexors.'] } },
  { id: 'a7', short: 'PL', name: 'Pilates core workout', desc: 'Strengthens core and improves posture', level: 'Light', levelColor: '#22C55E', time: 'Morning', duration: '30 min', kcal: 150,
    recipe: { description: 'Core-focused workout to improve stability and posture.', ingredients: ['Exercise mat', 'Optional: pilates ring or resistance band'], steps: ['Warm up with pelvic tilts — 10 reps.', 'The Hundred: 100 arm pulses in hollow hold position.', 'Single leg stretch: 10 reps each side.', 'Plank hold: 3 × 30 seconds.', 'Bridge: 3 × 12 reps.', 'Cool down with spine twist stretch.'] } },
  { id: 'a8', short: 'HK', name: 'Hiking / Nature walk', desc: 'Mental wellness + physical activity', level: 'Moderate', levelColor: '#F59E0B', time: 'Weekend', duration: '60 min', kcal: 350,
    recipe: { description: 'Outdoor hiking for both physical and mental wellbeing.', ingredients: ['Hiking shoes', 'Backpack with water', 'Snack bar', 'Sunscreen', 'Optional: hiking poles'], steps: ['Check weather and choose a suitable trail.', 'Start at easy pace, warm up for 10 minutes.', 'Maintain steady pace on flat terrain, slow on inclines.', 'Take breaks every 20 minutes to hydrate.', 'Stretch after completing the hike.'] } },
  { id: 'a9', short: 'JR', name: 'Jump rope intervals', desc: 'High calorie burn in short time', level: 'High', levelColor: '#EF4444', time: 'Afternoon', duration: '15 min', kcal: 200,
    recipe: { description: 'Short but intense jump rope workout for calorie burning.', ingredients: ['Jump rope (length adjusted to height)', 'Cushioned floor or mat', 'Athletic shoes', 'Water'], steps: ['Warm up: 2 min easy jumping.', 'Interval: 30 sec fast jumping → 30 sec rest × 10 rounds.', 'Final 2 minutes: steady medium-pace jumping.', 'Cool down: walk in place, stretch calves and ankles.'] } },
  { id: 'a10', short: 'DC', name: 'Dance cardio', desc: 'Fun and effective full-body cardio', level: 'Moderate', levelColor: '#F59E0B', time: 'Afternoon/Evening', duration: '30 min', kcal: 240,
    recipe: { description: 'Enjoyable dance workout — burns calories without feeling like exercise.', ingredients: ['Open floor space', 'Comfortable shoes', 'Upbeat music playlist', 'Water'], steps: ['Start with easy movement to your favorite songs for 5 minutes.', 'Follow a dance cardio video or freestyle to upbeat music for 20 minutes.', 'Keep energy up — don\'t stop between songs.', 'Cool down with slow movement and deep breathing for 5 minutes.'] } },
]

const HABIT_DATA = [
  { id: 'h1', icon: '💧', title: 'Drink water before meals', desc: 'Drink 1 glass of water 30 minutes before each meal to help control portions and improve digestion.', reason: 'Based on: your meal patterns over the last 3 days',
    recipe: { description: 'How to build the pre-meal water habit.', ingredients: ['1 glass of water (250ml)', 'Timer or phone reminder'], steps: ['Set a reminder 30 minutes before each scheduled meal.', 'Drink a full glass of water when the reminder fires.', 'Wait 5–10 minutes before starting to eat.', 'Track your water intake in the Habit Tracker daily.'] } },
  { id: 'h2', icon: '🌙', title: 'Sleep 30 minutes earlier', desc: 'Your average sleep is 7 hours. Try targeting 7.5 hours this week by moving bedtime earlier.', reason: 'Based on: sleep log over the last 7 days',
    recipe: { description: 'Step-by-step wind-down routine for earlier sleep.', ingredients: ['Phone in another room', 'Dim lighting', 'Relaxing music or white noise'], steps: ['Set a bedtime alarm 45 minutes before your target.', 'Dim lights and stop screen use 30 minutes before bed.', 'Do 5 minutes of light stretching or deep breathing.', 'Keep bedroom cool (18–20°C) for optimal sleep.', 'Track sleep start time in your habit log.'] } },
  { id: 'h3', icon: '🚶', title: 'Add 500 steps daily', desc: 'Your average step count is 3,500. Take the stairs, park farther away, or add a short walk after lunch.', reason: 'Based on: daily activity data',
    recipe: { description: 'Easy ways to add 500 more steps to your day.', ingredients: ['Comfortable shoes', 'Step counter or phone pedometer'], steps: ['Take stairs instead of elevator every time.', 'Park your vehicle 250m farther than usual.', 'Walk for 5 minutes after each meal.', 'Walk to a colleague\'s desk instead of messaging.', 'Track daily steps in habit log.'] } },
  { id: 'h4', icon: '🥗', title: 'Add more vegetables to dinner', desc: 'Your fiber intake is below target. Add a serving of vegetables to every dinner this week.', reason: 'Based on: nutrition log this week',
    recipe: { description: 'Simple ways to add vegetables to every dinner.', ingredients: ['Any fresh or frozen vegetables', 'Olive oil', 'Salt, pepper, garlic'], steps: ['Choose 1–2 vegetables per dinner (broccoli, spinach, carrots, etc.).', 'Steam or stir-fry with olive oil and garlic for 5–8 minutes.', 'Season lightly and serve alongside your main dish.', 'Log in Habit Tracker: "Added vegetables to dinner ✓".'] } },
  { id: 'h5', icon: '🍽️', title: 'Eat at consistent times', desc: 'Irregular meal timing can disrupt metabolism. Try to eat breakfast, lunch, and dinner within a 30-min window each day.', reason: 'Based on: your meal log timestamps',
    recipe: { description: 'Building a consistent meal schedule.', ingredients: ['Phone calendar', 'Meal prep containers (optional)'], steps: ['Set fixed meal times: e.g., 7:00, 12:00, 19:00.', 'Set phone reminders for each meal.', 'Prep ingredients the night before to reduce delays.', 'Log actual meal times in the Habit Tracker.', 'Review consistency weekly.'] } },
  { id: 'h6', icon: '🧘', title: 'Practice 5-min mindful breathing', desc: 'Reduce cortisol and improve sleep quality with a 5-minute breathing exercise each morning or evening.', reason: 'Based on: your stress and sleep data',
    recipe: { description: 'Box breathing technique for stress reduction.', ingredients: ['Quiet space', 'Optional: guided app (Calm, Headspace)'], steps: ['Find a comfortable sitting position.', 'Inhale slowly through nose for 4 counts.', 'Hold breath for 4 counts.', 'Exhale slowly through mouth for 4 counts.', 'Hold empty for 4 counts.', 'Repeat 5–8 cycles. Do this morning or before bed.'] } },
  { id: 'h7', icon: '☀️', title: 'Get morning sunlight', desc: 'Exposure to natural light within 1 hour of waking regulates your circadian rhythm and improves mood.', reason: 'Based on: sleep quality patterns',
    recipe: { description: 'Morning sunlight routine for better sleep and mood.', ingredients: ['Open window or outdoor space', 'Comfortable chair or balcony'], steps: ['Within 30–60 minutes of waking, go outside or open windows.', 'Expose eyes to natural light (no sunglasses for first 10 min).', 'Combine with a 10-minute walk or coffee on the balcony.', 'Avoid bright phone screens before doing this.'] } },
  { id: 'h8', icon: '🍬', title: 'Reduce added sugar intake', desc: 'Try replacing sugary drinks with water or unsweetened beverages this week.', reason: 'Based on: your dietary pattern assessment',
    recipe: { description: 'Practical tips to cut added sugar from daily diet.', ingredients: ['Plain water', 'Unsweetened green tea', 'Sparkling water with lemon'], steps: ['Replace 1 sugary drink per day with water or green tea.', 'Read nutrition labels — look for "added sugars" under 5g per serving.', 'Use fruit to sweeten yogurt instead of honey or syrup.', 'Track reduced-sugar days in Habit Tracker.'] } },
  { id: 'h9', icon: '📵', title: 'Screen-free 30 min before bed', desc: 'Blue light from screens suppresses melatonin. Avoid phones and computers for 30 minutes before sleep.', reason: 'Based on: your average sleep hours and quality',
    recipe: { description: 'Screen-free wind-down routine for better sleep quality.', ingredients: ['Physical book or magazine', 'Journal', 'Dim lamp'], steps: ['Set phone to "Do Not Disturb" 30 minutes before target bedtime.', 'Place phone in another room or in a drawer.', 'Read a physical book, journal, or do light stretching instead.', 'Note how quickly you fall asleep over 7 days.'] } },
  { id: 'h10', icon: '🏋️', title: 'Follow your workout commitment', desc: 'You committed to working out regularly. Log each completed session to maintain your streak.', reason: 'Based on: your goal setting (commitment days/week)',
    recipe: { description: 'How to stay consistent with your workout commitment.', ingredients: ['Workout plan', 'Calendar', 'Comfortable workout clothes'], steps: ['Review your scheduled workout for the day each morning.', 'Prepare gym bag or workout clothes the night before.', 'Log the workout in Habit Tracker immediately after completing.', 'If you miss a day, don\'t skip the next — just reschedule.', 'Review your weekly completion rate every Sunday.'] } },
]

/* ─────────────────────────────────────────────────────────
   RECIPE MODAL
───────────────────────────────────────────────────────── */
const RecipeModal = ({ item, type, onClose }) => {
  if (!item) return null
  const { recipe } = item

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: 16,
          width: '100%', maxWidth: 560,
          maxHeight: '85vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Modal header */}
        <div style={{
          background: '#F97316', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>
              {type === 'activity' ? '🏃 Activity Guide' : type === 'habit' ? '✅ Habit Guide' : '🍽️ Recipe'}
            </div>
            <div style={{ fontSize: 12, color: '#FED7AA', marginTop: 2 }}>{item.name || item.title}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', border: 'none',
              color: '#fff', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div style={{ overflowY: 'auto', padding: '18px 20px', flex: 1 }}>
          {/* Description */}
          <div style={{
            background: '#FFF7ED', borderRadius: 9, padding: '10px 14px',
            marginBottom: 16, fontSize: 13, color: '#C2410C', lineHeight: 1.6,
          }}>
            {recipe.description}
          </div>

          {/* Macros row for meals */}
          {type === 'meal' && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: 8, marginBottom: 16,
            }}>
              {[['kcal', item.kcal], ['protein', `${item.protein}g`], ['carbs', `${item.carbs}g`], ['fat', `${item.fat}g`]].map(([l, v]) => (
                <div key={l} style={{
                  textAlign: 'center', padding: '8px 4px',
                  background: '#F9FAFB', borderRadius: 8,
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#F97316' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Activity stats */}
          {type === 'activity' && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap: 8, marginBottom: 16,
            }}>
              {[['Duration', item.duration], ['Calories burned', `~${item.kcal} kcal`], ['Level', item.level]].map(([l, v]) => (
                <div key={l} style={{
                  textAlign: 'center', padding: '8px 4px',
                  background: '#F9FAFB', borderRadius: 8,
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F97316' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Ingredients */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>
              {type === 'meal' ? '🛒 Ingredients' : type === 'activity' ? '🎒 What you need' : '📋 What you need'}
            </div>
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 0', borderBottom: '1px solid #F5F5F5',
                  fontSize: 13, color: '#374151',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#F97316', flexShrink: 0,
                  }} />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>
              {type === 'meal' ? '👨‍🍳 How to cook' : '📝 Steps'}
            </div>
            <ol style={{ paddingLeft: 0, listStyle: 'none' }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{
                  display: 'flex', gap: 10, padding: '7px 0',
                  borderBottom: i < recipe.steps.length - 1 ? '1px solid #F5F5F5' : 'none',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#FFF7ED', color: '#F97316',
                    fontSize: 11, fontWeight: 600, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '10px', borderRadius: 9,
              background: '#F97316', border: 'none',
              color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MEAL CARD
───────────────────────────────────────────────────────── */
const MealCard = ({ meal, onDetail }) => (
  <div style={{
    background: '#FFFFFF',
    border: `${meal.featured ? '2px solid #F97316' : '1px solid #F0F0F0'}`,
    borderRadius: 12, padding: '14px',
    display: 'flex', flexDirection: 'column', gap: 8,
    position: 'relative',
    transition: 'box-shadow 0.15s',
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
  >
    {meal.featured && (
      <span style={{
        position: 'absolute', top: 10, right: 10,
        fontSize: 10, fontWeight: 500,
        background: '#F97316', color: '#fff',
        padding: '2px 8px', borderRadius: 99,
      }}>★ Recommended</span>
    )}
    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{meal.time} — {meal.hour}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.4, minHeight: 40 }}>{meal.name}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {meal.tags.map(t => (
        <span key={t} style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 99,
          background: '#F5F5F5', color: '#6B7280',
        }}>{t}</span>
      ))}
    </div>
    {/* Macros */}
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      gap: 4, paddingTop: 8, borderTop: '1px solid #F5F5F5',
    }}>
      {[['kcal', meal.kcal], ['prot', `${meal.protein}g`], ['carbs', `${meal.carbs}g`], ['fat', `${meal.fat}g`]].map(([l, v]) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{v}</div>
          <div style={{ fontSize: 9, color: '#9CA3AF' }}>{l}</div>
        </div>
      ))}
    </div>
    {/* Detail button */}
    <button
      onClick={() => onDetail(meal, 'meal')}
      style={{
        marginTop: 4, padding: '7px', borderRadius: 8,
        background: '#FFF7ED', border: '1px solid #FED7AA',
        color: '#C2410C', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', width: '100%',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'}
      onMouseLeave={e => e.currentTarget.style.background = '#FFF7ED'}
    >
      View recipe →
    </button>
  </div>
)

/* ─────────────────────────────────────────────────────────
   ACTIVITY CARD
───────────────────────────────────────────────────────── */
const ActivityCard = ({ activity: a, onDetail }) => {
  const bgMap = { '#22C55E': '#F0FDF4', '#3B82F6': '#EFF6FF', '#F59E0B': '#FFFBEB', '#EF4444': '#FEF2F2' }
  const bg = bgMap[a.levelColor] || '#F5F5F5'
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #F0F0F0',
      borderRadius: 12, padding: '14px',
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: bg, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: a.levelColor,
        }}>{a.short}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{a.name}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{a.desc}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: bg, color: a.levelColor }}>{a.level}</span>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#F5F5F5', color: '#6B7280' }}>{a.time}</span>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: '#F5F5F5', color: '#6B7280' }}>{a.duration}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F5F5F5' }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>~<strong style={{ color: '#1A1A1A' }}>{a.kcal}</strong> kcal burned</span>
        <button
          onClick={() => onDetail(a, 'activity')}
          style={{
            padding: '6px 12px', borderRadius: 8,
            background: '#FFF7ED', border: '1px solid #FED7AA',
            color: '#C2410C', fontSize: 11, fontWeight: 500, cursor: 'pointer',
          }}
        >View guide →</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   HABIT CARD
───────────────────────────────────────────────────────── */
const HabitCard = ({ habit, onDetail }) => (
  <div style={{
    background: '#FFFFFF', border: '1px solid #F0F0F0',
    borderRadius: 12, padding: '14px',
    display: 'flex', flexDirection: 'column', gap: 8,
    transition: 'box-shadow 0.15s',
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
  >
    <div style={{ fontSize: 22 }}>{habit.icon}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.4 }}>{habit.title}</div>
    <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, flex: 1 }}>{habit.desc}</div>
    <div style={{
      fontSize: 11, color: '#C2410C',
      background: '#FFF7ED', padding: '5px 9px',
      borderRadius: 7, lineHeight: 1.4,
    }}>{habit.reason}</div>
    <button
      onClick={() => onDetail(habit, 'habit')}
      style={{
        padding: '7px', borderRadius: 8,
        background: '#FFF7ED', border: '1px solid #FED7AA',
        color: '#C2410C', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', width: '100%',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#FEF3C7'}
      onMouseLeave={e => e.currentTarget.style.background = '#FFF7ED'}
    >
      View guide →
    </button>
  </div>
)

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
const TABS = [
  { id: 'meals',      label: 'Meal plan' },
  { id: 'activities', label: 'Activities' },
  { id: 'habits',     label: 'Healthy habits' },
]

export const Rekomendasi = () => {
  const { recommendations } = useApp()
  const [activeTab, setActiveTab]   = useState('meals')
  const [refreshing, setRefreshing] = useState(false)
  const [modal, setModal]           = useState(null) // { item, type }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const totalKcal = MEAL_DATA.reduce((s, m) => s + m.kcal, 0)

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* AI Banner */}
      <div style={{
        background: '#F97316', borderRadius: 12,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 18 }}>✨</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>Daily recommendations updated</div>
            <div style={{ fontSize: 11, color: '#FED7AA', marginTop: 2 }}>Last updated today at 06:00 — Model v2.1</div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            padding: '8px 16px', borderRadius: 9,
            background: '#FFFFFF', border: 'none',
            color: '#C2410C', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{
            display: 'inline-block',
            animation: refreshing ? 'spin 1s linear infinite' : 'none',
          }}>↻</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #F0F0F0', gap: 0 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 20px', fontSize: 13,
              fontWeight: activeTab === t.id ? 600 : 400,
              color: activeTab === t.id ? '#F97316' : '#9CA3AF',
              background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === t.id ? '#F97316' : 'transparent'}`,
              marginBottom: -1, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* ── Meal plan tab ───────────────────────────── */}
      {activeTab === 'meals' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 12, marginBottom: 12,
          }}>
            {MEAL_DATA.map(m => (
              <MealCard key={m.id} meal={m} onDetail={(item, type) => setModal({ item, type })} />
            ))}
          </div>
          <div style={{
            background: '#FFF7ED', borderRadius: 9,
            padding: '10px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>Total calories today</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
              {totalKcal.toLocaleString()} / 1,800 kcal
              <span style={{ fontSize: 11, fontWeight: 400, color: '#16A34A', marginLeft: 8 }}>— within target</span>
            </span>
          </div>
        </div>
      )}

      {/* ── Activities tab ──────────────────────────── */}
      {activeTab === 'activities' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {ACTIVITY_DATA.map(a => (
            <ActivityCard key={a.id} activity={a} onDetail={(item, type) => setModal({ item, type })} />
          ))}
        </div>
      )}

      {/* ── Healthy habits tab ──────────────────────── */}
      {activeTab === 'habits' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
        }}>
          {HABIT_DATA.map(h => (
            <HabitCard key={h.id} habit={h} onDetail={(item, type) => setModal({ item, type })} />
          ))}
        </div>
      )}

      {/* Recipe / Guide Modal */}
      {modal && (
        <RecipeModal
          item={modal.item}
          type={modal.type}
          onClose={() => setModal(null)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
