import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import { GroupInviteDrawer } from './group-invite-drawer';
import { RemoveGroupMemberAlertDialog } from './remove-group-member-alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Loading,
} from '@/components';
import { Page } from '@/components/layout/page-layout';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { getInitials } from '@/domain';
import {
  useGetInviteInfoQuery,
  useLeaveGroupMutation,
  useListGroupsQuery,
  useUpdateMemberRoleMutation,
} from '@/features/group/infrastructure';
import { useBreadCrumbs } from '@/hooks';
import { useHaptics } from '@/hooks/use-haptics';
import { useSession } from '@/infrastructure/auth/auth-client';
import { cn } from '@/lib/utils';
import { router } from '@/providers';

interface Props {
  groupId: string;
}

export const GroupDetails = ({ groupId }: Props) => {
  const haptics = useHaptics();
  const { data: session } = useSession();
  const { data: groups, isLoading: isLoadingList } = useListGroupsQuery();

  const activeGroup = groups?.find((g: any) => g.id === groupId);

  const { data: inviteInfo, isLoading: isLoadingInvite } =
    useGetInviteInfoQuery(activeGroup?.id);
  const { mutate: updateRole } = useUpdateMemberRoleMutation();
  const { mutate: leaveGroup } = useLeaveGroupMutation();
  const { addBreadcrumbs } = useBreadCrumbs();

  useEffect(() => {
    if (activeGroup) {
      addBreadcrumbs(
        [
          {
            label: 'Gerenciar Grupos',
            to: '/manage-groups',
          },
          {
            label: 'Detalhes',
            to: `/manage-groups/${groupId}` as any,
          },
        ],
        { title: '' },
      );
    }
  }, [addBreadcrumbs, groupId, activeGroup]);

  if (isLoadingList) {
    return (
      <div className="w-full h-64 flex items-center justify-center gap-1">
        <Loading text=" Carregando dados do grupo" />
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Page>
        <Page.Content>
          <div className="w-full pt-4 p-4 text-center">
            <h2 className="text-xl font-bold">Nenhum grupo encontrado</h2>
            <p className="text-muted-foreground mt-2">
              Você ainda não faz parte de nenhum grupo de colaboração.
            </p>
          </div>
        </Page.Content>
      </Page>
    );
  }

  if (!activeGroup) return null;

  const currentUserId = session?.user?.id;
  const currentUser = activeGroup.members?.find(
    (m: any) => m.userId === currentUserId,
  );
  const isOwner = currentUser?.role === 'owner';
  const canManage = isOwner || currentUser?.role === 'moderator';

  return (
    <Page className="w-full bg-background transition-all">
      <Page.Header className="mx-4 rounded-xl p-4 border bg-card">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 shrink-0"
              onClick={() => {
                haptics.light();
                router.navigate({ to: '/manage-groups' });
              }}
            >
              <Icon icon="ph:arrow-left-bold" className="size-5" />
            </Button>
            <div className="flex flex-col min-w-0">
              <h1 className="text-base font-bold leading-none truncate">
                {activeGroup.name}
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tight mt-1 truncate">
                {activeGroup.members?.length} Membros • Criado em{' '}
                {format(new Date(activeGroup.createdAt), 'dd/MM/yy', {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {canManage && (
              <GroupInviteDrawer
                inviteInfo={inviteInfo}
                isLoading={isLoadingInvite}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={() => {
                haptics.light();
                router.navigate({
                  to: '/manage-groups/$groupId/settings',
                  params: { groupId: activeGroup.id },
                });
              }}
            >
              <Icon icon="ph:gear-six-bold" className="size-5" />
            </Button>
          </div>
        </div>
      </Page.Header>

      <Page.Content className="p-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
          {/* Main List - 70% width on desktop */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border bg-card/30 overflow-hidden shadow-sm h-full flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_140px_80px] items-center gap-4 px-4 py-2.5 bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground/80 lowercase first-letter:uppercase">
                    Membros
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 text-[9px] bg-foreground/10 text-muted-foreground border-none shadow-none font-bold"
                  >
                    {activeGroup.members?.length}
                  </Badge>
                </div>
                <div className="hidden md:block text-center">Função</div>
                <div className="md:text-right hidden sm:block">Ações</div>
              </div>

              <div className="divide-y divide-muted/50 flex-1">
                {activeGroup.members?.map((member: any) => (
                  <div
                    key={member.userId}
                    className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_140px_80px] items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar className="size-9 border">
                          <AvatarImage src={member.image} />
                          <AvatarFallback className="text-xs bg-muted">
                            {getInitials({
                              fullName: member.name ?? 'Membro',
                              initialsLength: 2,
                              upperCase: true,
                            })}
                          </AvatarFallback>
                        </Avatar>
                        {member.role === 'owner' && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-background shadow-xs">
                            <Icon
                              icon="ph:crown-fill"
                              className="text-white size-2"
                            />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-none truncate">
                          {member.name}{' '}
                          {member.userId === session?.user?.id && (
                            <span className="text-primary/70 font-medium">
                              (Você)
                            </span>
                          )}
                        </p>
                        {/* Mobile Role Badge */}
                        <div className="md:hidden mt-1">
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-[8px] px-1 py-0 h-3.5 font-bold uppercase tracking-wider',
                              member.role === 'owner' &&
                                'bg-yellow-400/10 text-yellow-600 border-yellow-400/20',
                              member.role === 'moderator' &&
                                'bg-primary/10 text-primary border-primary/20',
                            )}
                          >
                            {member.role === 'owner'
                              ? 'Dono'
                              : member.role === 'moderator'
                                ? 'Mod'
                                : 'Membro'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Role Badge */}
                    <div className="hidden md:flex justify-center">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[9px] px-2 py-0.5 h-5 font-bold uppercase tracking-wider',
                          member.role === 'owner' &&
                            'bg-yellow-400/10 text-yellow-600 border-yellow-400/20',
                          member.role === 'moderator' &&
                            'bg-primary/10 text-primary border-primary/20',
                        )}
                      >
                        {member.role === 'owner'
                          ? 'Dono'
                          : member.role === 'moderator'
                            ? 'Moderador'
                            : 'Membro'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      {canManage &&
                        member.userId !== session?.user?.id &&
                        member.role !== 'owner' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              >
                                <Icon icon="ph:dots-three-vertical-bold" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem
                                className="font-medium px-4 py-3"
                                onClick={() => {
                                  haptics.selection();
                                  updateRole({
                                    groupId: activeGroup.id,
                                    memberId: member.userId,
                                    data: {
                                      role:
                                        member.role === 'moderator'
                                          ? 'member'
                                          : 'moderator',
                                    },
                                  });
                                }}
                              >
                                <Icon
                                  icon="ph:shield-bold"
                                  className="size-4 mr-2"
                                />
                                {member.role === 'moderator'
                                  ? 'Remover Moderador'
                                  : 'Tornar Moderador'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive font-medium px-4 py-3"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <RemoveGroupMemberAlertDialog
                                  groupId={activeGroup.id}
                                  memberId={member.userId}
                                  trigger={
                                    <div className="flex items-center w-full">
                                      <Icon
                                        icon="ph:user-minus-bold"
                                        className="size-4 mr-2"
                                      />
                                      Remover do Grupo
                                    </div>
                                  }
                                />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary pane - 30% width on desktop, bottom on mobile */}
          <div className="w-full md:w-80 flex-none space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">
                Resumo do Grupo
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">ID do Grupo</span>
                  <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded">
                    {activeGroup.id.split('-')[0]}...
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Privacidade</span>
                  <Badge className="h-5 text-[10px] px-1.5">Privado</Badge>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-destructive/70">
                Zona de Risco
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ao sair do grupo, você perderá acesso às compras compartilhadas
                e listas ativas.
              </p>
              <ConfirmDialog
                title="Sair do Grupo"
                description="Você tem certeza que deseja sair deste grupo? Você precisará de um novo convite para retornar."
                confirmText="Sair do Grupo"
                onConfirm={() => {
                  haptics.warning();
                  leaveGroup({ groupId: activeGroup.id });
                }}
              >
                <Button
                  variant="destructive"
                  size="xl"
                  className="w-full gap-2 font-bold shadow-sm"
                >
                  <Icon icon="ph:door-open-bold" className="size-5" />
                  Sair do Grupo
                </Button>
              </ConfirmDialog>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};
