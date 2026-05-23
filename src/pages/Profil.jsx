import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import { useAuth } from '../hooks/useAuth'

export const Profil = () => {
  const { userProfile, updateBasicIdentity } = useApp()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userProfile)
  const [activeTab, setActiveTab] = useState('general')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    updateBasicIdentity(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(userProfile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your health information</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="card mb-8 flex items-center gap-8">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
          {userProfile?.fullName?.split(' ').map(n => n.charAt(0)).join('')}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-1">{userProfile?.fullName}</h2>
          <p className="text-gray-400 mb-3">{userProfile?.email}</p>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-orange-600">BMI:</span>
              <span className="text-gray-300">{userProfile?.bmi.toFixed(1)} ({userProfile?.bmiCategory})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-500">Points:</span>
              <span className="text-gray-300">{userProfile?.activityPoints} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-8 overflow-x-auto">
        {['general', 'health', 'lifestyle', 'goals', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold whitespace-nowrap transition ${
              activeTab === tab
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab === 'general' && 'General Info'}
            {tab === 'health' && 'Health'}
            {tab === 'lifestyle' && 'Lifestyle'}
            {tab === 'goals' && 'Goals'}
            {tab === 'settings' && 'Settings'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Informasi Dasar</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData?.fullName || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:outline-none transition ${
                      isEditing ? 'bg-gray-900 border-orange-500 focus:border-orange-600' : 'bg-gray-800 cursor-not-allowed'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ''}
                    onChange={handleChange}
                    disabled={true}
                    className="w-full px-4 py-2 border-2 border-gray-700 rounded-lg bg-gray-800 cursor-not-allowed text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Data Biometrik</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Usia</label>
                    <input
                      type="number"
                      name="age"
                      value={formData?.age || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:outline-none transition ${
                        isEditing ? 'bg-gray-900 border-orange-500 focus:border-orange-600' : 'bg-gray-800 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                    <select
                      name="gender"
                      value={formData?.gender || 'Male'}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:outline-none transition ${
                        isEditing ? 'bg-gray-900 border-orange-500 focus:border-orange-600' : 'bg-gray-800 cursor-not-allowed'
                      }`}
                    >
                      <option value="Male">Laki-laki</option>
                      <option value="Female">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Pengukuran Tubuh</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Berat Badan (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      step="0.1"
                      value={formData?.weight || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:outline-none transition ${
                        isEditing ? 'bg-gray-900 border-orange-500 focus:border-orange-600' : 'bg-gray-800 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tinggi Badan (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData?.height || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 border-2 border-gray-700 rounded-lg focus:outline-none transition ${
                        isEditing ? 'bg-gray-900 border-orange-500 focus:border-orange-600' : 'bg-gray-800 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Informasi Kesehatan</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Riwayat Medis:</span>
                  <span className="text-gray-200">{userProfile?.medicalHistory?.length > 0 ? userProfile.medicalHistory.join(', ') : 'Tidak ada'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Alergi:</span>
                  <span className="text-gray-200">{userProfile?.allergies?.length > 0 ? userProfile.allergies.join(', ') : 'Tidak ada'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tekanan Darah:</span>
                  <span className="text-gray-200">{userProfile?.bloodPressure?.systolic ? `${userProfile.bloodPressure.systolic}/${userProfile.bloodPressure.diastolic} mmHg` : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lifestyle Tab */}
        {activeTab === 'lifestyle' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Gaya Hidup</h3>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Pola Makan: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.dietaryPattern}</span>
                </div>
                <div>
                  <span className="text-gray-400">Frekuensi Makan: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.mealsPerDay} kali/hari</span>
                </div>
                <div>
                  <span className="text-gray-400">Target Air Minum: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.dailyWaterIntakeGoal} ml/hari</span>
                </div>
                <div>
                  <span className="text-gray-400">Jam Tidur Rata-rata: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.avgSleepHours} jam</span>
                </div>
                <div>
                  <span className="text-gray-400">Kebiasaan Merokok: </span>
                  <span className={`font-semibold ${userProfile?.smokingHabits === 'No' ? 'text-green-400' : 'text-red-400'}`}>
                    {userProfile?.smokingHabits === 'No' ? 'Tidak Merokok' : 'Merokok'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Tingkat Aktivitas: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.activityLevel}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Tujuan Kesehatan</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-400">Tujuan Utama: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.primaryGoal}</span>
                </div>
                <div>
                  <span className="text-gray-400">Target Berat Badan: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.targetWeight} kg</span>
                </div>
                <div>
                  <span className="text-gray-400">Selisih Target: </span>
                  <span className="font-semibold text-orange-400">{(userProfile?.weight - userProfile?.targetWeight).toFixed(1)} kg</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Komitmen</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-400">Olahraga Per Minggu: </span>
                  <span className="font-semibold text-gray-200">{userProfile?.commitmentDays} hari</span>
                </div>
                <div>
                  <span className="text-gray-400">Aktivitas Pilihan: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile?.preferredActivities?.map(activity => (
                      <span key={activity} className="px-3 py-1 bg-orange-600 rounded-full text-xs">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Akun</h3>
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">Email: {userProfile?.email}</p>
                <p className="text-gray-400 text-sm">Bergabung: {new Date(userProfile?.registeredAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="card border-l-4 border-red-500">
              <h3 className="text-lg font-semibold mb-4 text-red-500">Zona Bahaya</h3>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="fixed bottom-8 right-8 flex gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Simpan
          </button>
        </div>
      )}
    </div>
  )
}
