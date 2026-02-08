import type { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { Separator, SidebarInset, SidebarTrigger } from '@/components';
import { useBreadCrumbs } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from '@/providers';

interface MainLayoutProps {
  children: ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentPage } = useBreadCrumbs();
  const isMobile = useIsMobile();

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex shrink-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs />
          </div>
          {!isMobile && <ModeToggle />}
        </header>
        <main className="gap-2 flex-1 flex flex-col min-h-0 overflow-hidden px-4 pt-4">
          <div>
            <h1 className="text-base font-semibold">{currentPage.title}</h1>
            {currentPage.subTitle && (
              <p className="text-sm text-muted-foreground">
                {currentPage.subTitle}
              </p>
            )}
          </div>
          {children}
        </main>
      </SidebarInset>
    </>
  );
};
