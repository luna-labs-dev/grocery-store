interface KeyValueWithIconProps {
  props: {
    title: string;
    text: string;
  };
}

export const KeyValue = ({ props: { title, text } }: KeyValueWithIconProps) => {
  return (
    <div className="leading-none">
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      <p className="text-sm">{text}</p>
    </div>
  );
};
