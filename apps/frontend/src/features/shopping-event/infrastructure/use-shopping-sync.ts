import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { toast } from 'sonner';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketProductDto,
} from './socket-types';
import { env } from '@/config/env';

declare global {
  var _globalSocket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  var _activeEventId: string | null;
  var _disconnectTimeout: ReturnType<typeof setTimeout> | null;
}

export const useShoppingSync = (shoppingEventId?: string) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!shoppingEventId) return;

    if (globalThis._disconnectTimeout) {
      clearTimeout(globalThis._disconnectTimeout);
      globalThis._disconnectTimeout = null;
    }

    if (
      !globalThis._globalSocket ||
      globalThis._activeEventId !== shoppingEventId
    ) {
      if (globalThis._globalSocket) {
        globalThis._globalSocket.disconnect();
      }
      globalThis._globalSocket = io(env.backend.baseUrl, {
        withCredentials: true,
        transports: ['polling', 'websocket'], // Add polling back to prevent aggressive proxy timeouts
      });
      globalThis._activeEventId = shoppingEventId;
    }

    const socket = globalThis._globalSocket;
    socketRef.current = socket;

    const onConnect = () => {
      console.log('Socket connected:', socket.id);
      socket.emit(
        'join-room',
        { shoppingEventId },
        (response: { status: string; message?: string }) => {
          if (response?.status === 'error') {
            console.error('Error joining room:', response.message);
          }
        },
      );
    };

    const onProductAdded = ({ product }: { product: SocketProductDto }) => {
      toast.info('Produto adicionado', {
        description: `Um novo produto (${product.name}) foi adicionado por outro usuário.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id'],
        refetchType: 'all',
      });
    };

    const onProductUpdated = ({ product }: { product: SocketProductDto }) => {
      toast.info('Produto atualizado', {
        description: `O produto ${product.name} foi atualizado por outro usuário.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id'],
        refetchType: 'all',
      });
    };

    const onProductDeleted = () => {
      toast.info('Produto removido', {
        description: 'Um produto foi removido do carrinho por outro usuário.',
      });
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id'],
        refetchType: 'all',
      });
    };

    const onConnectError = (_error: Error) => {
      console.error('Socket connection error:', _error);
    };

    socket.on('connect', onConnect);
    socket.on('product_added', onProductAdded);
    socket.on('product_updated', onProductUpdated);
    socket.on('product_deleted', onProductDeleted);
    socket.on('connect_error', onConnectError);

    // If already connected, join room manually (handles remounting after suspense)
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('product_added', onProductAdded);
      socket.off('product_updated', onProductUpdated);
      socket.off('product_deleted', onProductDeleted);
      socket.off('connect_error', onConnectError);

      socketRef.current = null;

      globalThis._disconnectTimeout = setTimeout(() => {
        if (globalThis._globalSocket) {
          globalThis._globalSocket.disconnect();
          globalThis._globalSocket = null;
          globalThis._activeEventId = null;
        }
      }, 5000);
    };
  }, [shoppingEventId, queryClient]);

  return {
    socket: socketRef.current,
  };
};

export const emitProductAdded = (
  shoppingEventId: string,
  product: SocketProductDto,
) => {
  if (globalThis._globalSocket?.connected) {
    globalThis._globalSocket.emit('product_added', {
      shoppingEventId,
      product,
    });
  }
};

export const emitProductUpdated = (
  shoppingEventId: string,
  product: SocketProductDto,
) => {
  if (globalThis._globalSocket?.connected) {
    globalThis._globalSocket.emit('product_updated', {
      shoppingEventId,
      product,
    });
  }
};

export const emitProductDeleted = (
  shoppingEventId: string,
  productId: string,
) => {
  if (globalThis._globalSocket?.connected) {
    globalThis._globalSocket.emit('product_deleted', {
      shoppingEventId,
      productId,
    });
  }
};
