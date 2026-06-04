import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Kebiasaan } from './pages/Kebiasaan'
import { Rekomendasi } from './pages/Rekomendasi'
import { RecipePage } from './pages/RecipePage'
import { Progress } from './pages/Progress'
import { Profil } from './pages/Profil'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { BasicIdentity } from './pages/BasicIdentity'
import { HealthSecurity } from './pages/HealthSecurity'
import { GoalSetting } from './pages/GoalSetting'
import { Lifestyle } from './pages/Lifestyle'
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

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (onboardingStep && onboardingStep !== 'complete') {
    return (
      <Routes>
        <Route path="/onboarding/basic-identity" element={<BasicIdentity />} />
        <Route path="/onboarding/lifestyle" element={<Lifestyle />} />
        <Route path="/onboarding/health-security" element={<HealthSecurity />} />
        <Route path="/onboarding/goal-setting" element={<GoalSetting />} />
        <Route path="*" element={<Navigate to="/onboarding/basic-identity" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kebiasaan" element={<Kebiasaan />} />
        <Route path="/rekomendasi" element={<Rekomendasi />} />
        <Route path="/rekomendasi/resep/:id" element={<RecipePage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profil" element={<Profil />} />
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