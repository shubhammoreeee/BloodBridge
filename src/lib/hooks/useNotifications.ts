import api from '../api'

export function useNotifications() {
  const getNotifications = async (page = 1) => {
    const res = await api.get(`/notifications?page=${page}&limit=20`)
    return res.data.data
  }
  
  const getUnreadCount = async () => {
    const res = await api.get('/notifications/unread-count')
    return res.data.data.count
  }
  
  const markRead = async (id: string) => {
    const res = await api.put(`/notifications/${id}/read`)
    return res.data.data
  }
  
  const markAllRead = async () => {
    const res = await api.put('/notifications/read-all')
    return res.data.data
  }
  
  return { getNotifications, getUnreadCount, markRead, markAllRead }
}
