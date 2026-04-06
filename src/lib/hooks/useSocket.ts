import { useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket } from '../socket';
import type { Socket } from 'socket.io-client';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('bb_token');
    const role = localStorage.getItem('bb_role') as 'donor' | 'admin' | null;

    if (!token || !role) return;

    const s = connectSocket(token, role);
    setSocket(s);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    if (s.connected) setIsConnected(true);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, []);

  const reconnect = useCallback(() => {
    const token = localStorage.getItem('bb_token');
    const role = localStorage.getItem('bb_role') as 'donor' | 'admin' | null;
    if (token && role) {
      disconnectSocket();
      const s = connectSocket(token, role);
      setSocket(s);
    }
  }, []);

  return { socket, isConnected, reconnect };
}
