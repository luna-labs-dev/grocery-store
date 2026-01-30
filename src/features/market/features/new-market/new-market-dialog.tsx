import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components';
import { MarketForm } from '@/features/market/components';
import { cn } from '@/lib/utils';

interface NewMarketDialogProps {
  options: {
    triggerName: string;
    fullWidth?: boolean;
  };
}

export const NewMarketDialog = ({ options }: NewMarketDialogProps) => {
  const { triggerName, fullWidth } = options;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn('hidden md:block', fullWidth && 'w-full')}
          size={'sm'}
        >
          {triggerName}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Mercado</DialogTitle>
        </DialogHeader>
        <MarketForm
          updateProps={{
            setOpen: setOpen,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
