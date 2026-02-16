import { useProductFormContext } from './product-form-context';
import { Button } from '@/components';
import HourglassIcon from '@/components/hourglass-icon';

export const ProductFormActions = () => {
  const { isSubmitting, isUpdate, onCancel, form } = useProductFormContext();
  const { reset, formState } = form;

  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        variant={'outline'}
        type="button"
        disabled={isSubmitting}
        className="w-24"
        onClick={() => {
          reset();
          onCancel?.();
        }}
      >
        Cancelar
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting || formState.isValidating}
        className="w-32"
      >
        {isSubmitting && <HourglassIcon size={18} />}
        {isUpdate ? 'Atualizar' : 'Adicionar'}
      </Button>
    </div>
  );
};
