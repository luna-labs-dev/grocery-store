import { Icon } from '@iconify/react';
import { InviteQRCode } from './invite-qr-code';
import { Button, Loading } from '@/components';
import { ResponsiveDrawer } from '@/components/shared/responsive-drawer';
import { useHaptics } from '@/hooks/use-haptics';

interface GroupInviteDrawerProps {
  inviteInfo:
    | {
        inviteCode: string;
        joinUrl: string;
      }
    | null
    | undefined;
  isLoading: boolean;
  trigger?: React.ReactNode;
}

export const GroupInviteDrawer = ({
  inviteInfo,
  isLoading,
  trigger,
}: GroupInviteDrawerProps) => {
  const haptics = useHaptics();

  return (
    <ResponsiveDrawer
      trigger={
        trigger || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
            onClick={() => haptics.selection()}
          >
            <Icon icon="ph:user-plus-bold" className="size-4" />
            <span className="hidden xs:inline">Convidar</span>
          </Button>
        )
      }
      title="Convidar para o Grupo"
      description="Compartilhe o código ou o link abaixo para trazer novos membros."
      onOpenChange={(open) => open && haptics.impact()}
    >
      <div className="p-4 flex flex-col items-center justify-center">
        {isLoading ? (
          <Loading text="Gerando convite..." />
        ) : inviteInfo ? (
          <div className="w-full space-y-4">
            <InviteQRCode
              inviteCode={inviteInfo.inviteCode}
              joinUrl={inviteInfo.joinUrl}
            />
          </div>
        ) : (
          <p className="text-sm text-destructive">Erro ao carregar convite.</p>
        )}
      </div>
    </ResponsiveDrawer>
  );
};
