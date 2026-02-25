import { Icon } from '@iconify/react';
import { useGetPosition } from './use-get-position';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from '@/components';

export const GetPositionPermissinDialog = () => {
  const {
    permissionStatus,
    promptUser,
    permissionDialogOpen,
    setPermissionDialogOpen,
  } = useGetPosition();

  const handleAllow = () => {
    promptUser();
  };
  return (
    <Dialog open={permissionDialogOpen} onOpenChange={setPermissionDialogOpen}>
      {/* <DialogTrigger>Abrir</DialogTrigger> */}
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Acesso a localização do dispositivo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 my-4 text-center">
          <Icon
            icon={'ic:twotone-share-location'}
            className="size-16 text-muted-foreground"
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Para encontrar os mercados mais próximos de você, precisamos
              acessar a localização do seu dispositivo.
            </p>
            <p className="text-xs text-muted-foreground">
              Não armazenamos sua localização nem a utilizamos para outros fins.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-4">
          <Button
            onClick={handleAllow}
            disabled={permissionStatus === 'prompted'}
          >
            {permissionStatus === 'prompted' && <Spinner className="size-4" />}
            Permitir
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
