import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import React, { type ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  type FormInput,
  FormInputSchema,
  MarketFormProvider,
} from './market-form-context';
import {
  useGetMarketByIdQuery,
  useNewMarketMutation,
  useUpdateMarketMutation,
} from '@/features/market/infrastructure';
import { cn } from '@/lib/utils';

interface MarketFormRootProps {
  marketId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  children: ReactNode;
}

export const MarketFormRoot = ({
  marketId,
  onSuccess,
  onCancel,
  children,
  className,
  ...props
}: MarketFormRootProps & React.ComponentProps<'form'>) => {
  const navigate = useNavigate();
  const isUpdate = !!marketId;

  const {
    data: market,
    isFetching,
    isEnabled,
  } = useGetMarketByIdQuery({
    marketId,
  });

  const form = useForm<FormInput>({
    resolver: zodResolver(FormInputSchema),
    mode: 'onChange',
    defaultValues: {
      marketName: '',
    },
  });

  const { handleSubmit, setValue, reset } = form;

  useEffect(() => {
    if (market) {
      setValue('marketName', market.name);
    }
  }, [market, setValue]);

  const { mutateAsync: newMutateAsync, isPending: newIsPending } =
    useNewMarketMutation();
  const { mutateAsync: updateMutateAsync, isPending: updateIsPending } =
    useUpdateMarketMutation();

  const isSubmitting = newIsPending || updateIsPending;

  const onFinished = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate({ to: '/market' });
    }
  };

  const onSubmit = async (values: FormInput) => {
    if (market) {
      await updateMutateAsync({
        marketId: market.id,
        marketName: values.marketName,
      });
    } else {
      await newMutateAsync(values);
    }
    onFinished();
  };

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    } else {
      onFinished();
    }
  };

  return (
    <MarketFormProvider
      value={{
        form,
        isSubmitting,
        isUpdate,
        onFinished: handleCancel, // Using handleCancel for the "Finished" action which usually means cancel/back
        isLoading: isEnabled && isFetching,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('flex flex-col h-full w-full', className)}
        {...props}
      >
        {children}
      </form>
    </MarketFormProvider>
  );
};
