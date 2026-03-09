import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/infrastructure/auth/auth-client';

export const SigninPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-6 bg-background p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500">
          Grocery Store
        </h1>
        <p className="text-muted-foreground">
          Entre para gerenciar suas compras com facilidade.
        </p>
      </div>

      <Button
        className="w-full max-w-sm py-6 text-lg font-semibold"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icon icon="line-md:loading-twotone-loop" className="mr-2 size-5" />
        ) : (
          <Icon icon="logos:google-icon" className="mr-2 size-5" />
        )}
        Entrar com Google
      </Button>

      <p className="text-xs text-muted-foreground">
        Ao entrar, você concorda com nossos termos de serviço.
      </p>
    </div>
  );
};
