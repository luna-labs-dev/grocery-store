import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { GroupInviteDrawer } from '../components/group-invite-drawer';
import { Badge, Button, Loading } from '@/components';
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
            to: `/manage-groups/${groupId}/settings` as string as '/manage-groups/$groupId/settings',
          },
        ],
        { title: '' },
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
          <Button size="sm" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header className="mx-4 rounded-xl p-4 border bg-card">
        <div className="flex items-center gap-2 w-full h-10">
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => {
              haptics.light();
              window.history.back();
            }}
          >
            <Icon icon="ph:arrow-left-bold" className="size-5" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base font-bold tracking-tight truncate">
              Ajustes do Grupo
            </h1>
            <Badge
              variant="secondary"
              className="hidden xs:inline-flex text-[10px] h-5 px-1.5 font-bold uppercase"
            >
              {group.name}
            </Badge>
          </div>
        </div>
      </Page.Header>

      <Page.Content className="p-4 bg-muted/5">
        <div className="lg:grid lg:grid-cols-2 gap-4 transition-all h-full">
          {/* General Information */}
          <section className="space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-4 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">
                Informações Gerais
              </h2>
              <form
                onSubmit={form.handleSubmit(onUpdateGroup)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80"
                  >
                    Nome do Grupo
                  </label>
                  <input
                    {...form.register('name')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
                    placeholder="Ex: Minha Casa"
                  />
                  {form.formState.errors.name && (
                    <p className="text-[10px] text-destructive font-bold">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="description"
                    className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80"
                  >
                    Descrição (Opcional)
                  </label>
                  <textarea
                    {...form.register('description')}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium"
                    placeholder="Uma breve descrição"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full h-11 font-bold shadow-sm"
                >
                  {isUpdating && (
                    <Icon
                      icon="line-md:loading-twotone-loop"
                      className="mr-2"
                    />
                  )}
                  Salvar Alterações
                </Button>
              </form>
            </div>
          </section>

          {/* Access & Invitations */}
          <section className="space-y-4">
            <div className="rounded-xl border bg-card overflow-hidden shadow-sm divide-y">
              <div className="p-4 pb-2">
                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70">
                  Acesso e Convites
                </h2>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/5">
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-bold truncate">
                    Convite por Código/QR
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                    Visualize ou gere novos códigos de acesso.
                  </p>
                </div>
                <GroupInviteDrawer
                  inviteInfo={inviteInfo}
                  isLoading={isLoadingInvite}
                  trigger={
                    <Button
                      variant="secondary"
                      size="sm"
                      className="font-bold h-9 shrink-0 shadow-xs"
                    >
                      Visualizar
                    </Button>
                  }
                />
              </div>
              <div className="p-4 bg-accent/10">
                <ConfirmDialog
                  title="Regenerar Convite"
                  description="O código anterior parará de funcionar imediatamente. Continuar?"
                  confirmText="Regenerar"
                  onConfirm={onRegenerateInvite}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-bold">Novo Código</p>
                      <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                        Invalida convites antigos instantaneamente.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-bold h-9 shrink-0 bg-background"
                      disabled={isRegenerating}
                    >
                      <Icon
                        icon="ph:arrows-clockwise-bold"
                        className={cn(
                          'size-4 mr-1.5',
                          isRegenerating && 'animate-spin',
                        )}
                      />
                      Regenerar
                    </Button>
                  </div>
                </ConfirmDialog>
              </div>
            </div>
          </section>
        </div>
      </Page.Content>

      <Page.Footer className="pb-4 bg-muted/5">
        <div className="mx-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase tracking-widest text-destructive/70 mb-1">
                Zona de Perigo
              </h2>
              <p className="text-sm font-bold text-destructive">
                Deletar Grupo
              </p>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                Ação irreversível.
              </p>
            </div>
            <ConfirmDialog
              title="Deletar Grupo"
              description="VOCÊ TEM CERTEZA? Esta ação é irreversível."
              confirmText="Sim, Deletar Grupo"
              variant="destructive"
              onConfirm={onDeleteGroup}
            >
              <Button
                variant="destructive"
                size="xl"
                className="font-bold w-full sm:w-auto px-8 shadow-sm"
                disabled={isDeleting}
              >
                <Icon icon="ph:trash-bold" className="size-4 mr-2" />
                Deletar Grupo
              </Button>
            </ConfirmDialog>
          </div>
        </div>
      </Page.Footer>
    </Page>
  );
};
