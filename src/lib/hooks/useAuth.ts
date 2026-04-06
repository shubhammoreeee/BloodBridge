import api from '../api'
import { connectSocket, disconnectSocket } from '../socket'
import { useAppStore } from '../../store/useAppStore'

export function useAuth() {
  const store = useAppStore()

  const registerDonor = async (data: any) => {
    const res = await api.post('/auth/donor/register', data)
    const { token, user } = res.data.data
    localStorage.setItem('bb_token', token)
    localStorage.setItem('bb_user', JSON.stringify({ ...user, role: 'donor' }))
    store.setAuth(token, user, 'donor')
    connectSocket(token)
    return user
  }

  const loginDonor = async (phone: string, password: string) => {
    const res = await api.post('/auth/donor/login', { phone, password })
    const { token, user } = res.data.data
    localStorage.setItem('bb_token', token)
    localStorage.setItem('bb_user', JSON.stringify({ ...user, role: 'donor' }))
    store.setAuth(token, user, 'donor')
    connectSocket(token)
    return user
  }

  const registerAdmin = async (data: any) => {
    const res = await api.post('/auth/admin/register', data)
    const { token, user } = res.data.data
    localStorage.setItem('bb_token', token)
    localStorage.setItem('bb_user', JSON.stringify({ ...user, role: 'admin' }))
    store.setAuth(token, user, 'admin')
    connectSocket(token)
    return user
  }

  const loginAdmin = async (employeeId: string, password: string) => {
    const res = await api.post('/auth/admin/login', { employeeId, password })
    const { token, user } = res.data.data
    localStorage.setItem('bb_token', token)
    localStorage.setItem('bb_user', JSON.stringify({ ...user, role: 'admin' }))
    store.setAuth(token, user, 'admin')
    connectSocket(token)
    return user
  }

  const restoreSession = async () => {
    const token = localStorage.getItem('bb_token')
    if (!token) return null
    try {
      const res = await api.get('/auth/me')
      const { user, role } = res.data.data
      store.setAuth(token, user, role)
      connectSocket(token)
      return user
    } catch {
      localStorage.removeItem('bb_token')
      localStorage.removeItem('bb_user')
      store.clearAuth()
      return null
    }
  }

  const logout = () => {
    localStorage.removeItem('bb_token')
    localStorage.removeItem('bb_user')
    store.clearAuth()
    disconnectSocket()
    window.location.href = '/login'
  }

  return { registerDonor, loginDonor, registerAdmin, loginAdmin, restoreSession, logout }
}
