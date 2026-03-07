import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { Socket } from 'socket.io';
import { db } from '@/infrastructure/repositories/drizzle/setup/connection';
import {
  groupMemberTable,
  shopping_eventTable,
} from '@/infrastructure/repositories/drizzle/setup/schema';

export const onConnection = (socket: Socket, app: FastifyInstance) => {
  const user = (socket as any).user;
  app.log.info(`Socket connected: ${socket.id} (User: ${user?.id})`);

  socket.on('join-room', async ({ shoppingEventId }, callback) => {
    if (!shoppingEventId) {
      if (callback)
        callback({ status: 'error', message: 'shoppingEventId is required' });
      return;
    }

    try {
      // 1. Fetch the event to find the groupId
      const [event] = await db
        .select({ groupId: shopping_eventTable.groupId })
        .from(shopping_eventTable)
        .where(eq(shopping_eventTable.id, shoppingEventId));

      if (!event || !event.groupId) {
        if (callback)
          callback({
            status: 'error',
            message: 'Unauthorized: Event or Group not found',
          });
        return;
      }

      // 2. Check membership
      const [membership] = await db
        .select()
        .from(groupMemberTable)
        .where(
          and(
            eq(groupMemberTable.groupId, event.groupId),
            eq(groupMemberTable.userId, user.id),
          ),
        );

      if (!membership) {
        if (callback)
          callback({
            status: 'error',
            message: 'Unauthorized: You are not a member of this group',
          });
        return;
      }

      socket.join(shoppingEventId);
      app.log.info(`Socket ${socket.id} joined room ${shoppingEventId}`);

      if (callback) callback({ status: 'ok' });
    } catch (error) {
      app.log.error(error, 'Error joining room');
      if (callback)
        callback({ status: 'error', message: 'Internal Server Error' });
    }
  });

  socket.on('product_added', ({ shoppingEventId, product }) => {
    socket.to(shoppingEventId).emit('product_added', { product });
  });

  socket.on('product_updated', ({ shoppingEventId, product }) => {
    socket.to(shoppingEventId).emit('product_updated', { product });
  });

  socket.on('product_deleted', ({ shoppingEventId, productId }) => {
    socket.to(shoppingEventId).emit('product_deleted', { productId });
  });

  socket.on('disconnect', () => {
    app.log.info(`Socket disconnected: ${socket.id}`);
  });
};
