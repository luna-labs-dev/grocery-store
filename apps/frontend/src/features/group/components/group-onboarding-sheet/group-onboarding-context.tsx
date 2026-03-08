import { createContext, useContext } from 'react';

interface ContextProps {
  openState: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const GroupOnboardingContext = createContext<ContextProps | null>(null);

export const useGroupOnboardingContext = () => {
  const context = useContext(GroupOnboardingContext);

  if (!context) {
    throw new Error(
      'GroupOnboardingContext must be used within a GroupOnboardingProvider',
    );
  }
  return context;
};
