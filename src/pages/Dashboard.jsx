import { useApp } from '../hooks/useApp'
import { StatCard, ProgressBar } from '../components/index'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Dashboard = () => {
  const { dailyHealth, userProfile, habits, progressData } = useApp()
  
  const completedHabits = habits.filter(h => h.completed).length
  const totalHabits = habits.length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Daily Dashboard</h1>
          <p className="text-gray-400">{dailyHealth.date}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="[WEIGHT]"
          title="Weight"
          value={dailyHealth.weight}
          unit="kg"
          subtitle="Down 0.3kg this week"
          color="danger"
        />
        <StatCard
          icon="[CALORIES]"
          title="Calories Today"
          value={dailyHealth.calorieIntake}
          unit="kcal"
          subtitle={`Target ${dailyHealth.calorieTarget} kcal`}
          color="warning"
        />
        <StatCard
          icon="[WATER]"
          title="Water Intake"
          value={dailyHealth.waterIntake}
          unit="glasses"
          subtitle={`${Math.round((dailyHealth.waterIntake / dailyHealth.waterTarget) * 100)}% of goal`}
          color="primary"
        />
        <StatCard
          icon="[ACTIVITY]"
          title="Activity"
          value={dailyHealth.activity}
          unit="steps"
          subtitle={`Target ${dailyHealth.activityTarget.toLocaleString()}`}
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold mb-6">Weight Trend (7 days)</h2>
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
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Habits Card */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
          <div className="text-center py-4">
            <div className="text-5xl font-bold text-primary mb-2">
              {completedHabits}/{totalHabits}
            </div>
            <p className="text-gray-400 text-sm mb-4">Completed today</p>
            <div className="space-y-2 text-sm">
              <p className="text-green-400">✓ Healthy breakfast</p>
              <p className="text-green-400">✓ Morning water intake</p>
              <p className="text-green-400">✓ Morning exercise</p>
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
