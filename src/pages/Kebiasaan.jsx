import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { HabitCheckbox } from '../components/index'

export const Kebiasaan = () => {
  const { habits, toggleHabit, dailyHealth, updateDailyHealth } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Food', 'Water', 'Exercise', 'Sleep']
  
  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory)

  const handleInputChange = (e, field) => {
    updateDailyHealth({ [field]: e.target.value })
  }

  const newHabitIntake = dailyHealth.waterIntake || 0
  const newCalorieIntake = dailyHealth.calorieIntake || 0
  const newActivityCount = dailyHealth.activity || 0

  return (
    <div className="p-8 page-inner">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Daily Habits</h1>
        <p className="text-gray-400">{dailyHealth.date}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist Kebiasaan */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Today's Checklist</h2>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-dark-input text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Habits List */}
            <div className="space-y-2">
              {filteredHabits.map(habit => (
                <HabitCheckbox
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Log New Habits */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Log New Habit</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Water Intake</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateDailyHealth({ waterIntake: Math.max(0, newHabitIntake - 1) })}
                  className="bg-dark-input hover:bg-dark-card px-3 py-2 rounded text-gray-700"
                >
                  −
                </button>
                <input
                  type="number"
                  value={newHabitIntake}
                  onChange={(e) => handleInputChange(e, 'waterIntake')}
                  placeholder="0"
                  className="input-base text-center flex-1"
                />
                <button 
                  onClick={() => updateDailyHealth({ waterIntake: newHabitIntake + 1 })}
                  className="bg-dark-input hover:bg-dark-card px-3 py-2 rounded text-gray-700"
                >
                  +
                </button>
                <span className="text-gray-400 text-sm">glasses</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Light Exercise</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateDailyHealth({ activity: Math.max(0, newActivityCount - 100) })}
                  className="bg-dark-input hover:bg-dark-card px-3 py-2 rounded text-gray-700"
                >
                  −
                </button>
                <input
                  type="number"
                  value={newActivityCount}
                  onChange={(e) => handleInputChange(e, 'activity')}
                  placeholder="0"
                  className="input-base text-center flex-1"
                />
                <button 
                  onClick={() => updateDailyHealth({ activity: newActivityCount + 100 })}
                  className="bg-dark-input hover:bg-dark-card px-3 py-2 rounded text-gray-700"
                >
                  +
                </button>
                <span className="text-gray-400 text-sm">steps</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Calories In</label>
              <input
                type="number"
                value={newCalorieIntake}
                onChange={(e) => handleInputChange(e, 'calorieIntake')}
                placeholder="0"
                className="input-base"
              />
              <p className="text-xs text-gray-500 mt-2">e.g. 500 kcal</p>
            </div>

            <button className="btn-primary w-full">Log Habit</button>
          </div>
        </div>
      </div>
    </div>
  )
}
