import { createContext, useContext } from 'react';

interface ContextProps {
  openState: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const FamilyOnboardingContext = createContext<ContextProps | null>(null);

export const useFamilyOnboardingContext = () => {
  const context = useContext(FamilyOnboardingContext);

  if (!context) {
    throw new Error(
      'FamilyOnboardingContext must be used within a FamilyOnboardingProvider',
    );
  }
  return context;
};
