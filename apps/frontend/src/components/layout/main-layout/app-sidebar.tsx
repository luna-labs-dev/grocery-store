import { Icon } from '@iconify/react';
import { useClipboard } from '@mantine/hooks';
import { Link, type LinkProps, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { SidebarUser } from './sidebar-user';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GroceryfyLogo,
  Loading,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components';
import { GroupOnboardingSideForm } from '@/features/group/components/group-onboarding-sheet';
import { InviteQRCode } from '@/features/group/components/invite-qr-code';
import { useGetInviteInfoQuery } from '@/features/group/infrastructure';

function SidebarInviteDialog({
  groupId,
  children,
}: {
  groupId: string;
  children: React.ReactNode;
}) {
  const { data: inviteInfo, isLoading } = useGetInviteInfoQuery(groupId);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar Membro</DialogTitle>
          <DialogDescription>
            Compartilhe o QR Code ou o link de convite.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {isLoading ? (
            <Loading />
          ) : inviteInfo ? (
            <InviteQRCode
              inviteCode={inviteInfo.inviteCode}
              joinUrl={inviteInfo.joinUrl}
            />
          ) : (
            <p className="text-sm text-red-500 text-center">
              Erro ao gerar convite.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import {
  useGetActiveGroupQuery,
  useListGroupsQuery,
} from '@/features/group/infrastructure';
import { useHaptics } from '@/hooks/use-haptics';
import { useIsMobile } from '@/hooks/use-mobile';
import { groupStorage } from '@/infrastructure/storage/group-storage';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: string;
  to: LinkProps['to'];
  target?: LinkProps['target'];
  copyUrl?: {
    icon: string;
    url: string;
  };
}

interface Group {
  title: string;
  items: MenuItem[];
}

export const AppSidebar = () => {
  const { open, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { data: groups } = useListGroupsQuery();
  const { data: activeGroup } = useGetActiveGroupQuery();
  const haptics = useHaptics();
  const navigate = useNavigate();

  const clipboard = useClipboard({
    timeout: 2000,
  });

  const dashboards: MenuItem[] = [
    {
      title: 'Dashboard',
      to: '/dashboard',
      icon: 'ri:dashboard-line',
    },
  ];

  const pages: MenuItem[] = [
    {
      title: 'Mercados',
      to: '/market',
      icon: 'lsicon:marketplace-outline',
    },
    {
      title: 'Eventos de Compra',
      to: '/shopping-event',
      icon: 'tabler:calendar-event',
    },
  ];

  const menuGroups: Group[] = [
    {
      title: 'Principais',
      items: [...dashboards, ...pages],
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu className="gap-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-2!"
            >
              <Link
                to="/dashboard"
                className="flex flex-col justify-center gap-2 transition-all duration-300 ease-in-out h-fit"
              >
                <GroceryfyLogo iconOnly={!open} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {groups && groups.length > 0 && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between h-12 px-3 mt-4 bg-accent/50 hover:bg-accent border border-border/50 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 shadow-sm">
                        {activeGroup?.name?.[0].toUpperCase()}
                      </div>
                      {open && (
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="truncate text-sm font-semibold leading-none">
                            {activeGroup?.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            Ativo no momento
                          </span>
                        </div>
                      )}
                    </div>
                    {open && (
                      <Icon
                        icon="lucide:chevrons-up-down"
                        className="size-4 text-muted-foreground shrink-0"
                      />
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="start"
                  side={isMobile ? 'bottom' : 'right'}
                >
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    Meus Grupos
                    <Link
                      to="/manage-groups"
                      className="text-[10px] hover:text-primary transition-colors flex items-center gap-0.5"
                    >
                      Ver todos
                      <Icon icon="lucide:chevron-right" className="size-3" />
                    </Link>
                  </div>
                  {groups.map((group) => (
                    <DropdownMenuItem
                      key={group.id}
                      className={cn(
                        'gap-2 cursor-pointer',
                        group.id === activeGroup?.id && 'bg-accent font-medium',
                      )}
                      onClick={() => {
                        haptics.selection();
                        groupStorage.setActiveGroupId(group.id);
                      }}
                    >
                      <div className="size-5 rounded bg-muted flex items-center justify-center text-[8px] font-bold">
                        {group.name[0].toUpperCase()}
                      </div>
                      {group.name}
                      {group.id === activeGroup?.id && (
                        <Icon
                          icon="lucide:check"
                          className="ml-auto size-3 text-primary"
                        />
                      )}
                    </DropdownMenuItem>
                  ))}

                  <div className="border-t my-1" />

                  {activeGroup && (
                    <SidebarInviteDialog groupId={activeGroup.id}>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-primary font-medium"
                        onSelect={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Icon icon="ph:user-plus-fill" className="size-4" />
                        Convidar Membro
                      </DropdownMenuItem>
                    </SidebarInviteDialog>
                  )}

                  <GroupOnboardingSideForm.Sheet
                    trigger={
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-emerald-600 font-medium"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Icon icon="ph:plus-circle-fill" className="size-4" />
                        Criar Novo Grupo
                      </DropdownMenuItem>
                    }
                    context={{
                      title: 'Criar Novo Grupo',
                      description:
                        'Crie um espaço de colaboração para suas compras.',
                    }}
                  >
                    <GroupOnboardingSideForm.CreateForm />
                  </GroupOnboardingSideForm.Sheet>

                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => {
                      haptics.light();
                      navigate({ to: '/manage-groups' });
                    }}
                  >
                    <Icon icon="ph:gear-six-fill" className="size-4" />
                    Gerenciar Grupos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={`${group.title}.${groupIndex}`}>
            <SidebarGroupLabel> {group.title} </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, index) => (
                  <SidebarMenuItem key={`${item.title}-${index}`}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.to}
                        target={item.target}
                        className="flex items-center justify-between"
                        onClick={() => {
                          setOpenMobile(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon={item.icon} className="size-4!" />
                          {open && item.title}
                        </div>
                        {item.copyUrl ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();

                              clipboard.copy(item.copyUrl?.url);

                              toast.info('Link copiado!');
                            }}
                            type="button"
                            variant="ghost"
                            className="cursor-pointer"
                          >
                            <Icon
                              icon={item.copyUrl.icon}
                              className="size-4!"
                            />
                          </Button>
                        ) : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
