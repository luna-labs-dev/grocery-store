import type * as React from 'react';
import { Drawer } from 'vaul';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveDrawerProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const ResponsiveDrawer = ({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
  className,
}: ResponsiveDrawerProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Drawer.Content
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-fit max-h-[96%] flex-col rounded-t-[10px] bg-background border-t outline-none focus:ring-0',
              className,
            )}
          >
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted shrink-0" />
            <div className="flex flex-col p-4 pt-2 overflow-auto">
              <div className="space-y-1 text-center sm:text-left mb-4">
                <Drawer.Title className="text-lg font-semibold leading-none tracking-tight">
                  {title}
                </Drawer.Title>
                {description && (
                  <Drawer.Description className="text-sm text-muted-foreground">
                    {description}
                  </Drawer.Description>
                )}
              </div>
              {children}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
