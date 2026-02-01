import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, MoneyInput } from '@/components';
import { useEndShoppingEventMutation } from '@/features/shopping-event/infrastructure';

const FormInputSchema = z.object({
  totalPaid: z.number().min(0.01),
});

type FormInput = z.infer<typeof FormInputSchema>;

interface EndShoppingEventFormProps {
  shoppingEventId: string;
  setOpen: (value: boolean) => void;
}
export const EndShoppingEventForm = ({
  shoppingEventId,
  setOpen,
}: EndShoppingEventFormProps) => {
  const form = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
    defaultValues: {
      totalPaid: 0,
    },
  });

  const { handleSubmit } = form;

  const { mutateAsync } = useEndShoppingEventMutation();

  const onFinished = () => {
    setOpen(false);
  };

  const onSubmit = async (data: FormInput) => {
    const success = await mutateAsync({
      shoppingEventId,
      params: {
        totalPaid: data.totalPaid,
      },
    });
    if (success) {
      onFinished();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <MoneyInput
        form={form}
        label="Total Pago"
        name="totalPaid"
        placeholder="Total a ser pago"
      />
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={'outline'}
          type="button"
          className="w-full"
          onClick={() => {
            onFinished();
          }}
        >
          Cancelar
        </Button>

        <Button type="submit" className="w-full md:w-24">
          Finalizar
        </Button>
      </div>
    </form>
  );
};
