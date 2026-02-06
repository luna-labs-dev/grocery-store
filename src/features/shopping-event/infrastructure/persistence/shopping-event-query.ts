import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { errorMapper, type HttpError } from '@/domain';
import type {
  AddProductToCartParams,
  AddProductToCartSuccessResult,
  EndShoppingEventParams,
  EndShoppingEventResult,
  FetchShoppingEventListParams,
  GetShoppingEventByIdParams,
  RemoveProductFromCartParams,
  StartShoppingEventParams,
  StartShoppingEventResult,
  UpdateProductInCartParams,
} from '@/features/shopping-event/domain';
import {
  httpAddProductToCart,
  httpEndShoppingEvent,
  httpGetShoppingEventById,
  httpGetShoppingEventList,
  httpRemoveProductFromCart,
  httpStartShoppingEvent,
  httpUpdateProductInCart,
} from '@/features/shopping-event/infrastructure';

export const useGetShoppingEventListQuery = (
  params: FetchShoppingEventListParams,
) => {
  const query = useQuery({
    queryKey: ['get-shopping-event-list', params],
    queryFn: ({ queryKey }) =>
      httpGetShoppingEventList(queryKey[1] as FetchShoppingEventListParams),
    staleTime: 1000 * 60 * 1,
    placeholderData: (previousData) => previousData,
  });

  return { ...query };
};

export const useGetShoppingEventByIdQuery = (
  params: GetShoppingEventByIdParams,
) => {
  const query = useQuery({
    queryKey: ['get-shopping-event-by-id', params],
    queryFn: ({ queryKey }) =>
      httpGetShoppingEventById(queryKey[1] as GetShoppingEventByIdParams),
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 20,
    enabled: !!params.shoppingEventId,
  });

  return { ...query };
};

export const useStartShoppingEventMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    StartShoppingEventResult,
    HttpError,
    StartShoppingEventParams
  >({
    mutationFn: httpStartShoppingEvent,
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
  });

  return { ...mutation };
};

export const useEndShoppingEventMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    EndShoppingEventResult,
    HttpError,
    EndShoppingEventParams
  >({
    mutationFn: httpEndShoppingEvent,
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
  });

  return { ...mutation };
};

export const useAddProductCartMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AddProductToCartSuccessResult,
    HttpError,
    AddProductToCartParams
  >({
    mutationFn: httpAddProductToCart,
    onError: (error) => {
      const { title } = errorMapper(error.code ?? '')();
      toast.error(title);
    },
    onSuccess: (_, params) => {
      toast.success('Produto adicionado ao carrinho', {
        description: `O produto ${params.params.name} foi adicionado ao carrinho`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id'],
      });
    },
  });

  return { ...mutation };
};

export const useUpdateProductInCartMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, HttpError, UpdateProductInCartParams>({
    mutationFn: httpUpdateProductInCart,
    onError: (error) => {
      const { title } = errorMapper(error.code ?? '')();
      toast.error(title);
    },
    onSuccess: (_, params) => {
      toast.success('Produto atualizado', {
        description: `O produto ${params.params.name} foi atualizado no carrinho`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id'],
      });
    },
  });

  return { ...mutation };
};

export const useRemoveProductFromCartMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, HttpError, RemoveProductFromCartParams>({
    mutationFn: httpRemoveProductFromCart,
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
      queryClient.invalidateQueries({
        queryKey: ['get-shopping-event-by-id'],
      });
    },
  });

  return { ...mutation };
};
