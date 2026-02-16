import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
export const SigninPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SignIn
        appearance={{
          layout: {
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'blockButton',
          },
          theme: dark,
        }}
      />
    </div>
  );
};
