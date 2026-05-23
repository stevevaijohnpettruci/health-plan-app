import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Kebiasaan } from './pages/Kebiasaan'
import { Rekomendasi } from './pages/Rekomendasi'
import { Progress } from './pages/Progress'
import { Profil } from './pages/Profil'
import { Notifikasi } from './pages/Notifikasi'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { BasicIdentity } from './pages/BasicIdentity'
import { LifestyleAssessment } from './pages/LifestyleAssessment'
import { HealthSecurity } from './pages/HealthSecurity'
import { GoalSetting } from './pages/GoalSetting'
import { useAuth } from './hooks/useAuth'

function AppRoutes() {
  const { isAuthenticated, loading, onboardingStep } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600 font-semibold">Memuat...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show auth pages
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Authenticated but not completed onboarding
  if (onboardingStep && onboardingStep !== 'complete') {
    return (
      <Routes>
        <Route path="/onboarding/basic-identity" element={<BasicIdentity />} />
        <Route path="/onboarding/lifestyle" element={<LifestyleAssessment />} />
        <Route path="/onboarding/health-security" element={<HealthSecurity />} />
        <Route path="/onboarding/goal-setting" element={<GoalSetting />} />
        <Route path="*" element={<Navigate to="/onboarding/basic-identity" replace />} />
      </Routes>
    )
  }

  // Fully authenticated - show main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kebiasaan" element={<Kebiasaan />} />
        <Route path="/rekomendasi" element={<Rekomendasi />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/notifikasi" element={<Notifikasi />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
