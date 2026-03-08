import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { errorMapper } from '@/domain';
import {
  useCreateGroup,
  useDeleteGroup,
  useGetGroups,
  useGetInviteInfo,
  useJoinGroup,
  useLeaveGroup,
  useRegenerateInviteCode,
  useRemoveMember as useRemoveGroupMember,
  useUpdateGroup,
  useUpdateMemberRole,
} from '@/infrastructure/api/group';
import { router } from '@/providers';

export const useListGroupsQuery = () => {
  const [isGroupMember, setIsGroupMember] = useState<boolean>(true);

  const query = useGetGroups({
    query: {
      queryKey: ['groups'],
      staleTime: 1000 * 60, // Groups don't change that often
      retry: 1,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  });

  const { error } = query;

  useEffect(() => {
    if (error?.code === 'USER_NOT_MEMBER_OF_ANY_GROUP_BARRIER_EXCEPTION') {
      setIsGroupMember(false);
    }
    if (!error) {
      setIsGroupMember(true);
    }
  }, [error]);

  return { ...query, isGroupMember };
};

import { groupStorage } from '../../../../infrastructure/storage/group-storage';

export const useGetActiveGroupQuery = () => {
  const { data: groups, ...rest } = useListGroupsQuery();
  const [storedGroupId, setStoredGroupId] = useState(
    groupStorage.getActiveGroupId(),
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredGroupId(groupStorage.getActiveGroupId());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const activeGroup =
    groups?.find((g: any) => g.id === storedGroupId) ??
    (groups && groups.length > 0 ? groups[0] : undefined);

  useEffect(() => {
    if (activeGroup && activeGroup.id !== storedGroupId) {
      groupStorage.setActiveGroupId(activeGroup.id);
      setStoredGroupId(activeGroup.id);
    }
  }, [activeGroup, storedGroupId]);

  return { ...rest, data: activeGroup };
};

// Existing alias for backward compatibility
export const useGetGroupQuery = useGetActiveGroupQuery;

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useCreateGroup({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },
      onSuccess: (_: any, params: any) => {
        toast.success('Grupo criado', {
          description: `o grupo "${params.data.name}" foi criado com sucesso`,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useJoinGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useJoinGroup({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Entrou no grupo', {
          description: 'Agora você faz parte do grupo',
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useRemoveGroupMemberMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useRemoveGroupMember({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Membro removido do grupo');
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useLeaveGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useLeaveGroup({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Você saiu do grupo');
        router.navigate({ to: '/dashboard', replace: true });
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useUpdateMemberRole({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Cargo atualizado com sucesso');
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useGetInviteInfoQuery = (groupId?: string) => {
  return useGetInviteInfo(groupId ?? '', {
    query: {
      queryKey: ['group-invite', groupId],
      enabled: !!groupId,
      staleTime: 1000 * 60 * 5, // Invites are stable
    },
  });
};

export const useUpdateGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useUpdateGroup({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Grupo atualizado com sucesso');
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};

export const useRegenerateInviteCodeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useRegenerateInviteCode({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Convite regenerado com sucesso');
      },

      onSettled: (_: any, params: any) => {
        queryClient.invalidateQueries({
          queryKey: ['group-invite', params.groupId],
        });
      },
    },
  });

  return { ...mutation };
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useDeleteGroup({
    mutation: {
      onError: (error: any, params: any) => {
        const { title, description } = errorMapper(error.code ?? '')(params);

        toast.error(title, {
          description,
        });
      },

      onSuccess: () => {
        toast.success('Grupo deletado com sucesso');
        router.navigate({ to: '/dashboard', replace: true });
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['groups'],
        });
      },
    },
  });

  return { ...mutation };
};
