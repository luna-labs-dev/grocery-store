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
import { useRemoveFamilyMemberMutation } from '@/features/family/infrastructure';

interface Props {
  memberId: string;
}
export const RemoveFamilyMemberAlertDialog = ({ memberId }: Props) => {
  const { mutateAsync } = useRemoveFamilyMemberMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 text-red-600 hover:text-red-700"
        >
          <Icon icon="icons8:remove-user" fontSize={'1.1rem'} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove family member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this member from your family?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutateAsync({ userToBeRemovedId: memberId });
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
