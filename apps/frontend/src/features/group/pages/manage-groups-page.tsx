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
      <Page.Header className="mx-4 rounded-xl p-4 border bg-card">
        <div className="flex items-center justify-between w-full h-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Meus Grupos</h1>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 hidden sm:inline-flex"
            >
              {groups?.length || 0}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <GroupOnboardingSideForm.Sheet
              trigger={
                <Button
                  variant="outline"
                  size="icon-xl"
                  type="button"
                  className="sm:hidden"
                >
                  <Icon icon="ph:plus-bold" className="size-5" />
                </Button>
              }
              context={{
                title: 'Criar Novo Grupo',
                description: 'Crie um espaço de colaboração para suas compras.',
              }}
            >
              <GroupOnboardingSideForm.CreateForm />
            </GroupOnboardingSideForm.Sheet>
            <GroupOnboardingSideForm.Sheet
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hidden sm:flex"
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
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
            {groups?.map((group, index) => {
              const isActive = group.id === activeGroup?.id;
              const isOwner = group.createdBy === session?.user.id;

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border bg-card p-3 sm:p-4 transition-all',
                    isActive
                      ? 'border-primary ring-1 ring-primary/20 shadow-sm bg-primary/5'
                      : 'hover:border-primary/50 shadow-xs',
                  )}
                >
                  <div className="flex flex-col h-full gap-2 sm:gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 pr-16 sm:pr-20">
                        <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                          {group.name}
                        </h3>
                        {group.description && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5 font-medium">
                            {group.description}
                          </p>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 shrink-0 flex items-center gap-1.5">
                        {isActive ? (
                          <Badge className="bg-primary text-primary-foreground h-5 sm:h-6 text-[9px] sm:text-[10px] px-2 font-black uppercase tracking-tight">
                            Ativo
                          </Badge>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 sm:h-7 text-[9px] sm:text-[10px] font-black uppercase px-2 gap-1.5 shadow-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSwitchGroup(group.id);
                            }}
                          >
                            <Icon
                              icon="lucide:log-in"
                              className="size-3 sm:size-3.5"
                            />
                            Selecionar
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-muted-foreground mt-auto pt-2 sm:pt-3 border-t border-muted/50">
                      <div className="flex items-center gap-1 font-medium">
                        <Icon
                          icon="ph:users-three"
                          className="size-3 sm:size-3.5"
                        />
                        {group.members?.length || 0}
                      </div>
                      {isOwner && (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <Icon
                            icon="ph:crown"
                            className="size-3 sm:size-3.5"
                          />
                          Dono
                        </div>
                      )}
                    </div>

                    <div className="pt-1">
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <Button
                          className="w-full gap-1.5 font-semibold text-[10px] sm:text-xs h-8 sm:h-9 px-0"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            haptics.light();
                            navigate({
                              to: '/manage-groups/$groupId',
                              params: { groupId: group.id },
                            });
                          }}
                          type="button"
                        >
                          <Icon
                            icon="ph:info-bold"
                            className="size-3.5 sm:size-4"
                          />
                          Ver
                        </Button>
                        <Button
                          className="w-full gap-1.5 font-semibold text-[10px] sm:text-xs h-8 sm:h-9 px-0"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            haptics.light();
                            navigate({
                              to: '/manage-groups/$groupId/settings',
                              params: { groupId: group.id },
                            });
                          }}
                          type="button"
                        >
                          <Icon
                            icon="ph:gear-six-bold"
                            className="size-3.5 sm:size-4"
                          />
                          Ajustes
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <GroupOnboardingSideForm.Sheet
              trigger={
                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-muted-foreground/25 p-4 transition-all hover:bg-accent/50 hover:border-primary/50 group w-full min-h-[160px] shadow-xs"
                >
                  <div className="size-11 rounded-full bg-muted flex items-center justify-center transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon icon="ph:plus-bold" className="size-5" />
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-base leading-tight">
                      Adicionar Grupo
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium mt-1 block">
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
                    <span className="bg-background px-2 text-muted-foreground font-bold">
                      Ou
                    </span>
                  </div>
                </div>
                <GroupOnboardingSideForm.JoinForm />
              </div>
            </GroupOnboardingSideForm.Sheet>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};
