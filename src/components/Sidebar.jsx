import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile } = useApp()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/kebiasaan', label: 'Habits', icon: '📋' },
    { path: '/rekomendasi', label: 'Recommendations', icon: '🤖' },
    { path: '/profil', label: 'My Profile', icon: '👤' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-input min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-input">
        <h1 className="text-2xl font-bold">HealthPlan</h1>
        <p className="text-sm text-gray-400">Health Platform</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive(item.path)
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:text-gray-900 hover:bg-dark-input'
            }`}
          >
            <span className="text-lg font-bold">[{item.label}]</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-dark-input">
        <div 
          onClick={() => navigate('/profil')}
          className="flex items-center space-x-3 mb-4 cursor-pointer hover:opacity-80 transition"
        >
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {userProfile?.fullName?.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-sm">{userProfile?.fullName}</p>
            <p className="text-xs text-gray-400">{userProfile?.bmiCategory}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-red-600/20 text-red-400 rounded text-sm font-medium hover:bg-red-600/30 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
