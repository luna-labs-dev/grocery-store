import type { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PageProps {
  children: ReactNode;
  className?: string;
}

const Page = ({ children, className }: PageProps) => {
  return (
    <div className={cn('flex flex-col h-full overflow-hidden', className)}>
      {children}
    </div>
  );
};

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}

const PageHeader = ({ children, className }: PageHeaderProps) => {
  return (
    <header className={cn('flex-none bg-background z-10', className)}>
      {children}
    </header>
  );
};

interface PageContentProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}

const PageContent = ({
  children,
  className,
  scrollable = true,
}: PageContentProps) => {
  if (scrollable) {
    return (
      <ScrollArea className={cn('flex-1 min-h-0 w-full', className)}>
        <div className="min-h-full flex flex-col">{children}</div>
      </ScrollArea>
    );
  }

  return (
    <main className={cn('flex-1 overflow-hidden', className)}>{children}</main>
  );
};

interface PageFooterProps {
  children: ReactNode;
  className?: string;
}

const PageFooter = ({ children, className }: PageFooterProps) => {
  return (
    <footer className={cn('flex-none bg-background z-10', className)}>
      {children}
    </footer>
  );
};

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Footer = PageFooter;

export { Page };
