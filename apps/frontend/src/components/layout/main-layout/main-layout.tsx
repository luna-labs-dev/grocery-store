import type { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import { MainHeader } from './main-header';
import { MobileTabBar } from './mobile-tab-bar';
import { SidebarInset, SidebarProvider } from '@/components';

interface MainLayoutProps {
  children: ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset className="h-svh overflow-hidden pb-16 md:pb-0">
        <MainHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
      <MobileTabBar />
    </SidebarProvider>
  );
};
