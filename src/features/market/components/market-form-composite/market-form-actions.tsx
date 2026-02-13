import { useMarketFormContext } from './market-form-context';
import { Button, ButtonGroup } from '@/components';
import HourglassIcon from '@/components/hourglass-icon';

export const MarketFormActions = () => {
  const { isSubmitting, onFinished } = useMarketFormContext();

  return (
    <div className="flex items-end gap-4 justify-end ">
      <ButtonGroup>
        <Button
          onClick={onFinished}
          variant={'outline'}
          type="button"
          className="w-24"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-24" disabled={isSubmitting}>
          {isSubmitting && <HourglassIcon size={18} />}
          Salver
        </Button>
      </ButtonGroup>
    </div>
  );
};
