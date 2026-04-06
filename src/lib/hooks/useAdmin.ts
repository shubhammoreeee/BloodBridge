import api from '../api'

export function useAdmin() {
  const getProfile = async () => {
    const res = await api.get('/admin/profile')
    return res.data.data
  }
  
  const updateProfile = async (data: any) => {
    const res = await api.put('/admin/profile', data)
    return res.data.data
  }
  
  const getInventory = async () => {
    const res = await api.get('/admin/inventory')
    return res.data.data
  }
  
  const updateInventory = async (updates: Record<string, number>) => {
    const res = await api.put('/admin/inventory', updates)
    return res.data.data
  }
  
  const getNearbyDonors = async (radiusKm = 10, lat?: number, lng?: number) => {
    let url = `/admin/donors/nearby?radius=${radiusKm}`
    if (lat !== undefined && lng !== undefined) {
      url += `&lat=${lat}&lng=${lng}`
    }
    const res = await api.get(url)
    return res.data.data
  }
  
  return { getProfile, updateProfile, getInventory, updateInventory, getNearbyDonors }
}
