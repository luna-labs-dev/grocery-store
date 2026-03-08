import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { LogOut } from '@/components/animate-ui/icons/log-out';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui';
import { signOut, useSession } from '@/infrastructure/auth/auth-client';

export const SidebarUser = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="data-state-open:bg-sidebar-accent data-state-open:text-sidebar-accent-foreground flex p-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="rounded-lg">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AnimateIcon animate animateOnHover animation="default">
              <Button
                onClick={() => signOut()}
                variant={'outline'}
                className="cursor-pointer"
              >
                <LogOut />
              </Button>
            </AnimateIcon>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
