import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userProfile } = useApp()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/kebiasaan', label: 'Habits' },
    { path: '/rekomendasi', label: 'Recommendations' },
    { path: '/profil', label: 'My Profile' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex flex-col h-full w-full">
      {/* Logo */}
      <div className="p-6 border-b w-full">
        <h1 className="text-2xl font-bold">HealthPlan</h1>
        <p className="text-sm text-gray-500">Health Platform</p>
      </div>

      {/* Menu wrapper ensures menu stacks under logo */}
      <div className="flex-1 w-full overflow-auto">
        <nav className="p-6 space-y-2 w-full">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile at bottom - always render logout even if profile missing */}
      <div className="p-6 border-t w-full" style={{ marginTop: 'auto' }}>
        <div 
          onClick={() => navigate('/profil')}
          className="flex items-center space-x-3 mb-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {userProfile?.fullName ? userProfile.fullName.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div>
            <p className="font-medium text-sm">{userProfile?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500">{userProfile?.bmiCategory || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full px-3 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
