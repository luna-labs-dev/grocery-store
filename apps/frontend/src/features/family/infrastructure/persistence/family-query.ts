import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { errorMapper } from '@/domain';
import {
  useCreateFamily,
  useGetFamily,
  useJoinFamily,
  useRemoveFamilyMember,
} from '@/infrastructure/api/family';

export const useGetFamilyQuery = () => {
  const [isFamilyMember, setIsFamilyMember] = useState<boolean>(true);

  const query = useGetFamily({
    query: {
      queryKey: ['family'],
      staleTime: 1000 * 5,
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });

  const { error } = query;

  useEffect(() => {
    if (error?.code === 'USER_NOT_A_FAMILY_MEMBER_BARRIER_EXCEPTION') {
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

  const mutation = useCreateFamily({
    mutation: {
      onError: (error, params) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },
      onSuccess: (_, params) => {
        toast.success('Família criada', {
          description: `a família "${params.data.name}" foi criada com sucesso`,
        });
      },
      onSettled: (data) => {
        console.log(data);
        queryClient.invalidateQueries({
          queryKey: ['family'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useJoinFamilyMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useJoinFamily({
    mutation: {
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
    },
  });

  return { ...mutation };
};

export const useRemoveFamilyMemberMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useRemoveFamilyMember({
    mutation: {
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
    },
  });

  return { ...mutation };
};
