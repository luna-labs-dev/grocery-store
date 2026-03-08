import { useState } from 'react';
import { GroupOnboardingContext } from './group-onboarding-context';
import { ResponsiveDrawer } from '@/components';

interface GroupOnboardingSheetProps {
  trigger: React.ReactElement;
  children: React.ReactElement;
  context: {
    title: string;
    description: string;
  };
}

export const GroupOnboardingSheet = ({
  trigger,
  children,
  context,
}: GroupOnboardingSheetProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <GroupOnboardingContext.Provider
      value={{
        openState: {
          open,
          setOpen,
        },
      }}
    >
      <ResponsiveDrawer
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
        title={context.title}
        description={context.description}
      >
        {children}
      </ResponsiveDrawer>
    </GroupOnboardingContext.Provider>
  );
};
