import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { signOut, useSession } from '@/infrastructure/auth/auth-client';

export const SidebarUser = () => {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const user = session?.user;

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <Icon
                icon="mingcute:down-fill"
                className="ml-auto size-4 text-muted-foreground/50"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={() => navigate({ to: '/profile' })}
              className="gap-2 focus:bg-primary/10 focus:text-primary cursor-pointer py-2"
            >
              <Icon icon="mingcute:user-2-line" className="size-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ConfirmDialog
              title="Sair da Conta"
              description="Deseja realmente encerrar sua sessão?"
              confirmText="Sair"
              variant="destructive"
              onConfirm={() => signOut()}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2"
              >
                <Icon icon="mingcute:exit-line" className="size-4" />
                <span>Sair da Conta</span>
              </DropdownMenuItem>
            </ConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
