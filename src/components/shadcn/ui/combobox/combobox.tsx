import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn';
import { cn } from '@/lib/utils';
import { Dispatch, ReactNode } from 'react';
import { ComboboxProvider, useComboboxContext } from './combobox-provider';
import { ComboboxValue } from './types';

interface ChildrenProps {
  children: ReactNode;
}

interface ComboboxProps extends ChildrenProps {
  items: ComboboxValue[];
  isLoading?: boolean;
  value: string;
  onValueChange: Dispatch<React.SetStateAction<string>>;
}

export const Combobox = ({ isLoading, items, value, onValueChange, children }: ComboboxProps) => {
  return (
    <ComboboxProvider
      initialItems={items}
      isLoading={isLoading}
      value={value}
      onValueChange={onValueChange}
    >
      <Root>{children}</Root>
    </ComboboxProvider>
  );
};

interface RootProps extends ChildrenProps {}

const Root = ({ children }: RootProps) => {
  const { open, setOpen } = useComboboxContext();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {children}
    </Popover>
  );
};

interface TriggerProps {
  placeHolder?: string;
  className?: string;
}
export const ComboboxTrigger = ({ placeHolder, className }: TriggerProps) => {
  const { items, open, value } = useComboboxContext();

  return (
    <PopoverTrigger asChild className="w-full">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn('w-[200px] justify-between', className)}
      >
        {value ? items.find((item) => item.value === value)?.label : placeHolder}
        <ChevronsUpDown className="opacity-50" />
      </Button>
    </PopoverTrigger>
  );
};

interface ContentProps {
  placeHolder?: string;
  renderEmpty?: ReactNode;
  className?: string;
}

export const ComboboxContent = ({ placeHolder, renderEmpty, className }: ContentProps) => {
  const { isLoading, items, value, onValueChange, setOpen } = useComboboxContext();

  return (
    <PopoverContent className={cn('w-[200px] p-0', className)}>
      <Command
        filter={(value, search) => {
          const actualItem = items.find((item) => item.value === value);
          if (actualItem?.label.toLowerCase().includes(search.toLowerCase())) {
            return 1;
          }
          return 0;
        }}
      >
        <CommandInput placeholder={placeHolder} className="h-9" />
        <CommandList>
          <CommandEmpty>{renderEmpty}</CommandEmpty>
          <CommandGroup>
            {isLoading && <CommandItem>Carregando...</CommandItem>}
            {!isLoading &&
              items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn('ml-auto', value === item.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
};
