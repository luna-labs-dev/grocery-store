import { Item, ItemContent, ItemDescription, ItemTitle } from '../ui';

interface KeyValueWithIconProps {
  props: {
    title: string;
    text: string;
  };
}

export const KeyValue = ({ props: { title, text } }: KeyValueWithIconProps) => {
  return (
    <Item className="px-4 py-2 bg-accent/30">
      <ItemContent>
        <ItemTitle className="text-xs">{title}</ItemTitle>
        <ItemDescription className="text-sm">{text}</ItemDescription>
      </ItemContent>
    </Item>
  );
};
