import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useHaptics } from '@/hooks/use-haptics';

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  children,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  const haptics = useHaptics();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setIsOpen = (val: boolean) => {
    if (val) haptics.selection();
    if (isControlled) {
      onOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  const handleConfirm = () => {
    haptics.success();
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    haptics.light();
    setIsOpen(false);
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={title}
      description={description}
      trigger={children}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={handleConfirm}
          className="w-full sm:w-auto"
        >
          {confirmText}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
