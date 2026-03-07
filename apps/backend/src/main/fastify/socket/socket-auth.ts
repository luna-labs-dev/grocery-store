import type { Socket } from 'socket.io';
import { auth } from '@/main/auth/auth';

export const socketAuthMiddleware = async (socket: Socket) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      throw new Error('Authentication required: No cookie found');
    }

    const session = await auth.api.getSession({
      headers: {
        cookie,
      },
    });

    if (!session) {
      throw new Error('Authentication failed: Invalid session');
    }

    // Attach user to socket for downstream use
    (socket as any).user = session.user;
    return true;
  } catch (_error: any) {
    return false;
  }
};
