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
    // biome-ignore lint/suspicious/noExplicitAny: Socket object extension
    (socket as any).user = session.user;
    return true;
  } catch (_error: unknown) {
    return false;
  }
};
