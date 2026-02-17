import { Icon } from '@iconify/react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui';

interface KeyValueWithIconProps {
  props: {
    title: string;
    text: string;
    iconName: string;
  };
}

export const KeyValueWithIcon = ({
  props: { title, text, iconName },
}: KeyValueWithIconProps) => {
  return (
    <Item className="p-0">
      <ItemMedia variant={'icon'}>
        <Icon icon={iconName} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{text}</ItemDescription>
      </ItemContent>
    </Item>
  );
};
