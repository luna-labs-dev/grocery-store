import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { errorMapper } from '@/domain';
import type {
  GetShoppingEventByIdParams,
  ProductCartMutation,
} from '@/features/shopping-event/domain';
import {
  useAddProductToCart,
  useRemoveProductFromCart,
  useUpdateProductInCart,
} from '@/infrastructure/api/cart';
import {
  useEndShoppingEvent,
  useGetShoppingEventById,
  useGetShoppingEventList,
  useStartShoppingEvent,
} from '@/infrastructure/api/shopping-event';
import type { GetShoppingEventListParams } from '@/infrastructure/api/types';

export const useGetShoppingEventListQuery = (
  params: GetShoppingEventListParams,
) => {
  console.log({ params });
  const query = useGetShoppingEventList(params, {
    query: {
      queryKey: ['get-shopping-event-list', params],
      staleTime: 1000 * 60 * 1,
      placeholderData: (previousData) => previousData,
    },
  });

  return { ...query };
};

export const useGetShoppingEventByIdQuery = ({
  shoppingEventId,
}: GetShoppingEventByIdParams) => {
  const query = useGetShoppingEventById(shoppingEventId, {
    query: {
      queryKey: ['get-shopping-event-by-id', shoppingEventId],
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 20,
    },
  });

  return { ...query };
};

export const useStartShoppingEventMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useStartShoppingEvent({
    mutation: {
      onError: (error, params) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },
      onSuccess: (success) => {
        toast.success('Evento de compra iniciado', {
          description: `O evento de compra foi iniciado às ${format(success.createdAt, 'HH:mm:ss')}`,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-shopping-event-list'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useEndShoppingEventMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useEndShoppingEvent({
    mutation: {
      onError: (error, params) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },
      onSuccess: (success) => {
        toast.success('Evento finalizado', {
          description: `O evento de compra foi finalizado às ${format(
            success.createdAt,
            'HH:mm:ss',
          )}`,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-shopping-event-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['get-shopping-event-by-id'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useAddProductCartMutation = ({
  shoppingEventId,
}: ProductCartMutation) => {
  const queryClient = useQueryClient();

  const mutation = useAddProductToCart({
    mutation: {
      onError: (error) => {
        const { title } = errorMapper(error.code ?? '')();
        toast.error(title);
      },
      onSuccess: (_, params) => {
        toast.success('Produto adicionado ao carrinho', {
          description: `O produto ${params.data.name} foi adicionado ao carrinho`,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-shopping-event-by-id', shoppingEventId],
        });
      },
    },
  });

  return { ...mutation };
};

export const useUpdateProductInCartMutation = ({
  shoppingEventId,
}: ProductCartMutation) => {
  const queryClient = useQueryClient();

  const mutation = useUpdateProductInCart({
    mutation: {
      onError: (error) => {
        const { title } = errorMapper(error.code ?? '')();
        toast.error(title);
      },
      onSuccess: (_, params) => {
        toast.success('Produto atualizado', {
          description: `O produto ${params.data.name} foi atualizado no carrinho`,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['get-shopping-event-by-id', shoppingEventId],
        });
      },
    },
  });

  return { ...mutation };
};

export const useRemoveProductFromCartMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useRemoveProductFromCart({
    mutation: {
      onError: (error) => {
        const { title } = errorMapper(error.code ?? '')();
        toast.error(title);
      },
      onSuccess: () => {
        toast.success('Produto removido', {
          description: 'O produto foi removido no carrinho',
        });
      },
      onSettled: () => {
        alert('settled');
        queryClient.invalidateQueries({
          queryKey: ['get-shopping-event-by-id', 'get-shopping-event-list'],
        });
      },
    },
  });

  return { ...mutation };
};
