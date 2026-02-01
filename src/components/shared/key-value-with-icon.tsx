import { Icon } from '@iconify/react';

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
    <div className="grid grid-cols-[20px_1fr] gap-2 items-start leading-none">
      <Icon icon={iconName} className="translate-y-[0.10rem]" fontSize={'20'} />

      <div className="">
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <p className="text-sm ">{text}</p>
      </div>
    </div>
  );
};
