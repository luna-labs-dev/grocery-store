import { Icon } from '@iconify/react';
import { useClipboard } from '@mantine/hooks';
import { Link, type LinkProps } from '@tanstack/react-router';
import { toast } from 'sonner';
import { SidebarUser } from './sidebar-user';
import {
  Button,
  GroceryfyLogo,
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
      title: 'Family',
      to: '/family',
      icon: 'material-symbols-light:family-group',
    },
    {
      title: 'Market',
      to: '/market',
      icon: 'lsicon:marketplace-outline',
    },
    {
      title: 'Shopping Event',
      to: '/shopping-event',
      icon: 'tabler:calendar-event',
    },
  ];

  const menuGroups: Group[] = [
    {
      title: 'Home',
      items: dashboards,
    },
    {
      title: 'Sessões',
      items: pages,
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
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
