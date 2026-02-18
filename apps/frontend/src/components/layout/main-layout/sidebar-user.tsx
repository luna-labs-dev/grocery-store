import { useAuth, useUser } from '@clerk/clerk-react';
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

export const SidebarUser = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="data-state-open:bg-sidebar-accent data-state-open:text-sidebar-accent-foreground flex p-2 justify-between items-center">
          <div className="flex items-cebter gap-2">
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="rounded-lg">
                {user?.fullName}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.firstName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.primaryEmailAddress?.emailAddress}
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
                {/* <Icon icon="uit:signout" className="w-4! h-4! text-red-600" /> */}
              </Button>
            </AnimateIcon>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
