import { useApp } from '../hooks/useApp'
import { StatCard, ProgressBar } from '../components/index'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Dashboard = () => {
  const { dailyHealth, userProfile, habits, progressData } = useApp()
  
  const completedHabits = habits.filter(h => h.completed).length
  const totalHabits = habits.length

  return (
    <div className="p-8">
      <div className="app-container">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">Daily Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{dailyHealth.date}</p>
      </header>

      {/* Compact Stats Row */}
      <div className="stat-row mb-6">
        <div className="stat-small">
          <div className="title">Weight</div>
          <div className="value">{dailyHealth.weight} kg</div>
        </div>
        <div className="stat-small">
          <div className="title">Calories</div>
          <div className="value">{dailyHealth.calorieIntake} kcal</div>
        </div>
        <div className="stat-small">
          <div className="title">Water</div>
          <div className="value">{dailyHealth.waterIntake} glasses</div>
        </div>
        <div className="stat-small">
          <div className="title">Activity</div>
          <div className="value">{dailyHealth.activity} steps</div>
        </div>
      </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold mb-6">Weight trend (7 hari)</h2>
          <ResponsiveContainer width="100%" height={300}>
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
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#6366f1" 
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Habits Card */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Kebiasaan Hari Ini</h2>
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Sarapan sehat</p>
                <p className="text-sm text-gray-400">07:30</p>
              </div>
              <div className="text-green-500">●</div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Minum 2 gelas air</p>
                <p className="text-sm text-gray-400">08:00</p>
              </div>
              <div className="text-green-500">●</div>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Olahraga ringan</p>
                <p className="text-sm text-gray-400">09:00</p>
              </div>
              <div className="text-gray-300">○</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Nutrition Goal */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Average Nutrition Achievement</h2>
        <div className="space-y-4">
          <ProgressBar 
            label="Calories" 
            value={dailyHealth.calorieIntake} 
            target={dailyHealth.calorieTarget}
            color="bg-blue-500"
          />
          <ProgressBar 
            label="Protein" 
            value={76} 
            target={100}
            color="bg-green-500"
          />
          <ProgressBar 
            label="Carbs" 
            value={91} 
            target={100}
            color="bg-yellow-500"
          />
          <ProgressBar 
            label="Fat" 
            value={68} 
            target={100}
            color="bg-pink-500"
          />
          <ProgressBar 
            label="Fiber" 
            value={55} 
            target={100}
            color="bg-purple-500"
          />
          <ProgressBar 
            label="Water Intake" 
            value={63} 
            target={100}
            color="bg-cyan-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="btn-secondary">View Nutrition Details</button>
        <button className="btn-secondary">Update Activity</button>
        <button className="btn-primary">See Today's Recommendations</button>
      </div>
    </div>
  )
}
