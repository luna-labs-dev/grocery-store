import { useState } from 'react';
import { FamilyOnboardingContext } from './family-onboarding-context';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components';

interface FamilyOnboardingSheetProps {
  trigger: React.ReactElement;
  children: React.ReactElement;
  context: {
    title: string;
    description: string;
  };
}

export const FamilyOnboardingSheet = ({
  trigger,
  children,

  context,
}: FamilyOnboardingSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <FamilyOnboardingContext.Provider
      value={{
        openState: {
          open,
          setOpen,
        },
      }}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{context.title}</SheetTitle>
            <SheetDescription>{context.description}</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </FamilyOnboardingContext.Provider>
  );
};
