import { useApp } from '../hooks/useApp'
import { ProgressBar } from '../components/index'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Progress = () => {
  const { progressData } = useApp()

  return (
    <div className="p-8 page-inner">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Health Progress</h1>
        <div className="flex gap-2 mt-4">
          {['7 days', '30 days', '3 months'].map(period => (
            <button key={period} className="btn-secondary text-sm">
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Initial Weight</p>
          <p className="text-2xl font-bold">70.5 kg</p>
          <p className="text-xs text-gray-500 mt-1">April 18, 2026</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Current Weight</p>
          <p className="text-2xl font-bold">68.0 kg</p>
          <p className="text-danger text-xs mt-1">▼ 2.5 kg measured</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Target Weight</p>
          <p className="text-2xl font-bold">85.0 kg</p>
          <p className="text-success text-xs mt-1">3.0 kg more to go</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-sm mb-2">Active Streak</p>
          <p className="text-2xl font-bold">6 days</p>
          <p className="text-warning text-xs mt-1">Best: 12 days</p>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Weight Trend</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={progressData.weeklyWeight}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
            <XAxis 
              dataKey="day" 
              stroke="#999"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#999"
              style={{ fontSize: '12px' }}
              domain={[67, 73]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#6366f1" 
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nutrition Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Average Nutrition Achievement</h2>
          <div className="space-y-5">
            <ProgressBar 
              label="Calories" 
              value={progressData.nutritionToday.calorie.value} 
              target={progressData.nutritionToday.calorie.target}
              color="bg-blue-500"
            />
            <ProgressBar 
              label="Protein" 
              value={progressData.nutritionToday.protein.value} 
              target={progressData.nutritionToday.protein.target}
              color="bg-green-500"
            />
            <ProgressBar 
              label="Carbs" 
              value={progressData.nutritionToday.carbs.value} 
              target={progressData.nutritionToday.carbs.target}
              color="bg-yellow-500"
            />
            <ProgressBar 
              label="Lemak" 
              value={progressData.nutritionToday.fat.value} 
              target={progressData.nutritionToday.fat.target}
              color="bg-pink-500"
            />
            <ProgressBar 
              label="Serat" 
              value={55} 
              target={100}
              color="bg-purple-500"
            />
            <ProgressBar 
              label="Air minum" 
              value={progressData.nutritionToday.water.value} 
              target={progressData.nutritionToday.water.target}
              color="bg-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Streak Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Streak & konsistensi</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl mb-2">✓</p>
                <p className="text-2xl font-bold">{progressData.streak.consecutive}</p>
                <p className="text-xs text-gray-500 mt-1">Hari berturut-turut</p>
              </div>
              <div>
                <p className="text-3xl mb-2">📊</p>
                <p className="text-2xl font-bold">{progressData.streak.total}</p>
                <p className="text-xs text-gray-500 mt-1">Total hari aktif</p>
              </div>
              <div>
                <p className="text-3xl mb-2">⭐</p>
                <p className="text-2xl font-bold">{progressData.streak.longest}</p>
                <p className="text-xs text-gray-500 mt-1">Streak terpanjang</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Pencapaian (badge)</h3>
            <div className="space-y-2">
              {progressData.badges.map((badge, idx) => (
                <div 
                  key={idx}
                  className={`p-2 rounded text-xs ${
                    badge.earned 
                      ? 'bg-success/20 text-success' 
                      : 'bg-dark-input text-gray-500'
                  }`}
                >
                  {badge.earned ? '✓' : '🔒'} {badge.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
