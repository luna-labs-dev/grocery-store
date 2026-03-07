import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { env } from '@/config/env';

export const useShoppingSync = (shoppingEventId?: string) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!shoppingEventId) return;

    // Initialize socket connection
    const socket = io(env.backend.baseUrl, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join-room', { shoppingEventId }, (response: any) => {
        if (response.status === 'error') {
          console.error('Error joining room:', response.message);
        }
      });
    });

    socket.on('product_added', ({ product }) => {
      toast.info('Produto adicionado', {
        description: `Um novo produto (${product.name}) foi adicionado por outro usuário.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id', shoppingEventId],
      });
    });

    socket.on('product_updated', ({ product }) => {
      toast.info('Produto atualizado', {
        description: `O produto ${product.name} foi atualizado por outro usuário.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id', shoppingEventId],
      });
    });

    socket.on('product_deleted', ({ productId: _productId }) => {
      toast.info('Produto removido', {
        description: 'Um produto foi removido do carrinho por outro usuário.',
      });
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id', shoppingEventId],
      });
    });

    socket.on('connect_error', (_error) => {
      console.error('Socket connection error:', _error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [shoppingEventId, queryClient]);

  return {
    socket: socketRef.current,
  };
};
