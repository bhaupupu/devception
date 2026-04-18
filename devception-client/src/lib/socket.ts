import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@/types/socket';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function getSocket(token?: string): AppSocket {
  if (!socket || !socket.connected) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000', {
      auth: { token },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function connectSocket(token: string): AppSocket {
  const s = getSocket(token);
  if (!s.connected) {
    s.auth = { token };
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
