import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import { InviteQRCode } from './invite-qr-code';
import { RemoveGroupMemberAlertDialog } from './remove-group-member-alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { useSession } from '@/infrastructure/auth/auth-client';
import { router } from '@/providers';

interface Props {
  groupId: string;
}

export const GroupDetails = ({ groupId }: Props) => {
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
        {
          title: 'Detalhes do Grupo',
          subTitle: 'Visualize os membros e convites do seu grupo.',
        },
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
    <Page>
      <Page.Header className="px-4 py-4 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              router.navigate({
                to: '/manage-groups/$groupId/settings',
                params: { groupId: activeGroup.id },
              })
            }
          >
            <Icon icon="ph:gear-six-bold" className="size-4" />
            Configurações
          </Button>

          <Button
            variant="secondary"
            className="gap-2"
            onClick={() =>
              router.navigate({
                to: '/manage-groups',
              })
            }
          >
            Voltar
          </Button>
        </div>
      </Page.Header>
      <Page.Content className="p-4">
        <div className="w-full">
          {/* Header with Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"></div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Group Info Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{activeGroup.name}</CardTitle>
                  <CardDescription>{activeGroup.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Criado em
                    </span>
                    <p className="text-sm">
                      {format(
                        new Date(activeGroup.createdAt),
                        'dd/MM/yyyy HH:mm',
                        { locale: ptBR },
                      )}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <ConfirmDialog
                      title="Sair do Grupo"
                      description="Você tem certeza que deseja sair do grupo?"
                      confirmText="Sair"
                      onConfirm={() => leaveGroup({ groupId: activeGroup.id })}
                    >
                      <Button variant="destructive" className="w-full gap-2">
                        <Icon icon="lucide:log-out" />
                        Sair do Grupo
                      </Button>
                    </ConfirmDialog>
                  </div>
                </CardContent>
              </Card>

              {/* Invite Section */}
              {canManage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Convidar Membros</CardTitle>
                    <CardDescription>
                      Compartilhe o código ou QR code abaixo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingInvite ? (
                      <Loading />
                    ) : inviteInfo ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm w-fit border">
                          <InviteQRCode
                            inviteCode={inviteInfo.inviteCode}
                            joinUrl={inviteInfo.joinUrl}
                          />
                        </div>
                        <div className="text-center w-full bg-accent/30 rounded-lg p-3 border border-dashed">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            Código do Grupo
                          </span>
                          <p className="text-xl font-black tracking-widest text-primary font-mono mt-0.5">
                            {inviteInfo.inviteCode}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-red-500 text-center">
                        Erro ao carregar convite
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Members List */}
            <div className="lg:col-span-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Membros ({activeGroup.members?.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {activeGroup.members?.map((member: any) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={member.image} />
                              <AvatarFallback>
                                {getInitials({
                                  fullName: member.name ?? 'Membro',
                                  initialsLength: 2,
                                  upperCase: true,
                                })}
                              </AvatarFallback>
                            </Avatar>
                            {member.role === 'owner' && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-background">
                                <Icon
                                  icon="ph:crown-fill"
                                  className="text-white w-2 h-2"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {member.name}{' '}
                              {member.userId === session?.user?.id && '(Você)'}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-4"
                              >
                                {member.role === 'owner'
                                  ? 'Proprietário'
                                  : member.role === 'moderator'
                                    ? 'Moderador'
                                    : 'Membro'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {canManage &&
                            member.userId !== session?.user?.id &&
                            member.role !== 'owner' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                  >
                                    <Icon icon="lucide:more-vertical" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateRole({
                                        groupId: activeGroup.id,
                                        memberId: member.userId,
                                        data: {
                                          role:
                                            member.role === 'moderator'
                                              ? 'member'
                                              : 'moderator',
                                        },
                                      })
                                    }
                                  >
                                    {member.role === 'moderator'
                                      ? 'Remover Moderador'
                                      : 'Tornar Moderador'}
                                  </DropdownMenuItem>
                                  <div className="border-t my-1" />
                                  <DropdownMenuItem className="text-destructive">
                                    <RemoveGroupMemberAlertDialog
                                      groupId={activeGroup.id}
                                      memberId={member.userId}
                                      trigger={
                                        <span className="w-full text-left">
                                          Remover do Grupo
                                        </span>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};
