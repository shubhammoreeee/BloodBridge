import api from '../api'
import { useAppStore } from '../../store/useAppStore'

export function useRequests() {
  const getRequests = async (params?: { matched?: boolean; status?: string | string[]; page?: number }) => {
    const query = new URLSearchParams(params as any).toString()
    const res = await api.get(`/requests?${query}`)
    return res.data.data
  }
  
  const getRequest = async (id: string) => {
    const res = await api.get(`/requests/${id}`)
    return res.data.data
  }
  
  const createRequest = async (data: any) => {
    const res = await api.post('/requests', data)
    return res.data.data
  }
  
  const updateStatus = async (id: string, status: string) => {
    const res = await api.put(`/requests/${id}/status`, { status })
    return res.data.data
  }
  
  const assignDonor = async (id: string, donorId: string) => {
    const res = await api.put(`/requests/${id}/assign`, { donorId })
    return res.data.data
  }
  
  const cancelRequest = async (id: string) => {
    const res = await api.delete(`/requests/${id}`)
    return res.data.data
  }
  
  const acceptRequest = async (id: string) => {
    // On the backend, assigning yourself as a donor is the 'accept' action
    const { currentUser } = useAppStore.getState();
    if (!currentUser?._id) throw new Error("User not authenticated");
    
    const res = await api.put(`/requests/${id}/assign`, { donorId: currentUser._id })
    return res.data.data
  }
  
  return { getRequests, getRequest, createRequest, updateStatus, assignDonor, cancelRequest, acceptRequest }
}
