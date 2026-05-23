import { useState } from 'react'
import { useApp } from '../hooks/useApp'
import { RecommendationCard } from '../components/index'

export const Rekomendasi = () => {
  const { recommendations } = useApp()
  const [activeTab, setActiveTab] = useState('Food Menu')

  const tabs = ['Food Menu', 'Physical Activity', 'Healthy Habits']

  const handleAcceptRecommendation = (rec) => {
    console.log('Accepted recommendation:', rec)
    // TODO: Add notification
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Recommendations</h1>
        <p className="text-gray-400 text-lg">Generated based on your habit data</p>
      </div>

      {/* AI Generated Alert */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          <span className="text-3xl">▶️</span>
          <div>
            <h3 className="text-lg font-semibold mb-1">Daily recommendations updated</h3>
            <p className="text-gray-400 text-sm">Last updated: today, 06:00 — Model v2.1</p>
          </div>
          <button className="ml-auto btn-primary">Refresh</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-dark-input">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              activeTab === tab
                ? 'border-primary text-white'
                : 'border-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recommendations.slice(0, 3).map(rec => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onAccept={handleAcceptRecommendation}
          />
        ))}
      </div>

      {/* More Recommendations */}
      <div className="card text-center py-12">
        <p className="text-gray-400 mb-4">Want to see more recommendations?</p>
        <button className="btn-secondary">View More Recommendations</button>
      </div>

      {/* AI Model Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <p className="text-gray-400 mb-2">Model Accuracy</p>
          <p className="text-3xl font-bold text-primary">87%</p>
          <p className="text-sm text-gray-500 mt-2">Based on your data</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-400 mb-2">Habit Trend</p>
          <p className="text-3xl font-bold text-success">↑ 12%</p>
          <p className="text-sm text-gray-500 mt-2">Consistency improvement</p>
        </div>
        <div className="card text-center">
          <p className="text-gray-400 mb-2">Recommendations Accepted</p>
          <p className="text-3xl font-bold text-warning">42</p>
          <p className="text-sm text-gray-500 mt-2">Total recommendations</p>
        </div>
      </div>
    </div>
  )
}
