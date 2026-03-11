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
      <SidebarInset className="h-svh flex flex-col pb-16 md:pb-0">
        <MainHeader />
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </main>
      </SidebarInset>
      <MobileTabBar />
    </SidebarProvider>
  );
};
