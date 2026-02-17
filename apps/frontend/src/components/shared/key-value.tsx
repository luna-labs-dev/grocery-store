import { Item, ItemContent, ItemDescription, ItemTitle } from '../ui';
import { cn } from '@/lib/utils';

interface KeyValueProps {
  props: {
    title: string;
    text: string;
  };
  className?: string;
}

export const KeyValue = ({
  props: { title, text },
  className,
}: KeyValueProps) => {
  return (
    <Item className={cn('px-1 py-0.5 bg-accent/30', className)}>
      <ItemContent>
        <ItemTitle className="text-xs">{title}</ItemTitle>
        <ItemDescription className="text-sm">{text}</ItemDescription>
      </ItemContent>
    </Item>
  );
};
