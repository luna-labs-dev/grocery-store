import type { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import { MainHeader } from './main-header';
import { SidebarInset, SidebarProvider } from '@/components';

interface MainLayoutProps {
  children: ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <MainHeader />
        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
