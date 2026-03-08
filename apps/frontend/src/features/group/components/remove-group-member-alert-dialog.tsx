import { Icon } from '@iconify/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/components';
import { useRemoveGroupMemberMutation } from '@/features/group/infrastructure';

interface Props {
  groupId: string;
  memberId: string;
  trigger?: React.ReactNode;
}
export const RemoveGroupMemberAlertDialog = ({
  groupId,
  memberId,
  trigger,
}: Props) => {
  const { mutateAsync } = useRemoveGroupMemberMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 text-red-600 hover:text-red-700"
          >
            <Icon icon="icons8:remove-user" fontSize={'1.1rem'} />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover membro do grupo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover este membro do seu grupo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutateAsync({ groupId, memberId });
            }}
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
