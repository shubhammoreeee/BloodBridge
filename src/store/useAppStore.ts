import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'donor' | 'admin' | null
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

interface Toast {
  id: string
  type: 'success' | 'alert' | 'info' | 'reward'
  title: string
  message?: string
}

interface AppState {
  role: Role
  token: string | null
  currentUser: any | null
  
  notifications: any[]
  unreadCount: number
  activeRequests: any[]
  inventory: Record<string, any>
  onlineDonors: Set<string>
  
  isDemoRunning: boolean
  toasts: Toast[]
  isInventoryManagerOpen: boolean
  isSessionLoading: boolean

  setAuth: (token: string, user: any, role: Role) => void
  clearAuth: () => void
  addNotification: (n: any) => void
  setUnreadCount: (n: number | ((prev: number) => number)) => void
  upsertRequest: (request: any) => void
  removeRequest: (id: string) => void
  setInventory: (data: Record<string, any>) => void
  setDonorOnline: (donorId: string, isOnline: boolean) => void
  addToast: (messageOrToast: string | Toast, type?: 'success' | 'alert' | 'info' | 'reward') => void
  removeToast: (id: string) => void
  setInventoryManagerOpen: (isOpen: boolean) => void
  setSessionLoading: (isLoading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      role: null,
      token: null,
      currentUser: null,
      
      notifications: [],
      unreadCount: 0,
      activeRequests: [],
      inventory: {},
      onlineDonors: new Set(),
      
      isDemoRunning: false,
      toasts: [],
      isInventoryManagerOpen: false,
      isSessionLoading: false,

      setAuth: (token, user, role) => set({ token, currentUser: user, role }),
      
      clearAuth: () => set({ token: null, currentUser: null, role: null }),
      
      addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
      
      setUnreadCount: (n) => set((state) => ({ 
        unreadCount: typeof n === 'function' ? n(state.unreadCount) : n 
      })),
      
      upsertRequest: (request) => set((state) => {
        const exists = state.activeRequests.find(r => r._id === request._id)
        if (exists) {
          return { activeRequests: state.activeRequests.map(r => r._id === request._id ? request : r) }
        }
        return { activeRequests: [request, ...state.activeRequests] }
      }),
      
      removeRequest: (id) => set((state) => ({ 
        activeRequests: state.activeRequests.filter(r => r._id !== id) 
      })),
      
      setInventory: (inventory) => set({ inventory }),
      
      setDonorOnline: (donorId, isOnline) => set((state) => {
        const newSet = new Set(state.onlineDonors)
        if (isOnline) newSet.add(donorId)
        else newSet.delete(donorId)
        return { onlineDonors: newSet }
      }),
      
      addToast: (messageOrToast, type = 'info') => set((state) => {
        let newToast: Toast
        if (typeof messageOrToast === 'string') {
          newToast = { id: Date.now().toString(), type, title: messageOrToast }
        } else {
          newToast = messageOrToast
        }
        return { toasts: [...state.toasts, newToast] }
      }),
      
      removeToast: (id) => set((state) => ({ 
        toasts: state.toasts.filter(t => t.id !== id) 
      })),

      setInventoryManagerOpen: (isOpen) => set({ isInventoryManagerOpen: isOpen }),
      setSessionLoading: (isLoading) => set({ isSessionLoading: isLoading }),
    }),
    {
      name: 'bb-auth-v1',
      partialize: (state) => ({ 
        token: state.token, 
        role: state.role, 
        currentUser: state.currentUser,
        activeRequests: state.activeRequests
      }),
    }
  )
)
