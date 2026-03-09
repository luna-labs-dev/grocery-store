import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { InviteQRCode } from '../components/invite-qr-code';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Loading,
} from '@/components';
import { Page } from '@/components/layout/page-layout';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
  useDeleteGroupMutation,
  useGetInviteInfoQuery,
  useListGroupsQuery,
  useRegenerateInviteCodeMutation,
  useUpdateGroupMutation,
} from '@/features/group/infrastructure';
import { useBreadCrumbs } from '@/hooks';
import { useHaptics } from '@/hooks/use-haptics';
import { cn } from '@/lib/utils';

const updateGroupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
});

type UpdateGroupForm = z.infer<typeof updateGroupSchema>;

interface Props {
  groupId: string;
}

export const GroupSettingsPage = ({ groupId }: Props) => {
  const haptics = useHaptics();
  const { data: groups, isLoading: isLoadingGroups } = useListGroupsQuery();
  const group = groups?.find((g) => g.id === groupId);
  const { addBreadcrumbs } = useBreadCrumbs();

  useEffect(() => {
    if (group) {
      addBreadcrumbs(
        [
          {
            label: 'Gerenciar Grupos',
            to: '/manage-groups',
          },
          {
            label: 'Configurações',
            to: `/manage-groups/${groupId}/settings` as any,
          },
        ],
        {
          title: 'Configurações do Grupo',
          subTitle: 'Gerencie as informações e convites do seu grupo.',
        },
      );
    }
  }, [addBreadcrumbs, groupId, group]);

  const { data: inviteInfo, isLoading: isLoadingInvite } =
    useGetInviteInfoQuery(groupId);
  const { mutate: updateGroup, isPending: isUpdating } =
    useUpdateGroupMutation();
  const { mutate: regenerateInvite, isPending: isRegenerating } =
    useRegenerateInviteCodeMutation();
  const { mutate: deleteGroup, isPending: isDeleting } =
    useDeleteGroupMutation();

  const form = useForm<UpdateGroupForm>({
    resolver: zodResolver(updateGroupSchema),
    values: {
      name: group?.name || '',
      description: group?.description || '',
    },
  });

  const onUpdateGroup = (data: UpdateGroupForm) => {
    updateGroup(
      {
        groupId,
        data,
      },
      {
        onSuccess: () => {
          haptics.success();
          toast.success('Grupo atualizado com sucesso!');
        },
        onError: () => haptics.error(),
      },
    );
  };

  const onRegenerateInvite = () => {
    haptics.medium();
    regenerateInvite(
      { groupId },
      {
        onSuccess: () => {
          haptics.success();
          toast.success('Novo convite gerado!');
        },
        onError: () => haptics.error(),
      },
    );
  };

  const onDeleteGroup = () => {
    haptics.warning();
    deleteGroup({ groupId });
  };

  if (isLoadingGroups) {
    return (
      <Page>
        <Page.Content className="flex items-center justify-center">
          <Loading text="Carregando configurações..." />
        </Page.Content>
      </Page>
    );
  }

  if (!group) {
    return (
      <Page>
        <Page.Content className="flex items-center justify-center flex-col gap-4">
          <p className="text-muted-foreground">Grupo não encontrado.</p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header>
        <div className="flex items-center gap-4 w-full px-4 py-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="h-8 w-8"
          >
            <Icon icon="ph:arrow-left-bold" />
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Gerenciar Grupo
            </h1>
            <Badge variant="outline">{group.name}</Badge>
          </div>
        </div>
      </Page.Header>

      <Page.Content className="p-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full max-w-[1400px] mx-auto">
          {/* Left Column: Form & Danger Zone */}
          <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
            <section className="space-y-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Informações Gerais</h2>
                <p className="text-sm text-muted-foreground">
                  Atualize o nome e a descrição do seu grupo.
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form
                    onSubmit={form.handleSubmit(onUpdateGroup)}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nome do Grupo
                      </label>
                      <input
                        {...form.register('name')}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ex: Minha Casa, República, etc"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Descrição (Opcional)
                      </label>
                      <textarea
                        {...form.register('description')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Uma breve descrição sobre o grupo"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="gap-2 w-full md:w-auto"
                    >
                      {isUpdating && (
                        <Icon icon="line-md:loading-twotone-loop" />
                      )}
                      Salvar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-2">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-destructive">
                  Zona de Perigo
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ações irreversíveis que afetam o grupo permanentemente.
                </p>
              </div>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6 flex flex-col gap-4">
                  <div>
                    <p className="font-bold">Deletar Grupo</p>
                    <p className="text-sm text-muted-foreground">
                      Todos os dados e membros serão removidos permanentemente.
                    </p>
                  </div>
                  <ConfirmDialog
                    title="Deletar Grupo"
                    description="VOCÊ TEM CERTEZA? Esta ação é irreversível e deletará todos os dados do grupo."
                    confirmText="Deletar Permanentemente"
                    variant="destructive"
                    onConfirm={onDeleteGroup}
                  >
                    <Button
                      variant="destructive"
                      className="gap-2 w-full md:w-auto self-start"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Icon icon="line-md:loading-twotone-loop" />
                      ) : (
                        <Icon icon="ph:trash-bold" />
                      )}
                      Deletar Permanentemente
                    </Button>
                  </ConfirmDialog>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column: Invite Settings */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <section className="space-y-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Convites</h2>
                <p className="text-sm text-muted-foreground">
                  Gerencie como novas pessoas podem entrar no grupo.
                </p>
              </div>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base uppercase tracking-wider text-muted-foreground">
                    Código de Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingInvite ? (
                    <div className="flex justify-center p-8">
                      <Loading />
                    </div>
                  ) : inviteInfo ? (
                    <div className="flex flex-col xl:flex-row gap-8 items-center justify-center bg-accent/30 p-8 rounded-xl border border-dashed h-full min-h-[300px]">
                      <div className="shrink-0 bg-white p-4 rounded-xl shadow-md border">
                        <InviteQRCode
                          inviteCode={inviteInfo.inviteCode}
                          joinUrl={inviteInfo.joinUrl}
                        />
                      </div>
                      <div className="space-y-6 text-center xl:text-left flex-1 max-w-sm">
                        <div className="space-y-2">
                          <span className="text-sm font-bold text-muted-foreground uppercase opacity-80">
                            Código do Grupo
                          </span>
                          <p className="text-4xl md:text-5xl font-black tracking-widest text-primary drop-shadow-sm pb-2">
                            {inviteInfo.inviteCode}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground/90">
                          Mostre este código ou tela para que seus convidados
                          possam escaneá-lo e entrar no grupo.
                        </p>
                        <ConfirmDialog
                          title="Regenerar Convite"
                          description="Ao regenerar o código, o link anterior parará de funcionar. Deseja continuar?"
                          confirmText="Regenerar"
                          onConfirm={onRegenerateInvite}
                        >
                          <Button
                            variant="outline"
                            disabled={isRegenerating}
                            className="gap-2 w-full"
                            size="lg"
                          >
                            <Icon
                              icon="ph:arrows-clockwise-bold"
                              className={cn(
                                'size-5',
                                isRegenerating && 'animate-spin',
                              )}
                            />
                            Gerar Novo Código
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center border rounded-xl border-destructive/50 bg-destructive/5">
                      <p className="text-destructive font-medium">
                        Erro ao carregar informações de convite.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};
