import type { Socket } from 'socket.io';
import { UnauthorizedException } from '@/domain/core/exceptions/generic-exceptions';
import { auth } from '@/main/auth/auth';

export const socketAuthMiddleware = async (socket: Socket) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      throw new UnauthorizedException();
    }

    const session = await auth.api.getSession({
      headers: {
        cookie,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    // Attach user to socket for downstream use
    // biome-ignore lint/suspicious/noExplicitAny: Socket object extension
    (socket as any).user = session.user;
    return true;
  } catch (_error: unknown) {
    return false;
  }
};
