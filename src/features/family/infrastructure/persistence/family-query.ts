import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  httpCreateFamily,
  httpGetFamily,
  httpJoinFamily,
  httpRemoveFamilyMember,
} from '../http';
import { errorMapper, type HttpError } from '@/domain';
import type {
  CreateFamilyParams,
  Family,
  JoinFamilyParams,
  RemoveFamilyMemberParams,
} from '@/features/family';

export const useGetFamilyQuery = () => {
  const [isFamilyMember, setIsFamilyMember] = useState<boolean>(true);

  const query = useQuery<Family, AxiosError | HttpError>({
    queryKey: ['family'],
    queryFn: () => httpGetFamily(),
    staleTime: 1000 * 5,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const { error } = query;

  useEffect(() => {
    if (error?.code === 'USER_NOT_A_FAMILY_MEMBER_ERROR') {
      setIsFamilyMember(false);
    }
    if (!error) {
      setIsFamilyMember(true);
    }
  }, [error]);

  return { ...query, isFamilyMember };
};

export const useCreateFamilyMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Family,
    AxiosError | HttpError,
    CreateFamilyParams
  >({
    mutationFn: (params: CreateFamilyParams) => httpCreateFamily(params),
    onError: (error, params) => {
      const { title, description } = errorMapper(error.code ?? '')(params);

      toast.error(title, {
        description,
      });
    },
    onSuccess: (_, params) => {
      toast.success('Família criada', {
        description: `a família "${params.name}" foi criada com sucesso`,
      });
    },
    onSettled: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: ['family'],
      });
    },
  });

  return { ...mutation };
};

export const useJoinFamilyMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, AxiosError | HttpError, JoinFamilyParams>({
    mutationFn: (params: JoinFamilyParams) => httpJoinFamily(params),

    onError: (error, params) => {
      const { title, description } = errorMapper(error.code ?? '')(params);

      toast.error(title, {
        description,
      });
    },

    onSuccess: () => {
      toast.success('Entrou na família', {
        description: 'Agora você faz parte da família',
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['family'],
      });
    },
  });

  return { ...mutation };
};

export const useRemoveFamilyMemberMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    AxiosError | HttpError,
    RemoveFamilyMemberParams
  >({
    mutationFn: (params: RemoveFamilyMemberParams) =>
      httpRemoveFamilyMember(params),

    onError: (error, params) => {
      const { title, description } = errorMapper(error.code ?? '')(params);

      toast.error(title, {
        description,
      });
    },

    onSuccess: () => {
      toast.success('Membro removido da família');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['family'],
      });
    },
  });

  return { ...mutation };
};
