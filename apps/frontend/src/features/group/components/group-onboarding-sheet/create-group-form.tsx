import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGroupOnboardingContext } from './group-onboarding-context';
import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Textarea,
} from '@/components';
import { useCreateGroupMutation } from '@/features/group/infrastructure';

const createGroupInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

type CreateGroupInput = z.infer<typeof createGroupInputSchema>;

export const CreateGroupForm = () => {
  const { openState } = useGroupOnboardingContext();

  const form = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupInputSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { control, handleSubmit, reset } = form;

  const { mutateAsync } = useCreateGroupMutation();

  const onFinished = () => {
    reset();
    openState?.setOpen(false);
  };

  const onSubmit = async (values: CreateGroupInput) => {
    await mutateAsync({
      data: {
        name: values.name,
        description: values.description,
      },
    });

    onFinished();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        control={control}
        name={'name'}
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{field.name}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Nome do grupo"
                autoComplete="off"
              />
              <FieldDescription>Digite aqui o nome do grupo</FieldDescription>
            </Field>
          );
        }}
      />

      <Controller
        control={control}
        name={'description'}
        render={({ field, fieldState }) => {
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{field.name}</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Descrição do grupo"
                autoComplete="off"
              />
              <FieldDescription>
                Digite aqui a descrição do grupo
              </FieldDescription>
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
