import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { Breadcrumbs } from './breadcrumbs';
import { Separator, SidebarTrigger } from '@/components';
import { useBreadCrumbs } from '@/hooks';
import { useHaptics } from '@/hooks/use-haptics';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from '@/providers';

export const MainHeader = () => {
  const isMobile = useIsMobile();
  const { currentPage, breadcrumbs } = useBreadCrumbs();
  const navigate = useNavigate();
  const haptics = useHaptics();

  const handleBack = () => {
    haptics.light();
    if (breadcrumbs.length > 1) {
      const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      navigate({ to: parentBreadcrumb.to });
    } else {
      window.history.back();
    }
  };

  const hasBackAction = isMobile && breadcrumbs.length > 1;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 relative">
        {isMobile ? (
          <>
            <div className="flex items-center size-9">
              {hasBackAction && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="size-9 flex items-center justify-center -ml-2 rounded-full active:bg-accent transition-colors"
                >
                  <Icon icon="mingcute:left-line" className="size-6" />
                </button>
              )}
            </div>

            <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 overflow-hidden w-[60%]">
              <h1 className="text-sm font-bold tracking-tight truncate w-full text-center">
                {currentPage.title}
              </h1>
              {currentPage.subTitle && (
                <p className="text-[10px] text-muted-foreground truncate w-full text-center leading-none mt-0.5">
                  {currentPage.subTitle}
                </p>
              )}
            </div>

            <ModeToggle />
          </>
        ) : (
          <>
            <div className="flex shrink-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumbs />
            </div>
            <ModeToggle />
          </>
        )}
      </header>

      {!isMobile && (
        <div className="flex flex-col px-4 pt-4">
          <h1 className="text-lg font-semibold">{currentPage.title}</h1>
          <p className="text-sm text-muted-foreground">
            {currentPage.subTitle}
          </p>
        </div>
      )}
    </>
  );
};
