import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    try {
      const success = login(formData.email, formData.password)
      if (success) {
        navigate('/')
      } else {
        setError('Email or password is incorrect')
      }
    } catch (err) {
      setError('Login failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl bg-white">
        <div className="bg-orange-500 py-8 px-6 text-center">
          <div className="w-14 h-14 bg-white rounded-xl mx-auto mb-3"></div>
          <h1 className="text-2xl font-bold text-white">HealthPlan</h1>
          <p className="text-orange-100 text-sm mt-1">Optimize your healthy lifestyle</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
            <p className="text-gray-500 text-sm mt-2">Access your health dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Sign in'}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="px-3 text-gray-400 text-sm">or</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button type="button" className="w-full border border-gray-200 rounded-lg py-2.5 flex items-center justify-center gap-3 text-sm bg-white">
            <img src="/google-icon.png" alt="google" className="w-5 h-5" />
            Continue with Google
          </button>
        </form>

        {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-orange-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200 text-sm">
            <p className="text-orange-700 font-semibold mb-1">Demo account</p>
            <div className="text-orange-600">
              Email: zaky.ambadar@email.com
            </div>
            <div className="text-orange-600">Password: password123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
