import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { GroupOnboardingSideForm } from '../components/group-onboarding-sheet';
import { Badge, Button, Loading } from '@/components';
import { Page } from '@/components/layout/page-layout';
import {
  useGetActiveGroupQuery,
  useListGroupsQuery,
} from '@/features/group/infrastructure';
import { useHaptics } from '@/hooks/use-haptics';
import { useSession } from '@/infrastructure/auth/auth-client';
import { groupStorage } from '@/infrastructure/storage/group-storage';
import { cn } from '@/lib/utils';

export const ManageGroupsPage = () => {
  const navigate = useNavigate();
  const { data: groups, isLoading } = useListGroupsQuery();
  const { data: activeGroup } = useGetActiveGroupQuery();
  const { data: session } = useSession();
  const haptics = useHaptics();

  const handleSwitchGroup = (groupId: string) => {
    haptics.selection();
    groupStorage.setActiveGroupId(groupId);
    navigate({ to: '/dashboard' });
  };

  if (isLoading) {
    return (
      <Page>
        <Page.Content className="flex items-center justify-center">
          <Loading text="Carregando grupos..." />
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header>
        <div className="flex items-center justify-between w-full px-4 py-4 border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Meus Grupos</h1>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {groups?.length || 0}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <GroupOnboardingSideForm.Sheet
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  type="button"
                >
                  <Icon icon="ph:plus-bold" className="size-4" />
                  Criar Novo
                </Button>
              }
              context={{
                title: 'Criar Novo Grupo',
                description: 'Crie um espaço de colaboração para suas compras.',
              }}
            >
              <GroupOnboardingSideForm.CreateForm />
            </GroupOnboardingSideForm.Sheet>
          </div>
        </div>
      </Page.Header>

      <Page.Content className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups?.map((group, index) => {
            const isActive = group.id === activeGroup?.id;
            const isOwner = group.createdBy === session?.user.id;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-lg',
                  isActive
                    ? 'border-primary ring-1 ring-primary/20 shadow-sm'
                    : 'hover:border-primary/50',
                )}
              >
                <div className="flex flex-col h-full gap-4">
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                      {group.name[0].toUpperCase()}
                    </div>
                    {isActive && (
                      <Badge className="bg-primary text-primary-foreground">
                        Ativo
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {group.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Icon icon="ph:users-three" className="size-4" />
                      {group.members?.length || 0} membros
                    </div>
                    {isOwner && (
                      <div className="flex items-center gap-1 text-emerald-600 font-medium">
                        <Icon icon="ph:crown" className="size-4" />
                        Dono
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="w-full h-9 gap-2"
                        variant="outline"
                        onClick={() => {
                          haptics.light();
                          navigate({
                            to: '/manage-groups/$groupId',
                            params: { groupId: group.id },
                          });
                        }}
                        type="button"
                      >
                        <Icon icon="ph:info-bold" />
                        Detalhes
                      </Button>
                      <Button
                        className="w-full h-9 gap-2"
                        variant="outline"
                        onClick={() => {
                          haptics.light();
                          navigate({
                            to: '/manage-groups/$groupId/settings',
                            params: { groupId: group.id },
                          });
                        }}
                        type="button"
                      >
                        <Icon icon="ph:gear-six-bold" />
                        Configurações
                      </Button>
                    </div>

                    <Button
                      className={cn(
                        'w-full h-9 gap-2',
                        isActive && 'opacity-50 cursor-default',
                      )}
                      variant={isActive ? 'secondary' : 'default'}
                      onClick={() => !isActive && handleSwitchGroup(group.id)}
                      type="button"
                    >
                      {isActive ? (
                        <>
                          <Icon icon="lucide:check" />
                          Selecionado
                        </>
                      ) : (
                        <>
                          <Icon icon="lucide:log-in" />
                          Selecionar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <GroupOnboardingSideForm.Sheet
            trigger={
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/25 p-6 transition-all hover:bg-accent/50 hover:border-primary/50 group w-full min-h-[200px]"
              >
                <div className="size-12 rounded-full bg-muted flex items-center justify-center transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon icon="ph:plus-bold" className="size-6" />
                </div>
                <div className="text-center">
                  <span className="block font-medium text-lg">
                    Adicionar Grupo
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Crie ou entre em um novo grupo
                  </span>
                </div>
              </button>
            }
            context={{
              title: 'Adicionar Grupo',
              description: 'Escolha uma opção para começar.',
            }}
          >
            <div className="space-y-4 pt-4">
              <GroupOnboardingSideForm.CreateForm />
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>
              <GroupOnboardingSideForm.JoinForm />
            </div>
          </GroupOnboardingSideForm.Sheet>
        </div>
      </Page.Content>
    </Page>
  );
};
