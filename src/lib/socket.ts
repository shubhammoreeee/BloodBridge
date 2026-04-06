import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const SOCKET_EVENTS = {
  NEW_EMERGENCY_REQUEST:    'new_emergency_request',
  REQUEST_STATUS_CHANGED:   'request_status_changed',
  DONOR_ASSIGNED:           'donor_assigned',
  DONOR_LOCATION_UPDATE:    'donor_location_update',
  NOTIFICATION_RECEIVED:    'notification_received',
  INVENTORY_UPDATED:        'inventory_updated',
  POINTS_AWARDED:           'points_awarded',
  EMERGENCY_CANCELLED:      'emergency_cancelled',
  DONOR_ONLINE_STATUS:      'donor_online_status',
} as const

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
  })

  socket.on('connect', () => console.log('🔌 Socket connected:', socket?.id))
  socket.on('disconnect', (reason) => console.log('🔌 Socket disconnected:', reason))
  socket.on('connect_error', (err) => console.error('Socket error:', err.message))

  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

export function getSocket(): Socket | null { 
    return socket 
}

export function joinRequestRoom(requestId: string) {
  socket?.emit('join_request_room', { requestId })
}

export function leaveRequestRoom(requestId: string) {
  socket?.emit('leave_request_room', { requestId })
}

export function sendDonorLocation(requestId: string, coordinates: [number, number]) {
  socket?.emit('donor_location_update', { requestId, coordinates })
}
