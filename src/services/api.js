import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// User APIs
export const getUserProfile = (userId) => {
  return apiClient.get(`/users/${userId}`)
}

export const updateUserProfile = (userId, data) => {
  return apiClient.put(`/users/${userId}`, data)
}

// Daily Health APIs
export const getDailyHealth = (userId, date) => {
  return apiClient.get(`/daily-health/${userId}`, { params: { date } })
}

export const updateDailyHealth = (userId, data) => {
  return apiClient.put(`/daily-health/${userId}`, data)
}

// Habit APIs
export const getHabits = (userId) => {
  return apiClient.get(`/habits/${userId}`)
}

export const createHabit = (userId, habitData) => {
  return apiClient.post(`/habits/${userId}`, habitData)
}

export const updateHabit = (habitId, data) => {
  return apiClient.put(`/habits/${habitId}`, data)
}

export const deleteHabit = (habitId) => {
  return apiClient.delete(`/habits/${habitId}`)
}

// Recommendation APIs
export const getRecommendations = (userId) => {
  return apiClient.get(`/recommendations/${userId}`)
}

export const generateNewRecommendations = (userId) => {
  return apiClient.post(`/recommendations/${userId}/generate`)
}

// Progress APIs
export const getProgressData = (userId, period = '7') => {
  return apiClient.get(`/progress/${userId}`, { params: { period } })
}

// Notification APIs
export const getNotifications = (userId) => {
  return apiClient.get(`/notifications/${userId}`)
}

export const markNotificationAsRead = (notificationId) => {
  return apiClient.put(`/notifications/${notificationId}/read`)
}

// Error handling
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    throw error
  }
)

export default apiClient
