import { Dispatch, ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ComboboxValue } from './types';

export interface ComboboxContextProps {
  isLoading?: boolean;
  items: ComboboxValue[];
  setItems: Dispatch<React.SetStateAction<ComboboxValue[]>>;
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  value: string;
  onValueChange: Dispatch<React.SetStateAction<string>>;
}

export const ComboboxContext = createContext({} as ComboboxContextProps);

export const useComboboxContext = () => {
  const context = useContext(ComboboxContext);

  if (!context) {
    throw new Error('useComboboxContext must be used within a ComboboxProvider');
  }

  return context;
};

type Props = {
  isLoading?: boolean;
  initialItems?: ComboboxValue[];
  value: string;
  onValueChange: Dispatch<React.SetStateAction<string>>;
  children: ReactNode;
};

export const ComboboxProvider = ({
  children,
  initialItems,
  value,
  onValueChange,
  isLoading = false,
}: Props) => {
  const [items, setItems] = useState<ComboboxValue[]>(initialItems ?? []);

  const [open, setOpen] = useState(false);

  const memoizedValue = useMemo<ComboboxContextProps>(
    () => ({
      isLoading,
      items,
      setItems,
      open,
      setOpen,
      value,
      onValueChange,
    }),
    [items, open, value, onValueChange, isLoading],
  );

  return <ComboboxContext.Provider value={memoizedValue}>{children}</ComboboxContext.Provider>;
};
