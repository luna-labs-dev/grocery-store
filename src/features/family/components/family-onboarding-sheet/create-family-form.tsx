import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useFamilyOnboardingContext } from './family-onboarding-context';
import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Textarea,
} from '@/components';
import { useCreateFamilyMutation } from '@/features/family/infrastructure';

const CreateFamilyInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

type CreateFamilyInput = z.infer<typeof CreateFamilyInputSchema>;

export const CreateFamilyForm = () => {
  const { openState } = useFamilyOnboardingContext();

  const form = useForm<CreateFamilyInput>({
    resolver: zodResolver(CreateFamilyInputSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { control, handleSubmit, reset } = form;

  const { mutateAsync } = useCreateFamilyMutation();

  const onFinished = () => {
    reset();
    openState?.setOpen(false);
  };

  const onSubmit = async (values: CreateFamilyInput) => {
    await mutateAsync({
      name: values.name,
      description: values.description,
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
                placeholder="Nome da família"
                autoComplete="off"
              />
              <FieldDescription>Digite aqui o nome da família</FieldDescription>
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
                placeholder="Descrição da família"
                autoComplete="off"
              />
              <FieldDescription>
                Digite aqui a descrição da família
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
