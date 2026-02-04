import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from '@/components';
import {
  useGetMarketByIdQuery,
  useNewMarketMutation,
  useUpdateMarketMutation,
} from '@/features/market/infrastructure';

const FormInputSchema = z.object({
  marketName: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
});

type FormInput = z.infer<typeof FormInputSchema>;

interface MarketFormProps {
  updateProps?: {
    setOpen?: (open: boolean) => void;
    marketId?: string;
  };
}

export const MarketForm = ({ updateProps }: MarketFormProps) => {
  const navigate = useNavigate();

  const {
    data: market,
    isFetching,
    isEnabled,
  } = useGetMarketByIdQuery({
    marketId: updateProps?.marketId,
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
    defaultValues: {
      marketName: '',
    },
  });

  const { control, handleSubmit, reset, setValue } = form;

  useEffect(() => {
    if (market) {
      setValue('marketName', market.name);
    }
  }, [market, setValue]);

  const { mutateAsync: newMutateAsync, isPending: newIsPending } =
    useNewMarketMutation();
  const { mutateAsync: updateMutateAsync, isPending: updateIsPending } =
    useUpdateMarketMutation();

  const onFinished = () => {
    if (updateProps?.setOpen) {
      updateProps.setOpen(false);
    }
    navigate({ to: '/market' });
  };

  const onSubmit = async (values: FormInput) => {
    if (market) {
      const { id } = market;
      await updateMutateAsync({
        marketId: id,
        marketName: values.marketName,
      });
    } else {
      await newMutateAsync(values);
    }
    onFinished();
  };

  const isPending = newIsPending || updateIsPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        control={control}
        name="marketName"
        render={({ field, fieldState }) => {
          return (
            <Field>
              <FieldLabel aria-invalid={fieldState.invalid}>
                {field.name}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder={
                  isEnabled && isFetching ? 'Carregando...' : 'Nome do mercado'
                }
                disabled={isPending}
              />
              {fieldState.invalid ? (
                <FieldError>{fieldState.error?.message}</FieldError>
              ) : (
                <FieldDescription>
                  Digite aqui o nome do mercado
                </FieldDescription>
              )}
            </Field>
          );
        }}
      />

      <div className="flex flex-col-reverse items-end gap-4 md:justify-end md:flex-row">
        <Button
          onClick={() => {
            reset();
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
