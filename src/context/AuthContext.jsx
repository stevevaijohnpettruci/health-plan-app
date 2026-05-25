import React, { createContext, useState, useCallback, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [onboardingStep, setOnboardingStep] = useState(null) // null, 'register', 'login', 'basic-identity', 'lifestyle', 'health-security', 'goal-setting'
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('healthplan_user')
    const authToken = localStorage.getItem('healthplan_auth')
    
    if (savedUser && authToken) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    // determine onboarding step from saved profile
    try {
      const profile = JSON.parse(localStorage.getItem('healthplan_profile') || '{}')
      const required = ['age', 'weight', 'height', 'activityLevel']
      const missing = required.some(k => profile[k] === undefined || profile[k] === null || profile[k] === '')
      if (savedUser && authToken) {
        setOnboardingStep(missing ? 'basic-identity' : (profile._onboardingComplete ? 'complete' : null))
      }
    } catch (e) {
      // ignore parse errors
    }
    setLoading(false)
  }, [])

  const register = useCallback((fullName, email, password) => {
    const newUser = {
      id: 'user_' + Date.now(),
      fullName,
      email,
      password, // In real app, never store plaintext password
      registeredAt: new Date().toISOString()
    }
    localStorage.setItem('healthplan_user', JSON.stringify(newUser))
    localStorage.setItem('healthplan_auth', 'token_' + Date.now())
    setUser(newUser)
    setIsAuthenticated(true)
    setOnboardingStep('basic-identity')
    return true
  }, [])

  const login = useCallback((email, password) => {
    const savedUser = localStorage.getItem('healthplan_user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      if (parsed.email === email && parsed.password === password) {
        localStorage.setItem('healthplan_auth', 'token_' + Date.now())
        setUser(parsed)
        setIsAuthenticated(true)
        // set onboarding step based on profile completeness
        try {
          const profile = JSON.parse(localStorage.getItem('healthplan_profile') || '{}')
          const required = ['age', 'weight', 'height', 'activityLevel']
          const missing = required.some(k => profile[k] === undefined || profile[k] === null || profile[k] === '')
          setOnboardingStep(missing ? 'basic-identity' : (profile._onboardingComplete ? 'complete' : null))
        } catch (e) {}
        return true
      }
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('healthplan_user')
    localStorage.removeItem('healthplan_auth')
    localStorage.removeItem('healthplan_profile')
    setUser(null)
    setIsAuthenticated(false)
    setOnboardingStep(null)
  }, [])

  const completeOnboardingStep = useCallback((stepData) => {
    if (!user) return

    const steps = ['basic-identity', 'lifestyle', 'health-security', 'goal-setting']
    const currentIndex = steps.indexOf(onboardingStep)
    
    // Save step data
    const allOnboarding = JSON.parse(localStorage.getItem('healthplan_profile') || '{}')
    const updated = { ...allOnboarding, ...stepData }
    localStorage.setItem('healthplan_profile', JSON.stringify(updated))

    if (currentIndex < steps.length - 1) {
      setOnboardingStep(steps[currentIndex + 1])
    } else {
      // Onboarding complete
      setOnboardingStep('complete')
    }
  }, [user, onboardingStep])

  const skipToStep = useCallback((step) => {
    setOnboardingStep(step)
  }, [])

  const value = {
    isAuthenticated,
    user,
    onboardingStep,
    loading,
    register,
    login,
    logout,
    completeOnboardingStep,
    skipToStep
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
