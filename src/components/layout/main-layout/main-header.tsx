import { Breadcrumbs } from './breadcrumbs';
import { Separator, SidebarTrigger } from '@/components';
import { useBreadCrumbs } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from '@/providers';

export const MainHeader = () => {
  const isMobile = useIsMobile();
  const { currentPage } = useBreadCrumbs();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
      <div className="flex flex-col px-4 pt-4">
        <h1 className="text-lg font-semibold">{currentPage.title}</h1>
        <p className="text-sm text-muted-foreground">{currentPage.subTitle}</p>
      </div>
    </>
  );
};
