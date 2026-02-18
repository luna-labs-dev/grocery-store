import { useState } from 'react';
import { EndShoppingEventForm } from './end-shopping-event-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components';

interface EndShoppingEventDialogProps {
  children: React.ReactElement;
  shoppingEventId: string;
}
export const EndShoppingEventDialog = ({
  children,
  shoppingEventId,
}: EndShoppingEventDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <EndShoppingEventForm
          shoppingEventId={shoppingEventId}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
