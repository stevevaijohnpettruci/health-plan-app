import React, { createContext, useState, useCallback, useEffect } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    // Account & Identity
    id: 'user123',
    fullName: 'Zaky Ambadar',
    email: 'zaky.ambadar@email.com',
    registeredAt: '2026-04-01',

    // Basic Identity
    age: 24,
    gender: 'Male', // Male / Female
    weight: 68, // kg
    height: 170, // cm
    bloodPressure: { systolic: 120, diastolic: 80 }, // mmHg
    heartRate: 72, // bpm

    // Lifestyle & Diet Habits
    dietaryPattern: 'High Protein', // Low Cholesterol, Low Protein, High Protein, Very Low Carbs, High Fiber, Vegan, Egg Free, Dairy Free, Gluten Free, Kosher, Lactose Free
    mealsPerDay: 3,
    dailyWaterIntakeGoal: 2000, // ml
    avgSleepHours: 7, // hours (4-12)
    smokingHabits: 'No', // Yes / No
    activityLevel: 'Lightly Active', // Sedentary, Lightly Active, Moderately Active, Very Active, Extra Active

    // Medical Safety & Limitations
    medicalHistory: [], // [Hypertension, Diabetes, Asthma, Cholesterol]
    physicalInjuries: '', // Text area for injuries
    currentMedication: '', // Medications
    allergies: [], // Food allergies

    // Health Goals & Commitment
    primaryGoal: 'Weight Loss', // Weight Loss, Muscle Gain, Endurance, General Well-being
    targetWeight: 65, // kg
    commitmentDays: 5, // Days per week
    preferredActivities: ['Running', 'Walking'], // [Yoga, Running, Weight Training, Walking]

    // Calculated fields
    bmi: 23.5,
    bmiCategory: 'Normal',
    bmr: 1700, // Basal Metabolic Rate
    tdee: 2380, // Total Daily Energy Expenditure
    healthRank: 'Intermediate', // Novice, Intermediate, Pro
    activityPoints: 0
  })

  const [dailyHealth, setDailyHealth] = useState({
    date: new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    weight: 68,
    calorieIntake: 1420,
    calorieTarget: 1800,
    waterIntake: 5,
    waterTarget: 8,
    activity: 3240,
    activityTarget: 3000,
  })

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Sarapan sehat',
      time: '07:30',
      category: 'Makanan',
      completed: true,
      targetRange: '350-450 kcal'
    },
    {
      id: 2,
      name: 'Minum air pagi',
      time: '08:00',
      category: 'Air',
      completed: true,
      targetIntake: '2 gelas'
    },
    {
      id: 3,
      name: 'Olahraga pagi',
      time: '09:00',
      category: 'Olahraga',
      completed: true,
      targetTime: '30 menit'
    },
    {
      id: 4,
      name: 'Makan siang',
      time: '12:00',
      category: 'Makanan',
      completed: false,
      targetRange: '500 kcal'
    },
    {
      id: 5,
      name: 'Jalan kaki 30 menit',
      time: '17:00',
      category: 'Olahraga',
      completed: false,
      targetTime: '30 menit'
    },
    {
      id: 6,
      name: 'Tidur tepat waktu',
      time: '22:00',
      category: 'Tidur',
      completed: false,
      targetTime: '8 jam'
    }
  ])

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Nasi merah + Ayam bakar + Sayur bening',
      time: '12:00',
      category: 'Menu makanan',
      calories: 510,
      protein: 38,
      carbs: 62,
      fat: 9,
      icon: '🍛'
    },
    {
      id: 2,
      title: 'Sup tahu + Tempe kukus + Nasi sedkit',
      time: '19:00',
      category: 'Menu makanan',
      calories: 380,
      protein: 22,
      carbs: 45,
      fat: 11,
      icon: '🍲'
    }
  ])

  const [progressData, setProgressData] = useState({
    weeklyWeight: [
      { day: '18/4', weight: 72 },
      { day: '19/4', weight: 71 },
      { day: '20/4', weight: 70 },
      { day: '21/4', weight: 69.5 },
      { day: '22/4', weight: 69 },
      { day: '23/4', weight: 68.5 },
      { day: '24/4', weight: 68 }
    ],
    nutritionToday: {
      calorie: { value: 82, target: 100 },
      protein: { value: 76, target: 100 },
      carbs: { value: 91, target: 100 },
      fat: { value: 68, target: 100 },
      water: { value: 63, target: 100 }
    },
    streak: {
      consecutive: 6,
      total: 38,
      longest: 12
    },
    badges: [
      { name: 'Mulai perjalanan', earned: true },
      { name: '7 hari aktif', earned: true },
      { name: 'Turun 2 kg', earned: true },
      { name: '30 hari aktif', earned: false },
      { name: 'Streak 14 hari', earned: false },
      { name: 'Nutrisi sempurna 7 hari', earned: false }
    ]
  })

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'reminder',
      title: 'Waktunya makan siang!',
      time: '12:00',
      read: false
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Minum air — sudah 5 jam',
      time: '13:30',
      read: false
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Reminder olahraga sore',
      time: '17:00',
      read: true
    }
  ])

  const toggleHabit = useCallback((habitId) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    )
  }, [])

  const updateUserProfile = useCallback((updates) => {
    setUserProfile(prev => {
      const next = { ...prev, ...updates }
      // Persist the updated profile to localStorage using the new value
      try {
        localStorage.setItem('healthplan_profile', JSON.stringify(next))
      } catch (e) {
        // ignore localStorage errors in environments where it's unavailable
      }
      return next
    })
  }, [])

  const updateBasicIdentity = useCallback((data) => {
    setUserProfile(prev => ({
      ...prev,
      age: data.age,
      gender: data.gender,
      weight: data.weight,
      height: data.height,
      activityLevel: data.activityLevel
    }))
  }, [])

  const updateLifestyleAssessment = useCallback((data) => {
    setUserProfile(prev => ({
      ...prev,
      dietaryPattern: data.dietaryPattern,
      mealsPerDay: data.mealsPerDay,
      dailyWaterIntakeGoal: data.dailyWaterIntakeGoal,
      avgSleepHours: data.avgSleepHours,
      smokingHabits: data.smokingHabits
    }))
  }, [])

  const updateHealthSecurity = useCallback((data) => {
    setUserProfile(prev => ({
      ...prev,
      medicalHistory: data.medicalHistory,
      physicalInjuries: data.physicalInjuries,
      currentMedication: data.currentMedication,
      bloodPressure: data.bloodPressure,
      heartRate: data.heartRate,
      allergies: data.allergies
    }))
  }, [])

  const updateGoalSetting = useCallback((data) => {
    setUserProfile(prev => ({
      ...prev,
      primaryGoal: data.primaryGoal,
      targetWeight: data.targetWeight,
      commitmentDays: data.commitmentDays,
      preferredActivities: data.preferredActivities
    }))
  }, [])


  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev])
  }, [])

  const value = {
    // User Profile & Identity
    userProfile,
    setUserProfile,
    updateUserProfile,
    updateBasicIdentity,
    updateLifestyleAssessment,
    updateHealthSecurity,
    updateGoalSetting,
    
    // Daily Health & Habits
    dailyHealth,
    updateDailyHealth: useCallback((update) => {
      setDailyHealth(prev => ({ ...prev, ...update }))
    }, []),
    habits,
    toggleHabit,
    
    // Recommendations & Notifications
    recommendations,
    progressData,
    notifications,
    addNotification
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
