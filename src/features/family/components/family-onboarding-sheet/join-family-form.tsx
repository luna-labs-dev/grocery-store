import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFamilyOnboardingContext } from './family-onboarding-context';
import { Button, Field, FieldLabel, Input } from '@/components';
import { useJoinFamilyMutation } from '@/features/family/infrastructure';

const JoinFamilyInputSchema = z.object({
  inviteCode: z.string().min(2),
});

type JoinFamilyInput = z.infer<typeof JoinFamilyInputSchema>;

export const JoinFamilyForm = () => {
  const { openState } = useFamilyOnboardingContext();

  const form = useForm<JoinFamilyInput>({
    resolver: zodResolver(JoinFamilyInputSchema),
    defaultValues: {
      inviteCode: '',
    },
  });

  const { control, handleSubmit, reset } = form;

  const { mutateAsync } = useJoinFamilyMutation();

  const onFinished = () => {
    reset();
    openState?.setOpen(false);
  };

  const onSubmit = async (values: JoinFamilyInput) => {
    await mutateAsync({
      inviteCode: values.inviteCode,
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
