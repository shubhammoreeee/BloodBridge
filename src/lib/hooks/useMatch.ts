import api from '../api'

export function useMatch() {
  const findDonors = async (requestId: string) => {
    const res = await api.get(`/match/${requestId}`)
    return res.data.data
  }
  
  return { findDonors }
}
