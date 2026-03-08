import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGroupOnboardingContext } from './group-onboarding-context';
import { Button, Field, FieldLabel, Input } from '@/components';
import { useJoinGroupMutation } from '@/features/group/infrastructure';

const JoinGroupInputSchema = z.object({
  inviteCode: z.string().min(2),
});

type JoinGroupInput = z.infer<typeof JoinGroupInputSchema>;

export const JoinGroupForm = () => {
  const { openState } = useGroupOnboardingContext();

  const form = useForm<JoinGroupInput>({
    resolver: zodResolver(JoinGroupInputSchema),
    mode: 'onChange',
    defaultValues: {
      inviteCode: '',
    },
  });

  const { control, handleSubmit, reset } = form;

  const { mutateAsync } = useJoinGroupMutation();

  const onFinished = () => {
    reset();
    openState?.setOpen(false);
  };

  const onSubmit = async (values: JoinGroupInput) => {
    await mutateAsync({
      data: {
        inviteCode: values.inviteCode,
      },
    });

    onFinished();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        control={control}
        name="inviteCode"
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{field.name}</FieldLabel>
              <Input
                {...field}
                placeholder="Codigo do convite"
                aria-invalid={fieldState.invalid}
              />
            </Field>
          );
        }}
      />

      <div className="flex flex-col-reverse items-end gap-4 md:justify-end md:flex-row">
        <Button
          onClick={() => {
            onFinished();
          }}
          variant={'outline'}
          type="button"
          className="w-24"
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-full md:w-24">
          Salvar
        </Button>
      </div>
    </form>
  );
};
