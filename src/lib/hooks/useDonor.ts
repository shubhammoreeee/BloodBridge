import api from '../api'

export function useDonor() {
  const getProfile = async () => {
    const res = await api.get('/donor/profile')
    return res.data.data
  }
  
  const updateProfile = async (data: any) => {
    const res = await api.put('/donor/profile', data)
    return res.data.data
  }
  
  const getStats = async () => {
    const res = await api.get('/donor/stats')
    return res.data.data
  }
  
  const getHistory = async (page = 1) => {
    const res = await api.get(`/donor/history?page=${page}&limit=20`)
    return res.data.data
  }
  
  const toggleEligibility = async () => {
    const res = await api.put('/donor/eligibility')
    return res.data.data
  }

  const getLeaderboard = async () => {
    const res = await api.get('/donor/leaderboard')
    return res.data.data
  }

  const deactivateAccount = async () => {
    const res = await api.put('/donor/deactivate')
    return res.data
  }
  
  return { getProfile, updateProfile, getStats, getHistory, toggleEligibility, getLeaderboard, deactivateAccount }
}
